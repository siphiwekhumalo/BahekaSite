#!/bin/bash

# Application Deployment Script for EC2
# Run this script after ec2-setup.sh and uploading your code

set -e

APP_DIR="/var/www/baheka-tech"
DOMAIN="${1:-bahekatech.com}"
USER="bahekatech"

echo "🚀 Deploying Baheka Tech application..."

# Switch to application directory
cd $APP_DIR

# Install dependencies
echo "📦 Installing application dependencies..."
sudo -u $USER npm install --production

# Build the application
echo "🔨 Building application..."
sudo -u $USER npm run build

# Set up database
echo "🗄️ Setting up database..."
sudo -u $USER npm run db:push

# Create PM2 ecosystem file
echo "📝 Creating PM2 configuration..."
sudo tee $APP_DIR/ecosystem.config.js > /dev/null <<EOF
module.exports = {
  apps: [{
    name: 'baheka-tech',
    script: './dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    env_file: '.env.production',
    log_file: '/var/log/baheka-tech/app.log',
    error_file: '/var/log/baheka-tech/error.log',
    out_file: '/var/log/baheka-tech/out.log',
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
EOF

sudo chown $USER:$USER $APP_DIR/ecosystem.config.js

# Create log directory
sudo mkdir -p /var/log/baheka-tech
sudo chown $USER:$USER /var/log/baheka-tech

# Start application with PM2
echo "🔄 Starting application with PM2..."
sudo -u $USER pm2 start $APP_DIR/ecosystem.config.js
sudo -u $USER pm2 save
sudo pm2 startup systemd -u $USER --hp $APP_DIR

# Create NGINX configuration
echo "🌐 Configuring NGINX..."
sudo tee /etc/nginx/sites-available/baheka-tech > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private no_last_modified no_etag auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
    
    # Static files
    location /assets {
        alias /var/www/baheka-tech/dist/public/assets;
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
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/baheka-tech /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload NGINX
echo "🧪 Testing NGINX configuration..."
sudo nginx -t
sudo systemctl reload nginx

# Enable services
echo "🔧 Enabling services..."
sudo systemctl enable nginx
sudo systemctl enable postgresql

echo "✅ Application deployment complete!"
echo ""
echo "📋 Application Status:"
echo "   - Node.js app running on port 5000"
echo "   - NGINX reverse proxy configured"
echo "   - PM2 process manager active"
echo "   - PostgreSQL database ready"
echo ""
echo "🌐 Next steps:"
echo "1. Point your domain to this server's IP"
echo "2. Run SSL setup: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo "3. Monitor with: sudo -u $USER pm2 monit"
echo ""
echo "💡 Useful commands:"
echo "   - Check app logs: sudo -u $USER pm2 logs"
echo "   - Restart app: sudo -u $USER pm2 restart baheka-tech"
echo "   - Check NGINX: sudo systemctl status nginx"
echo "   - Check database: sudo -u postgres psql -d baheka_tech"