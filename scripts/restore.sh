#!/bin/bash

# CRM Nexus Restore Script
# Restore database and files from backup

set -euo pipefail

# Configuration
BACKUP_DIR="/opt/backups/crm-nexus"
POSTGRES_CONTAINER="crm-nexus-postgres"
API_CONTAINER="crm-nexus-api"

# Load environment variables
source /opt/crm-nexus/.env.production

# Function to display usage
usage() {
  echo "Usage: $0 [OPTIONS] BACKUP_DATE"
  echo ""
  echo "Options:"
  echo "  -d, --database-only    Restore database only"
  echo "  -f, --files-only       Restore files only"
  echo "  -s, --from-s3          Download backup from S3"
  echo "  -h, --help             Show this help message"
  echo ""
  echo "Examples:"
  echo "  $0 20240115_143000                    # Restore full backup"
  echo "  $0 --database-only 20240115_143000   # Restore database only"
  echo "  $0 --from-s3 20240115_143000         # Download from S3 and restore"
  exit 1
}

# Parse command line arguments
DATABASE_ONLY=false
FILES_ONLY=false
FROM_S3=false
BACKUP_DATE=""

while [[ $# -gt 0 ]]; do
  case $1 in
    -d|--database-only)
      DATABASE_ONLY=true
      shift
      ;;
    -f|--files-only)
      FILES_ONLY=true
      shift
      ;;
    -s|--from-s3)
      FROM_S3=true
      shift
      ;;
    -h|--help)
      usage
      ;;
    *)
      BACKUP_DATE="$1"
      shift
      ;;
  esac
done

if [ -z "$BACKUP_DATE" ]; then
  echo "ERROR: Backup date is required"
  usage
fi

echo "Starting CRM Nexus restore process at $(date)"
echo "Restoring backup from: $BACKUP_DATE"

# Download from S3 if requested
if [ "$FROM_S3" = true ]; then
  if [ -z "${AWS_S3_BACKUP_BUCKET:-}" ]; then
    echo "ERROR: AWS_S3_BACKUP_BUCKET not configured"
    exit 1
  fi
  
  echo "Downloading backup from S3..."
  
  # Find the backup file in S3
  backup_year=$(echo $BACKUP_DATE | cut -c1-4)
  backup_month=$(echo $BACKUP_DATE | cut -c5-6)
  
  aws s3 cp "s3://${AWS_S3_BACKUP_BUCKET}/backups/${backup_year}/${backup_month}/crm_nexus_full_backup_${BACKUP_DATE}.tar.gz" \
    "${BACKUP_DIR}/"
  
  # Extract the backup
  tar -xzf "${BACKUP_DIR}/crm_nexus_full_backup_${BACKUP_DATE}.tar.gz" -C "${BACKUP_DIR}/"
fi

# Verify backup files exist
if [ "$FILES_ONLY" = false ]; then
  if [ ! -f "${BACKUP_DIR}/database/crm_nexus_${BACKUP_DATE}.backup" ]; then
    echo "ERROR: Database backup file not found: crm_nexus_${BACKUP_DATE}.backup"
    exit 1
  fi
fi

if [ "$DATABASE_ONLY" = false ]; then
  if [ ! -f "${BACKUP_DIR}/uploads/uploads_${BACKUP_DATE}.tar.gz" ]; then
    echo "WARNING: Uploads backup file not found: uploads_${BACKUP_DATE}.tar.gz"
  fi
fi

# Confirmation prompt
read -p "Are you sure you want to restore from backup ${BACKUP_DATE}? This will overwrite current data. (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Restore cancelled"
  exit 1
fi

# Stop application containers
echo "Stopping application containers..."
docker-compose -f /opt/crm-nexus/docker-compose.production.yml stop api web

# Restore database
if [ "$FILES_ONLY" = false ]; then
  echo "Restoring PostgreSQL database..."
  
  # Create a new database for restore
  docker exec ${POSTGRES_CONTAINER} createdb -U ${POSTGRES_USER} ${POSTGRES_DB}_restore || true
  
  # Restore to temporary database
  docker exec -i ${POSTGRES_CONTAINER} pg_restore \
    -U ${POSTGRES_USER} \
    -d ${POSTGRES_DB}_restore \
    --verbose \
    --clean \
    --if-exists < "${BACKUP_DIR}/database/crm_nexus_${BACKUP_DATE}.backup"
  
  # Verify restore
  restore_count=$(docker exec ${POSTGRES_CONTAINER} psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}_restore -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
  
  if [ "${restore_count// /}" -gt 0 ]; then
    echo "Database restore successful, swapping databases..."
    
    # Rename current database as backup
    docker exec ${POSTGRES_CONTAINER} psql -U ${POSTGRES_USER} -c "ALTER DATABASE ${POSTGRES_DB} RENAME TO ${POSTGRES_DB}_backup_$(date +%Y%m%d_%H%M%S);"
    
    # Rename restored database
    docker exec ${POSTGRES_CONTAINER} psql -U ${POSTGRES_USER} -c "ALTER DATABASE ${POSTGRES_DB}_restore RENAME TO ${POSTGRES_DB};"
    
    echo "Database restore completed successfully"
  else
    echo "ERROR: Database restore verification failed"
    docker exec ${POSTGRES_CONTAINER} dropdb -U ${POSTGRES_USER} ${POSTGRES_DB}_restore
    exit 1
  fi
fi

# Restore file uploads
if [ "$DATABASE_ONLY" = false ]; then
  if [ -f "${BACKUP_DIR}/uploads/uploads_${BACKUP_DATE}.tar.gz" ]; then
    echo "Restoring file uploads..."
    
    # Backup current uploads
    if [ -d "/opt/crm-nexus/uploads" ]; then
      mv /opt/crm-nexus/uploads "/opt/crm-nexus/uploads_backup_$(date +%Y%m%d_%H%M%S)"
    fi
    
    # Extract uploads
    tar -xzf "${BACKUP_DIR}/uploads/uploads_${BACKUP_DATE}.tar.gz" -C /opt/crm-nexus/
    
    # Set correct permissions
    chown -R 1000:1000 /opt/crm-nexus/uploads
    
    echo "File uploads restore completed"
  fi
fi

# Restart application containers
echo "Starting application containers..."
docker-compose -f /opt/crm-nexus/docker-compose.production.yml up -d

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 30

# Health checks
echo "Performing health checks..."
api_health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health || echo "000")
web_health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health || echo "000")

if [ "$api_health" = "200" ] && [ "$web_health" = "200" ]; then
  echo "✅ Health checks passed - restore completed successfully"
else
  echo "⚠️  WARNING: Health checks failed (API: $api_health, Web: $web_health)"
  echo "Please check application logs"
fi

# Send notification
if [ ! -z "${SLACK_WEBHOOK_URL:-}" ]; then
  status_icon="✅"
  status_text="successful"
  status_color="good"
  
  if [ "$api_health" != "200" ] || [ "$web_health" != "200" ]; then
    status_icon="⚠️"
    status_text="completed with warnings"
    status_color="warning"
  fi
  
  curl -X POST -H 'Content-type: application/json' \
    --data "{
      \"text\": \"${status_icon} CRM Nexus restore ${status_text}\",
      \"attachments\": [{
        \"color\": \"${status_color}\",
        \"fields\": [
          {\"title\": \"Backup Date\", \"value\": \"${BACKUP_DATE}\", \"short\": true},
          {\"title\": \"API Health\", \"value\": \"${api_health}\", \"short\": true},
          {\"title\": \"Web Health\", \"value\": \"${web_health}\", \"short\": true}
        ]
      }]
    }" \
    "${SLACK_WEBHOOK_URL}"
fi

echo "Restore process completed at $(date)"

# Log restore completion
logger "CRM Nexus restore completed: ${BACKUP_DATE}"