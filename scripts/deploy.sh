#!/bin/bash

# CRM Nexus Deployment Script
# Automated deployment for production environment

set -euo pipefail

# Configuration
DEPLOY_DIR="/opt/crm-nexus"
BACKUP_DIR="/opt/backups/crm-nexus"
LOG_FILE="/var/log/crm-nexus-deploy.log"
DATE=$(date +%Y%m%d_%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
  echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
  echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
  exit 1
}

warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

# Function to check prerequisites
check_prerequisites() {
  log "Checking deployment prerequisites..."
  
  # Check if running as root or with sudo
  if [[ $EUID -ne 0 ]]; then
    error "This script must be run as root or with sudo"
  fi
  
  # Check required commands
  for cmd in docker docker-compose git curl; do
    if ! command -v $cmd &> /dev/null; then
      error "$cmd is not installed"
    fi
  done
  
  # Check disk space (minimum 5GB)
  available_space=$(df / | awk 'NR==2 {print $4}')
  if [ "$available_space" -lt 5242880 ]; then # 5GB in KB
    error "Insufficient disk space. At least 5GB required."
  fi
  
  success "Prerequisites check passed"
}

# Function to create pre-deployment backup
create_backup() {
  log "Creating pre-deployment backup..."
  
  if [ -d "$DEPLOY_DIR" ]; then
    # Run backup script
    if [ -f "$DEPLOY_DIR/scripts/backup.sh" ]; then
      bash "$DEPLOY_DIR/scripts/backup.sh"
      success "Pre-deployment backup created"
    else
      warning "Backup script not found, creating manual backup"
      
      # Create backup directory
      mkdir -p "$BACKUP_DIR/pre-deploy-$DATE"
      
      # Backup database if running
      if docker ps | grep -q "crm-nexus-postgres"; then
        docker exec crm-nexus-postgres pg_dump -U postgres crm_nexus > "$BACKUP_DIR/pre-deploy-$DATE/database.sql"
      fi
      
      # Backup current application files
      if [ -d "$DEPLOY_DIR" ]; then
        tar -czf "$BACKUP_DIR/pre-deploy-$DATE/application.tar.gz" -C "$DEPLOY_DIR" .
      fi
    fi
  else
    log "No existing deployment found, skipping backup"
  fi
}

# Function to pull latest code
update_code() {
  log "Updating application code..."
  
  if [ ! -d "$DEPLOY_DIR" ]; then
    log "Cloning repository..."
    git clone https://github.com/your-username/crm-nexus.git "$DEPLOY_DIR"
    cd "$DEPLOY_DIR"
  else
    cd "$DEPLOY_DIR"
    log "Pulling latest changes..."
    
    # Stash any local changes
    git stash push -m "Auto-stash before deployment $DATE"
    
    # Pull latest changes
    git pull origin main
  fi
  
  success "Code update completed"
}

# Function to build application
build_application() {
  log "Building application..."
  
  cd "$DEPLOY_DIR"
  
  # Copy production environment file if it doesn't exist
  if [ ! -f ".env.production" ]; then
    if [ -f ".env.production.template" ]; then
      cp .env.production.template .env.production
      warning "Created .env.production from template. Please update with actual values."
    else
      error ".env.production file not found and no template available"
    fi
  fi
  
  # Build Docker images
  log "Building Docker images..."
  docker-compose -f docker-compose.production.yml build --no-cache
  
  success "Application build completed"
}

# Function to run database migrations
run_migrations() {
  log "Running database migrations..."
  
  cd "$DEPLOY_DIR"
  
  # Start database container if not running
  if ! docker ps | grep -q "crm-nexus-postgres"; then
    docker-compose -f docker-compose.production.yml up -d postgres
    
    # Wait for database to be ready
    log "Waiting for database to be ready..."
    sleep 30
  fi
  
  # Run migrations
  docker-compose -f docker-compose.production.yml exec -T api npx prisma migrate deploy
  
  success "Database migrations completed"
}

# Function to perform health checks
health_checks() {
  log "Performing health checks..."
  
  local max_attempts=30
  local attempt=1
  
  while [ $attempt -le $max_attempts ]; do
    log "Health check attempt $attempt/$max_attempts"
    
    # Check API health
    api_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health || echo "000")
    
    # Check Web health
    web_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health || echo "000")
    
    if [ "$api_status" = "200" ] && [ "$web_status" = "200" ]; then
      success "Health checks passed (API: $api_status, Web: $web_status)"
      return 0
    fi
    
    log "Health check failed (API: $api_status, Web: $web_status), retrying in 10 seconds..."
    sleep 10
    ((attempt++))
  done
  
  error "Health checks failed after $max_attempts attempts"
}

# Function to deploy application
deploy_application() {
  log "Deploying application..."
  
  cd "$DEPLOY_DIR"
  
  # Stop existing containers
  log "Stopping existing containers..."
  docker-compose -f docker-compose.production.yml down || true
  
  # Start all services
  log "Starting application services..."
  docker-compose -f docker-compose.production.yml up -d
  
  # Wait for services to start
  log "Waiting for services to start..."
  sleep 60
  
  success "Application deployment completed"
}

# Function to cleanup old images and containers
cleanup() {
  log "Performing cleanup..."
  
  # Remove unused Docker images
  docker image prune -f
  
  # Remove old containers
  docker container prune -f
  
  # Clean up old backups (keep last 10)
  if [ -d "$BACKUP_DIR" ]; then
    cd "$BACKUP_DIR"
    ls -t pre-deploy-* 2>/dev/null | tail -n +11 | xargs -r rm -rf
  fi
  
  success "Cleanup completed"
}

# Function to send deployment notification
send_notification() {
  local status=$1
  local message=$2
  
  if [ ! -z "${SLACK_WEBHOOK_URL:-}" ]; then
    local color="good"
    local icon="✅"
    
    if [ "$status" != "success" ]; then
      color="danger"
      icon="❌"
    fi
    
    curl -X POST -H 'Content-type: application/json' \
      --data "{
        \"text\": \"${icon} CRM Nexus Deployment ${status}\",
        \"attachments\": [{
          \"color\": \"${color}\",
          \"fields\": [
            {\"title\": \"Environment\", \"value\": \"Production\", \"short\": true},
            {\"title\": \"Date\", \"value\": \"${DATE}\", \"short\": true},
            {\"title\": \"Message\", \"value\": \"${message}\", \"short\": false}
          ]
        }]
      }" \
      "${SLACK_WEBHOOK_URL}" || true
  fi
}

# Function to rollback deployment
rollback() {
  log "Rolling back deployment..."
  
  cd "$DEPLOY_DIR"
  
  # Stop current containers
  docker-compose -f docker-compose.production.yml down
  
  # Restore from backup if available
  latest_backup=$(ls -t "$BACKUP_DIR"/pre-deploy-* 2>/dev/null | head -n1 || echo "")
  
  if [ -n "$latest_backup" ]; then
    log "Restoring from backup: $latest_backup"
    
    # Restore application files
    if [ -f "$latest_backup/application.tar.gz" ]; then
      tar -xzf "$latest_backup/application.tar.gz" -C "$DEPLOY_DIR"
    fi
    
    # Restore database
    if [ -f "$latest_backup/database.sql" ]; then
      docker-compose -f docker-compose.production.yml up -d postgres
      sleep 30
      docker exec -i crm-nexus-postgres psql -U postgres crm_nexus < "$latest_backup/database.sql"
    fi
    
    # Start services
    docker-compose -f docker-compose.production.yml up -d
    
    success "Rollback completed"
  else
    error "No backup found for rollback"
  fi
}

# Main deployment function
main() {
  log "Starting CRM Nexus deployment process..."
  
  # Trap errors and perform rollback
  trap 'error "Deployment failed! Initiating rollback..."; rollback; send_notification "failed" "Deployment failed and rollback initiated"' ERR
  
  check_prerequisites
  create_backup
  update_code
  build_application
  run_migrations
  deploy_application
  health_checks
  cleanup
  
  success "Deployment completed successfully!"
  send_notification "success" "Deployment completed successfully"
  
  log "Deployment process finished at $(date)"
}

# Run main function
main "$@"