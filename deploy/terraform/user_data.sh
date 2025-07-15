#!/bin/bash

# User data script for EC2 instance initialization
# This script runs automatically when the instance starts

set -e

# Update system
apt-get update -y
apt-get upgrade -y

# Install basic packages
apt-get install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Create application user
adduser --system --group --home /var/www/baheka-tech --shell /bin/bash bahekatech

# Create application directory
mkdir -p /var/www/baheka-tech
chown -R bahekatech:bahekatech /var/www/baheka-tech

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Install NGINX
apt-get install -y nginx

# Install PostgreSQL
apt-get install -y postgresql postgresql-contrib

# Install certbot
apt-get install -y snapd
snap install core
snap refresh core
snap install --classic certbot
ln -sf /snap/bin/certbot /usr/bin/certbot

# Configure firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw allow 80
ufw allow 443
ufw --force enable

# Set up PostgreSQL
sudo -u postgres psql -c "CREATE USER bahekatech WITH PASSWORD 'secure_password_change_this';"
sudo -u postgres psql -c "CREATE DATABASE baheka_tech OWNER bahekatech;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE baheka_tech TO bahekatech;"

# Create environment file
cat > /var/www/baheka-tech/.env.production << 'EOF'
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://bahekatech:secure_password_change_this@localhost:5432/baheka_tech
DOMAIN=${domain_name}
SENDGRID_API_KEY=your_sendgrid_api_key_here
BAHEKA_EMAIL=contact@${domain_name}
SESSION_SECRET=your_session_secret_here
JWT_SECRET=your_jwt_secret_here
EOF

chown bahekatech:bahekatech /var/www/baheka-tech/.env.production

# Enable services
systemctl enable nginx
systemctl enable postgresql

# Signal completion
echo "EC2 user data script completed successfully" >> /var/log/user-data.log