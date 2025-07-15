#!/bin/bash

# EC2 Production Deployment Script for Baheka Tech Website
# This script sets up a complete production environment on EC2

set -e

echo "🚀 Setting up Baheka Tech website on EC2..."

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo "This script should not be run as root. Please run as a regular user with sudo privileges."
   exit 1
fi

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
echo "🔧 Installing essential packages..."
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Install Node.js 20
echo "📋 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js installation
node_version=$(node -v)
npm_version=$(npm -v)
echo "✅ Node.js installed: $node_version"
echo "✅ npm installed: $npm_version"

# Install PM2 for process management
echo "🔄 Installing PM2..."
sudo npm install -g pm2

# Install NGINX
echo "🌐 Installing NGINX..."
sudo apt install -y nginx

# Install PostgreSQL
echo "🗄️ Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Install certbot for SSL
echo "🔒 Installing Certbot for SSL..."
sudo apt install -y snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -sf /snap/bin/certbot /usr/bin/certbot

# Create application user
echo "👤 Creating application user..."
sudo adduser --system --group --home /var/www/baheka-tech --shell /bin/bash bahekatech

# Create application directory
echo "📁 Setting up application directory..."
sudo mkdir -p /var/www/baheka-tech
sudo chown -R bahekatech:bahekatech /var/www/baheka-tech

# Setup PostgreSQL database
echo "🗃️ Setting up PostgreSQL database..."
sudo -u postgres psql -c "CREATE USER bahekatech WITH PASSWORD 'secure_password_here';"
sudo -u postgres psql -c "CREATE DATABASE baheka_tech OWNER bahekatech;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE baheka_tech TO bahekatech;"

# Configure PostgreSQL for application
sudo -u postgres psql -c "ALTER USER bahekatech CREATEDB;"

# Setup firewall
echo "🔥 Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Create environment file template
echo "📝 Creating environment template..."
sudo tee /var/www/baheka-tech/.env.production > /dev/null <<EOF
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://bahekatech:secure_password_here@localhost:5432/baheka_tech

# Email configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
BAHEKA_EMAIL=contact@bahekatechfirm.com

# Domain configuration
DOMAIN=bahekatechfirm.com
SUBDOMAIN=www.bahekatechfirm.com

# Security
SESSION_SECRET=your_session_secret_here
JWT_SECRET=your_jwt_secret_here

# AWS Configuration (optional)
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
STAGE=production
EOF

sudo chown bahekatech:bahekatech /var/www/baheka-tech/.env.production

echo "✅ EC2 base setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Upload your application code to /var/www/baheka-tech/"
echo "2. Configure your domain DNS to point to this EC2 instance"
echo "3. Run the application setup script"
echo "4. Configure SSL with certbot"
echo ""
echo "🔧 Manual steps required:"
echo "1. Update /var/www/baheka-tech/.env.production with your actual values"
echo "2. Set up your domain's A record to point to this EC2 instance's Elastic IP"
echo "3. Configure email service API keys"
echo ""
echo "💡 Instance IP: $(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"