#!/bin/bash

# Complete deployment script for bahekatechfirm.com
# This script handles everything from EC2 setup to SSL certificates

set -e

DOMAIN="bahekatechfirm.com"
APP_NAME="baheka-tech"
APP_USER="bahekatech"
APP_DIR="/var/www/$APP_NAME"

echo "🚀 Starting complete deployment for $DOMAIN..."

# Step 1: System preparation
prepare_system() {
    echo "📋 Step 1: Preparing system..."
    
    # Update system
    sudo apt update && sudo apt upgrade -y
    
    # Install required packages
    sudo apt install -y \
        nginx \
        postgresql \
        postgresql-contrib \
        certbot \
        python3-certbot-nginx \
        ufw \
        fail2ban \
        htop \
        curl \
        git \
        unzip
    
    # Install Node.js 20
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
    
    # Install PM2
    sudo npm install -g pm2
    
    echo "✅ System prepared successfully!"
}

# Step 2: Create application user
create_app_user() {
    echo "📋 Step 2: Creating application user..."
    
    # Create user if not exists
    if ! id "$APP_USER" &>/dev/null; then
        sudo useradd -r -s /bin/bash -d "$APP_DIR" "$APP_USER"
        sudo mkdir -p "$APP_DIR"
        sudo chown "$APP_USER:$APP_USER" "$APP_DIR"
    fi
    
    echo "✅ Application user created!"
}

# Step 3: Setup database
setup_database() {
    echo "📋 Step 3: Setting up database..."
    
    # Start PostgreSQL
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    # Create database and user
    sudo -u postgres psql << EOF
CREATE USER $APP_USER WITH PASSWORD 'baheka_secure_2025';
CREATE DATABASE ${APP_NAME//-/_} OWNER $APP_USER;
GRANT ALL PRIVILEGES ON DATABASE ${APP_NAME//-/_} TO $APP_USER;
EOF
    
    echo "✅ Database setup complete!"
}

# Step 4: Deploy application
deploy_application() {
    echo "📋 Step 4: Deploying application..."
    
    # Copy application files
    sudo cp -r . "$APP_DIR/"
    sudo chown -R "$APP_USER:$APP_USER" "$APP_DIR"
    
    # Create production environment
    sudo -u "$APP_USER" cat > "$APP_DIR/.env.production" << EOF
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://$APP_USER:baheka_secure_2025@localhost:5432/${APP_NAME//-/_}

# Domain configuration
DOMAIN=$DOMAIN
SUBDOMAIN=www.$DOMAIN

# Email configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
BAHEKA_EMAIL=contact@$DOMAIN

# Security
SESSION_SECRET=$(openssl rand -hex 32)
JWT_SECRET=$(openssl rand -hex 32)
EOF
    
    # Install dependencies and build
    cd "$APP_DIR"
    sudo -u "$APP_USER" npm install
    sudo -u "$APP_USER" npm run build
    
    # Setup PM2
    sudo -u "$APP_USER" pm2 start npm --name "$APP_NAME" -- start
    sudo -u "$APP_USER" pm2 save
    sudo -u "$APP_USER" pm2 startup
    
    echo "✅ Application deployed!"
}

# Step 5: Configure NGINX
configure_nginx() {
    echo "📋 Step 5: Configuring NGINX..."
    
    # Create NGINX configuration
    sudo tee /etc/nginx/sites-available/$APP_NAME << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Static files
    location /assets {
        alias $APP_DIR/dist/public/assets;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Main application
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_redirect off;
    }
    
    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF
    
    # Enable site
    sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test and reload
    sudo nginx -t
    sudo systemctl reload nginx
    
    echo "✅ NGINX configured!"
}

# Step 6: Setup SSL certificates
setup_ssl() {
    echo "📋 Step 6: Setting up SSL certificates..."
    
    # Wait for DNS propagation
    echo "⏳ Waiting for DNS propagation..."
    sleep 60
    
    # Get SSL certificate
    sudo certbot --nginx \
        -d "$DOMAIN" \
        -d "www.$DOMAIN" \
        --non-interactive \
        --agree-tos \
        --email "contact@$DOMAIN" \
        --redirect
    
    # Setup auto-renewal
    sudo systemctl enable certbot.timer
    
    echo "✅ SSL certificates configured!"
}

# Step 7: Configure firewall
configure_firewall() {
    echo "📋 Step 7: Configuring firewall..."
    
    # Reset UFW
    sudo ufw --force reset
    
    # Configure rules
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    sudo ufw allow ssh
    sudo ufw allow 'Nginx Full'
    
    # Enable firewall
    sudo ufw --force enable
    
    echo "✅ Firewall configured!"
}

# Step 8: Setup monitoring
setup_monitoring() {
    echo "📋 Step 8: Setting up monitoring..."
    
    # Create status script
    sudo tee /usr/local/bin/baheka-status << 'EOF'
#!/bin/bash
echo "=== Baheka Tech System Status ==="
echo "Date: $(date)"
echo ""
echo "=== System Health ==="
echo "Uptime: $(uptime)"
echo "Memory: $(free -h | grep Mem | awk '{print $3"/"$2}')"
echo "Disk: $(df -h / | tail -1 | awk '{print $3"/"$2" ("$5" used)"}')"
echo ""
echo "=== Application Status ==="
sudo -u bahekatech pm2 status
echo ""
echo "=== Database Status ==="
sudo systemctl status postgresql --no-pager -l
echo ""
echo "=== NGINX Status ==="
sudo systemctl status nginx --no-pager -l
echo ""
echo "=== SSL Status ==="
sudo certbot certificates
EOF
    
    sudo chmod +x /usr/local/bin/baheka-status
    
    # Create backup script
    sudo tee /usr/local/bin/baheka-backup << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/baheka-tech"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
sudo -u postgres pg_dump baheka_tech > $BACKUP_DIR/db_$DATE.sql

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz -C /var/www baheka-tech

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF
    
    sudo chmod +x /usr/local/bin/baheka-backup
    
    # Schedule daily backup
    echo "0 3 * * * /usr/local/bin/baheka-backup" | sudo crontab -
    
    echo "✅ Monitoring setup complete!"
}

# Step 9: Final verification
final_verification() {
    echo "📋 Step 9: Final verification..."
    
    # Test application
    echo "🔍 Testing application..."
    sleep 10
    
    if curl -f -s "https://$DOMAIN" > /dev/null; then
        echo "✅ Website is accessible!"
    else
        echo "⚠️  Website test failed, checking status..."
        sudo -u "$APP_USER" pm2 logs "$APP_NAME" --lines 20
    fi
    
    # Test contact form
    echo "🔍 Testing contact form..."
    if curl -f -s -X POST "https://$DOMAIN/api/contact" \
        -H "Content-Type: application/json" \
        -d '{"firstName":"Test","lastName":"User","email":"test@example.com","service":"Web Development","message":"Deployment test"}' > /dev/null; then
        echo "✅ Contact form is working!"
    else
        echo "⚠️  Contact form test failed"
    fi
    
    echo "✅ Verification complete!"
}

# Main execution
main() {
    echo "🚀 Starting complete deployment for $DOMAIN..."
    
    prepare_system
    create_app_user
    setup_database
    deploy_application
    configure_nginx
    setup_ssl
    configure_firewall
    setup_monitoring
    final_verification
    
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo ""
    echo "✅ Your website is now live at: https://$DOMAIN"
    echo "✅ SSL certificate installed and auto-renewing"
    echo "✅ Firewall configured and active"
    echo "✅ Monitoring and backups enabled"
    echo ""
    echo "📋 Management commands:"
    echo "   Status: sudo /usr/local/bin/baheka-status"
    echo "   Backup: sudo /usr/local/bin/baheka-backup"
    echo "   Logs: sudo -u $APP_USER pm2 logs $APP_NAME"
    echo "   Restart: sudo -u $APP_USER pm2 restart $APP_NAME"
    echo ""
    echo "🔧 Configuration files:"
    echo "   App: $APP_DIR"
    echo "   Environment: $APP_DIR/.env.production"
    echo "   NGINX: /etc/nginx/sites-available/$APP_NAME"
    echo ""
    echo "🌐 Your Baheka Tech website is ready for production!"
}

main "$@"