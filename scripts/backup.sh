#!/bin/bash

# CRM Nexus Backup Script
# Automated backup solution for production data

set -euo pipefail

# Configuration
BACKUP_DIR="/opt/backups/crm-nexus"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30
POSTGRES_CONTAINER="crm-nexus-postgres"
API_CONTAINER="crm-nexus-api"

# Load environment variables
source /opt/crm-nexus/.env.production

# Create backup directory
mkdir -p "${BACKUP_DIR}/database"
mkdir -p "${BACKUP_DIR}/uploads"
mkdir -p "${BACKUP_DIR}/logs"

echo "Starting CRM Nexus backup process at $(date)"

# Database backup
echo "Backing up PostgreSQL database..."
docker exec ${POSTGRES_CONTAINER} pg_dump \
  -U ${POSTGRES_USER} \
  -d ${POSTGRES_DB} \
  --verbose \
  --format=custom \
  --compress=9 \
  > "${BACKUP_DIR}/database/crm_nexus_${DATE}.backup"

# Verify database backup
if [ -f "${BACKUP_DIR}/database/crm_nexus_${DATE}.backup" ]; then
  echo "Database backup completed successfully"
  
  # Test backup integrity
  docker exec ${POSTGRES_CONTAINER} pg_restore \
    --list "${BACKUP_DIR}/database/crm_nexus_${DATE}.backup" > /dev/null
  echo "Database backup integrity verified"
else
  echo "ERROR: Database backup failed"
  exit 1
fi

# File uploads backup
echo "Backing up file uploads..."
if [ -d "/opt/crm-nexus/uploads" ]; then
  tar -czf "${BACKUP_DIR}/uploads/uploads_${DATE}.tar.gz" \
    -C /opt/crm-nexus uploads/
  echo "File uploads backup completed"
fi

# Application logs backup
echo "Backing up application logs..."
docker logs ${API_CONTAINER} > "${BACKUP_DIR}/logs/api_logs_${DATE}.log" 2>&1 || true
docker logs ${POSTGRES_CONTAINER} > "${BACKUP_DIR}/logs/postgres_logs_${DATE}.log" 2>&1 || true

# Configuration backup
echo "Backing up configuration files..."
mkdir -p "${BACKUP_DIR}/config"
cp /opt/crm-nexus/.env.production "${BACKUP_DIR}/config/env_${DATE}.backup"
cp /opt/crm-nexus/docker-compose.production.yml "${BACKUP_DIR}/config/docker-compose_${DATE}.yml"

# Create backup manifest
cat > "${BACKUP_DIR}/manifest_${DATE}.txt" << EOF
CRM Nexus Backup Manifest
Generated: $(date)
Backup Date: ${DATE}

Files included:
- Database: crm_nexus_${DATE}.backup ($(du -h "${BACKUP_DIR}/database/crm_nexus_${DATE}.backup" | cut -f1))
- Uploads: uploads_${DATE}.tar.gz ($(du -h "${BACKUP_DIR}/uploads/uploads_${DATE}.tar.gz" 2>/dev/null | cut -f1 || echo "N/A"))
- Configuration: env_${DATE}.backup, docker-compose_${DATE}.yml
- Logs: api_logs_${DATE}.log, postgres_logs_${DATE}.log

Database info:
- Host: ${POSTGRES_HOST}
- Database: ${POSTGRES_DB}
- User: ${POSTGRES_USER}

Checksum verification:
$(find "${BACKUP_DIR}" -name "*${DATE}*" -type f -exec sha256sum {} \;)
EOF

# Compress the entire backup
echo "Compressing backup archive..."
tar -czf "${BACKUP_DIR}/crm_nexus_full_backup_${DATE}.tar.gz" \
  -C "${BACKUP_DIR}" \
  database/crm_nexus_${DATE}.backup \
  uploads/uploads_${DATE}.tar.gz \
  config/ \
  logs/ \
  manifest_${DATE}.txt

# Upload to AWS S3 (if configured)
if [ ! -z "${AWS_S3_BACKUP_BUCKET:-}" ]; then
  echo "Uploading backup to AWS S3..."
  aws s3 cp "${BACKUP_DIR}/crm_nexus_full_backup_${DATE}.tar.gz" \
    "s3://${AWS_S3_BACKUP_BUCKET}/backups/$(date +%Y/%m)/" \
    --storage-class STANDARD_IA
  
  # Verify S3 upload
  if aws s3 ls "s3://${AWS_S3_BACKUP_BUCKET}/backups/$(date +%Y/%m)/crm_nexus_full_backup_${DATE}.tar.gz" > /dev/null; then
    echo "Backup successfully uploaded to S3"
    
    # Remove local compressed backup if S3 upload successful
    rm -f "${BACKUP_DIR}/crm_nexus_full_backup_${DATE}.tar.gz"
  else
    echo "WARNING: S3 upload failed, keeping local backup"
  fi
fi

# Cleanup old backups
echo "Cleaning up old backups..."
find "${BACKUP_DIR}" -name "*.backup" -mtime +${RETENTION_DAYS} -delete
find "${BACKUP_DIR}" -name "*.tar.gz" -mtime +${RETENTION_DAYS} -delete
find "${BACKUP_DIR}" -name "*.log" -mtime +${RETENTION_DAYS} -delete
find "${BACKUP_DIR}" -name "manifest_*.txt" -mtime +${RETENTION_DAYS} -delete

# Cleanup S3 old backups (if configured)
if [ ! -z "${AWS_S3_BACKUP_BUCKET:-}" ]; then
  aws s3 ls "s3://${AWS_S3_BACKUP_BUCKET}/backups/" --recursive | \
  while read -r line; do
    backup_date=$(echo $line | awk '{print $1" "$2}')
    backup_file=$(echo $line | awk '{print $4}')
    
    if [[ $(date -d "$backup_date" +%s) -lt $(date -d "${RETENTION_DAYS} days ago" +%s) ]]; then
      echo "Deleting old S3 backup: $backup_file"
      aws s3 rm "s3://${AWS_S3_BACKUP_BUCKET}/$backup_file"
    fi
  done
fi

# Send notification
echo "Sending backup completion notification..."
if [ ! -z "${SLACK_WEBHOOK_URL:-}" ]; then
  backup_size=$(du -h "${BACKUP_DIR}/database/crm_nexus_${DATE}.backup" | cut -f1)
  
  curl -X POST -H 'Content-type: application/json' \
    --data "{
      \"text\": \"✅ CRM Nexus backup completed successfully\",
      \"attachments\": [{
        \"color\": \"good\",
        \"fields\": [
          {\"title\": \"Date\", \"value\": \"${DATE}\", \"short\": true},
          {\"title\": \"Size\", \"value\": \"${backup_size}\", \"short\": true},
          {\"title\": \"Location\", \"value\": \"${AWS_S3_BACKUP_BUCKET:-Local}\", \"short\": true}
        ]
      }]
    }" \
    "${SLACK_WEBHOOK_URL}"
fi

echo "Backup process completed successfully at $(date)"
echo "Backup stored in: ${BACKUP_DIR}"

# Log backup completion
logger "CRM Nexus backup completed: ${DATE}"