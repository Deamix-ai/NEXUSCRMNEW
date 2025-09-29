# CRM Nexus - Production Deployment Guide

## Overview

This guide covers the complete deployment and infrastructure setup for the CRM Nexus production environment. The system is designed for high availability, scalability, and security.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │────│   Nginx Proxy   │────│   Application   │
│     (Cloud)     │    │                 │    │   Containers    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                │                        │
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Monitoring    │    │    Database     │
                       │  (Prometheus)   │    │  (PostgreSQL)   │
                       └─────────────────┘    └─────────────────┘
```

## Prerequisites

### System Requirements
- **OS**: Ubuntu 20.04 LTS or later / RHEL 8+
- **RAM**: Minimum 8GB (16GB recommended)
- **Storage**: Minimum 100GB SSD
- **CPU**: 4+ cores
- **Network**: Static IP address

### Software Dependencies
- Docker Engine 20.10+
- Docker Compose 2.0+
- Git 2.30+
- SSL certificates (Let's Encrypt recommended)

## Initial Server Setup

### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git unzip
```

### 2. Install Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### 3. Install Docker Compose
```bash
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 4. Configure Firewall
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

## Application Deployment

### 1. Clone Repository
```bash
sudo mkdir -p /opt
cd /opt
sudo git clone https://github.com/your-username/crm-nexus.git
sudo chown -R $USER:$USER crm-nexus
cd crm-nexus
```

### 2. Environment Configuration
```bash
cp .env.production.template .env.production
```

Edit `.env.production` with your specific values:
```bash
# Database Configuration
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=crm_nexus
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_secure_password

# Application URLs
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXTAUTH_URL=https://app.yourdomain.com
NEXTAUTH_SECRET=your_nextauth_secret

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@yourdomain.com
SMTP_PASSWORD=your_email_password

# AWS S3 Configuration
AWS_REGION=eu-west-2
AWS_S3_BUCKET=your-s3-bucket
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Monitoring
PROMETHEUS_ENABLED=true
GRAFANA_ADMIN_PASSWORD=your_grafana_password
```

### 3. SSL Certificate Setup
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificates
sudo certbot certonly --standalone \
  -d yourdomain.com \
  -d api.yourdomain.com \
  -d app.yourdomain.com
```

### 4. Deploy Application
```bash
# Make deployment script executable
chmod +x scripts/deploy.sh

# Run deployment
sudo ./scripts/deploy.sh
```

## Manual Deployment Steps

If you prefer manual deployment:

### 1. Build Images
```bash
docker-compose -f docker-compose.production.yml build
```

### 2. Start Services
```bash
docker-compose -f docker-compose.production.yml up -d
```

### 3. Run Database Migrations
```bash
docker-compose -f docker-compose.production.yml exec api npx prisma migrate deploy
```

### 4. Verify Deployment
```bash
# Check all containers are running
docker-compose -f docker-compose.production.yml ps

# Check application health
curl http://localhost:3001/health
curl http://localhost:3000/health
```

## Monitoring Setup

### 1. Access Grafana Dashboard
- URL: `http://your-server-ip:3030`
- Username: `admin`
- Password: Set in `.env.production`

### 2. Import Dashboards
1. Login to Grafana
2. Go to "+" > Import
3. Upload dashboard files from `monitoring/grafana/dashboards/`

### 3. Configure Alerts
1. Go to Alerting > Alert Rules
2. Import alert rules from `monitoring/prometheus/alerts/`

## Backup Configuration

### 1. Automated Backups
```bash
# Create backup directory
sudo mkdir -p /opt/backups/crm-nexus

# Add to crontab (daily backup at 2 AM)
sudo crontab -e
```

Add this line:
```
0 2 * * * /opt/crm-nexus/scripts/backup.sh >> /var/log/crm-backup.log 2>&1
```

### 2. AWS S3 Backup Setup
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS credentials
aws configure
```

## Domain and DNS Configuration

### 1. DNS Records
Create the following DNS records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | yourdomain.com | your-server-ip | 300 |
| A | api.yourdomain.com | your-server-ip | 300 |
| A | app.yourdomain.com | your-server-ip | 300 |
| CNAME | www.yourdomain.com | yourdomain.com | 300 |

### 2. Nginx Configuration
The Nginx configuration is included in the Docker Compose setup and will automatically handle SSL termination and routing.

## Security Hardening

### 1. Server Security
```bash
# Disable root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

# Install fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 2. Database Security
```bash
# The PostgreSQL container is configured with:
# - Non-default port internally
# - Strong password requirements
# - SSL connections enforced
# - Regular security updates
```

### 3. Application Security
- HTTPS enforced for all connections
- Security headers configured in Nginx
- JWT tokens with secure expiration
- Rate limiting enabled
- Input validation and sanitization

## Performance Optimization

### 1. Database Optimization
```sql
-- These optimizations are included in the schema
-- Connection pooling: Configured in API
-- Indexing: Optimized for common queries
-- Query optimization: Prisma ORM optimizations
```

### 2. Caching Strategy
- Redis for session storage
- Application-level caching
- CDN for static assets (if configured)

### 3. Container Resources
```yaml
# Resource limits are set in docker-compose.production.yml
# API Container: 2GB RAM, 1 CPU
# Web Container: 1GB RAM, 0.5 CPU
# Database: 4GB RAM, 2 CPU
```

## Maintenance and Updates

### 1. Regular Updates
```bash
# Weekly update routine
cd /opt/crm-nexus
git pull origin main
docker-compose -f docker-compose.production.yml build
docker-compose -f docker-compose.production.yml up -d
```

### 2. Health Monitoring
```bash
# Check system health
docker stats
docker-compose -f docker-compose.production.yml logs
```

### 3. Log Management
```bash
# Configure log rotation
sudo vim /etc/logrotate.d/docker-containers
```

Add:
```
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=1M
    missingok
    delaycompress
    copytruncate
}
```

## Troubleshooting

### Common Issues

#### 1. Containers Won't Start
```bash
# Check logs
docker-compose -f docker-compose.production.yml logs

# Check available resources
df -h
free -h
```

#### 2. Database Connection Issues
```bash
# Check database container
docker-compose -f docker-compose.production.yml exec postgres psql -U postgres -d crm_nexus

# Test connectivity
docker-compose -f docker-compose.production.yml exec api nc -zv postgres 5432
```

#### 3. SSL Certificate Issues
```bash
# Renew certificates
sudo certbot renew --dry-run

# Check certificate status
sudo certbot certificates
```

#### 4. High Memory Usage
```bash
# Check container memory usage
docker stats

# Restart containers if needed
docker-compose -f docker-compose.production.yml restart
```

### Emergency Procedures

#### 1. Complete Rollback
```bash
# Use the restore script
sudo ./scripts/restore.sh --from-s3 BACKUP_DATE
```

#### 2. Database Recovery
```bash
# Restore from latest backup
sudo ./scripts/restore.sh --database-only BACKUP_DATE
```

#### 3. Service Recovery
```bash
# Restart all services
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml up -d
```

## Support and Monitoring

### 1. Log Locations
- Application logs: `/opt/crm-nexus/logs/`
- System logs: `/var/log/`
- Docker logs: `docker-compose logs`

### 2. Monitoring URLs
- Grafana: `http://your-domain:3030`
- Prometheus: `http://your-domain:9090`
- Application: `https://your-domain`

### 3. Health Check Endpoints
- API Health: `https://api.your-domain/health`
- Web Health: `https://your-domain/health`
- Database Health: Via monitoring dashboard

## Contact Information

For technical support or deployment assistance:
- Documentation: This deployment guide
- Monitoring: Grafana dashboards
- Logs: Centralized logging system
- Backups: Automated daily backups to S3

---

**Note**: This deployment guide covers a production-ready setup. For development environments, use `docker-compose.yml` instead of `docker-compose.production.yml`.