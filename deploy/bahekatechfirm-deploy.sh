#!/bin/bash

# Quick deployment script specifically for bahekatechfirm.com
# This script combines all deployment steps for easy execution

set -e

DOMAIN="bahekatechfirm.com"
EMAIL="contact@bahekatechfirm.com"
APP_DIR="/var/www/baheka-tech"

echo "🚀 Starting complete deployment for $DOMAIN"

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo "This script should not be run as root. Please run as a regular user with sudo privileges."
   exit 1
fi

# Step 1: Basic setup
echo "📦 Step 1: Running EC2 setup..."
if [ -f "deploy/ec2-setup.sh" ]; then
    chmod +x deploy/ec2-setup.sh
    ./deploy/ec2-setup.sh
else
    echo "❌ ec2-setup.sh not found. Please ensure you're in the project root directory."
    exit 1
fi

# Step 2: Upload application files if not already present
echo "📁 Step 2: Ensuring application files are in place..."
if [ ! -d "$APP_DIR" ]; then
    sudo mkdir -p $APP_DIR
    sudo chown -R bahekatech:bahekatech $APP_DIR
fi

# Copy current directory to app directory if needed
if [ ! -f "$APP_DIR/package.json" ]; then
    echo "📋 Copying application files..."
    sudo cp -r . $APP_DIR/
    sudo chown -R bahekatech:bahekatech $APP_DIR
fi

# Step 3: Configure environment
echo "🔧 Step 3: Configuring environment..."
sudo tee $APP_DIR/.env.production > /dev/null <<EOF
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://bahekatech:CHANGE_THIS_PASSWORD@localhost:5432/baheka_tech

# Email configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
BAHEKA_EMAIL=$EMAIL

# Domain configuration
DOMAIN=$DOMAIN
SUBDOMAIN=www.$DOMAIN

# Security - CHANGE THESE VALUES
SESSION_SECRET=your_session_secret_here_change_this_value
JWT_SECRET=your_jwt_secret_here_change_this_value

# AWS Configuration (optional)
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
STAGE=production
EOF

sudo chown bahekatech:bahekatech $APP_DIR/.env.production

# Step 4: Deploy application
echo "🚀 Step 4: Deploying application..."
cd $APP_DIR
sudo ./deploy/app-deploy.sh $DOMAIN

# Step 5: Wait for user to configure DNS
echo "⏳ Step 5: DNS Configuration Required"
echo ""
echo "🌐 Before proceeding with SSL setup, you MUST configure your domain DNS:"
echo "   1. Go to your domain registrar"
echo "   2. Add A record: @ -> $(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo "   3. Add A record: www -> $(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo "   4. Wait 5-60 minutes for DNS propagation"
echo ""
echo "🔍 Test DNS propagation with: nslookup $DOMAIN"
echo ""

read -p "Press Enter after DNS is configured and propagated..."

# Step 6: Setup SSL
echo "🔒 Step 6: Setting up SSL certificate..."
sudo ./deploy/ssl-setup.sh $DOMAIN $EMAIL

# Step 7: Setup monitoring
echo "📊 Step 7: Setting up monitoring..."
sudo ./deploy/monitoring-setup.sh

# Step 8: Final verification
echo "✅ Step 8: Final verification..."
echo ""
echo "🧪 Testing website accessibility..."

# Test HTTP (should redirect to HTTPS)
if curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN | grep -q "30[12]"; then
    echo "✅ HTTP redirect working"
else
    echo "⚠️  HTTP redirect may not be working"
fi

# Test HTTPS
if curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN | grep -q "200"; then
    echo "✅ HTTPS working"
else
    echo "⚠️  HTTPS may not be working"
fi

echo ""
echo "🎉 Deployment completed for $DOMAIN!"
echo ""
echo "📋 Quick verification checklist:"
echo "   - Website: https://$DOMAIN"
echo "   - SSL Certificate: $(sudo certbot certificates | grep -A1 $DOMAIN || echo 'Check manually')"
echo "   - Application status: $(sudo -u bahekatech pm2 status | grep baheka-tech || echo 'Check manually')"
echo "   - NGINX status: $(sudo systemctl is-active nginx)"
echo "   - PostgreSQL status: $(sudo systemctl is-active postgresql)"
echo ""
echo "🔧 Useful commands:"
echo "   - Check system status: sudo /usr/local/bin/baheka-status.sh"
echo "   - View app logs: sudo -u bahekatech pm2 logs baheka-tech"
echo "   - Restart app: sudo -u bahekatech pm2 restart baheka-tech"
echo ""
echo "⚠️  IMPORTANT: Don't forget to:"
echo "   1. Update .env.production with your actual API keys"
echo "   2. Change the database password"
echo "   3. Set secure session and JWT secrets"
echo "   4. Test the contact form"
echo ""
echo "Your Baheka Tech website is now live at https://$DOMAIN! 🚀"