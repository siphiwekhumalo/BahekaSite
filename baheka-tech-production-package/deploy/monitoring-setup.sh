#!/bin/bash

# Monitoring and Maintenance Setup Script
# Sets up monitoring, logging, and backup systems

set -e

echo "📊 Setting up monitoring and maintenance..."

# Install monitoring tools
echo "🔧 Installing monitoring tools..."
sudo apt install -y htop iotop nethogs fail2ban logrotate

# Configure fail2ban for security
echo "🛡️ Configuring fail2ban..."
sudo tee /etc/fail2ban/jail.local > /dev/null <<EOF
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5
backend = systemd

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 3

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
EOF

sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Setup log rotation
echo "📝 Configuring log rotation..."
sudo tee /etc/logrotate.d/baheka-tech > /dev/null <<EOF
/var/log/baheka-tech/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 0640 bahekatech bahekatech
    postrotate
        /usr/bin/systemctl reload nginx > /dev/null 2>&1 || true
        /usr/bin/sudo -u bahekatech /usr/bin/pm2 reloadLogs > /dev/null 2>&1 || true
    endscript
}
EOF

# Create monitoring script
echo "📈 Creating monitoring script..."
sudo tee /usr/local/bin/baheka-monitor.sh > /dev/null <<'EOF'
#!/bin/bash

# Baheka Tech Monitoring Script
LOG_FILE="/var/log/baheka-tech/monitor.log"
APP_USER="bahekatech"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

# Check if PM2 processes are running
check_pm2() {
    PM2_STATUS=$(sudo -u $APP_USER pm2 jlist 2>/dev/null)
    if echo "$PM2_STATUS" | grep -q '"status":"stopped"'; then
        log_message "ERROR: PM2 process stopped, restarting..."
        sudo -u $APP_USER pm2 restart baheka-tech
        return 1
    fi
    return 0
}

# Check NGINX status
check_nginx() {
    if ! systemctl is-active --quiet nginx; then
        log_message "ERROR: NGINX is not running, starting..."
        systemctl start nginx
        return 1
    fi
    return 0
}

# Check PostgreSQL status
check_postgresql() {
    if ! systemctl is-active --quiet postgresql; then
        log_message "ERROR: PostgreSQL is not running, starting..."
        systemctl start postgresql
        return 1
    fi
    return 0
}

# Check disk space
check_disk_space() {
    DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ "$DISK_USAGE" -gt 80 ]; then
        log_message "WARNING: Disk usage is ${DISK_USAGE}%"
        return 1
    fi
    return 0
}

# Check memory usage
check_memory() {
    MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
    if [ "$MEMORY_USAGE" -gt 90 ]; then
        log_message "WARNING: Memory usage is ${MEMORY_USAGE}%"
        return 1
    fi
    return 0
}

# Check SSL certificate expiry
check_ssl_cert() {
    CERT_EXPIRY=$(echo | openssl s_client -servername bahekatechfirm.com -connect bahekatechfirm.com:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
    EXPIRY_DATE=$(date -d "$CERT_EXPIRY" +%s)
    CURRENT_DATE=$(date +%s)
    DAYS_UNTIL_EXPIRY=$(( ($EXPIRY_DATE - $CURRENT_DATE) / 86400 ))
    
    if [ "$DAYS_UNTIL_EXPIRY" -lt 30 ]; then
        log_message "WARNING: SSL certificate expires in $DAYS_UNTIL_EXPIRY days"
        return 1
    fi
    return 0
}

# Run all checks
main() {
    log_message "Starting monitoring checks..."
    
    ERRORS=0
    
    check_pm2 || ERRORS=$((ERRORS + 1))
    check_nginx || ERRORS=$((ERRORS + 1))
    check_postgresql || ERRORS=$((ERRORS + 1))
    check_disk_space || ERRORS=$((ERRORS + 1))
    check_memory || ERRORS=$((ERRORS + 1))
    check_ssl_cert || ERRORS=$((ERRORS + 1))
    
    if [ $ERRORS -eq 0 ]; then
        log_message "All checks passed successfully"
    else
        log_message "Found $ERRORS issues during monitoring"
    fi
    
    return $ERRORS
}

main "$@"
EOF

sudo chmod +x /usr/local/bin/baheka-monitor.sh

# Create monitoring log directory
sudo mkdir -p /var/log/baheka-tech
sudo chown bahekatech:bahekatech /var/log/baheka-tech

# Setup cron job for monitoring
echo "⏰ Setting up monitoring cron job..."
sudo tee /etc/cron.d/baheka-monitor > /dev/null <<EOF
# Baheka Tech Monitoring
*/5 * * * * root /usr/local/bin/baheka-monitor.sh >/dev/null 2>&1
0 2 * * * root /usr/local/bin/baheka-monitor.sh >> /var/log/baheka-tech/monitor.log 2>&1
EOF

# Create backup script
echo "💾 Creating backup script..."
sudo tee /usr/local/bin/baheka-backup.sh > /dev/null <<'EOF'
#!/bin/bash

# Baheka Tech Backup Script
BACKUP_DIR="/var/backups/baheka-tech"
APP_DIR="/var/www/baheka-tech"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
echo "Backing up database..."
sudo -u postgres pg_dump baheka_tech > $BACKUP_DIR/database_$DATE.sql

# Application backup
echo "Backing up application..."
tar -czf $BACKUP_DIR/app_$DATE.tar.gz -C $APP_DIR .

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

sudo chmod +x /usr/local/bin/baheka-backup.sh

# Setup backup cron job
echo "⏰ Setting up backup cron job..."
sudo tee /etc/cron.d/baheka-backup > /dev/null <<EOF
# Baheka Tech Backup - Daily at 3 AM
0 3 * * * root /usr/local/bin/baheka-backup.sh >> /var/log/baheka-tech/backup.log 2>&1
EOF

# Create system status script
echo "📊 Creating system status script..."
sudo tee /usr/local/bin/baheka-status.sh > /dev/null <<'EOF'
#!/bin/bash

# Baheka Tech Status Script
echo "🌟 Baheka Tech Website Status"
echo "=============================="
echo ""

# System information
echo "📋 System Information:"
echo "   Hostname: $(hostname)"
echo "   Uptime: $(uptime -p)"
echo "   Load: $(uptime | cut -d',' -f3-)"
echo ""

# Disk usage
echo "💾 Disk Usage:"
df -h / | tail -1 | awk '{print "   Root: " $3 " used of " $2 " (" $5 ")"}'
echo ""

# Memory usage
echo "🧠 Memory Usage:"
free -h | grep Mem | awk '{print "   RAM: " $3 " used of " $2}'
echo ""

# Service status
echo "🔧 Service Status:"
systemctl is-active --quiet nginx && echo "   ✅ NGINX: Running" || echo "   ❌ NGINX: Stopped"
systemctl is-active --quiet postgresql && echo "   ✅ PostgreSQL: Running" || echo "   ❌ PostgreSQL: Stopped"
sudo -u bahekatech pm2 jlist 2>/dev/null | grep -q '"status":"online"' && echo "   ✅ PM2 App: Running" || echo "   ❌ PM2 App: Stopped"
echo ""

# SSL certificate
echo "🔒 SSL Certificate:"
CERT_EXPIRY=$(echo | openssl s_client -servername bahekatech.com -connect bahekatech.com:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
echo "   Expires: $CERT_EXPIRY"
echo ""

# Recent logs
echo "📝 Recent Application Logs:"
sudo -u bahekatech pm2 logs baheka-tech --lines 5 --nostream 2>/dev/null || echo "   No recent logs available"
EOF

sudo chmod +x /usr/local/bin/baheka-status.sh

# Create update script
echo "🔄 Creating update script..."
sudo tee /usr/local/bin/baheka-update.sh > /dev/null <<'EOF'
#!/bin/bash

# Baheka Tech Update Script
set -e

APP_DIR="/var/www/baheka-tech"
USER="bahekatech"

echo "🚀 Updating Baheka Tech application..."

# Backup before update
echo "💾 Creating backup..."
/usr/local/bin/baheka-backup.sh

# Navigate to app directory
cd $APP_DIR

# Pull latest code (if using git)
if [ -d ".git" ]; then
    echo "📥 Pulling latest code..."
    sudo -u $USER git pull origin main
fi

# Install dependencies
echo "📦 Installing dependencies..."
sudo -u $USER npm install --production

# Build application
echo "🔨 Building application..."
sudo -u $USER npm run build

# Run database migrations
echo "🗄️ Running database migrations..."
sudo -u $USER npm run db:push

# Restart application
echo "🔄 Restarting application..."
sudo -u $USER pm2 restart baheka-tech

# Reload NGINX
echo "🌐 Reloading NGINX..."
sudo systemctl reload nginx

echo "✅ Update completed successfully!"
EOF

sudo chmod +x /usr/local/bin/baheka-update.sh

echo "✅ Monitoring and maintenance setup complete!"
echo ""
echo "🔧 Monitoring Tools Installed:"
echo "   - System monitoring: /usr/local/bin/baheka-monitor.sh"
echo "   - Daily backups: /usr/local/bin/baheka-backup.sh"
echo "   - Status check: /usr/local/bin/baheka-status.sh"
echo "   - Update script: /usr/local/bin/baheka-update.sh"
echo "   - fail2ban security"
echo "   - Log rotation"
echo ""
echo "📊 Useful Commands:"
echo "   - Check status: sudo /usr/local/bin/baheka-status.sh"
echo "   - Manual backup: sudo /usr/local/bin/baheka-backup.sh"
echo "   - Update app: sudo /usr/local/bin/baheka-update.sh"
echo "   - View fail2ban status: sudo fail2ban-client status"
echo "   - Check monitoring: sudo tail -f /var/log/baheka-tech/monitor.log"