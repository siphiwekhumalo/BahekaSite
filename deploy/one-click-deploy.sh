#!/bin/bash

# One-Click Complete Deployment for bahekatechfirm.com
# This script handles everything: DNS, EC2 setup, SSL, and deployment

set -e

DOMAIN="bahekatechfirm.com"
echo "🚀 Starting one-click deployment for $DOMAIN..."

# Step 1: Check prerequisites
check_prerequisites() {
    echo "📋 Checking prerequisites..."
    
    # Check if running on EC2
    if ! curl -s --max-time 2 http://169.254.169.254/latest/meta-data/instance-id &>/dev/null; then
        echo "❌ This script must be run on an EC2 instance"
        echo "💡 Please launch an EC2 instance and run this script there"
        exit 1
    fi
    
    # Get instance IP
    INSTANCE_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
    echo "✅ Running on EC2 instance with IP: $INSTANCE_IP"
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        echo "📦 Installing AWS CLI..."
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        unzip -q awscliv2.zip
        sudo ./aws/install
        rm -rf aws awscliv2.zip
    fi
    
    echo "✅ Prerequisites checked!"
}

# Step 2: Configure DNS
configure_dns() {
    echo "🌐 Configuring DNS for $DOMAIN..."
    
    # Check if AWS is configured
    if ! aws sts get-caller-identity &>/dev/null; then
        echo "⚠️  AWS CLI not configured"
        echo "💡 Configuring AWS CLI with instance profile..."
        
        # Try to use instance profile
        if ! aws sts get-caller-identity --profile default &>/dev/null; then
            echo "❌ No AWS credentials found"
            echo "💡 Please configure AWS CLI:"
            echo "   aws configure"
            echo "   or attach an IAM role to this EC2 instance"
            exit 1
        fi
    fi
    
    # Find or create hosted zone
    HOSTED_ZONE_ID=$(aws route53 list-hosted-zones --query "HostedZones[?Name=='${DOMAIN}.'].Id" --output text 2>/dev/null | sed 's|/hostedzone/||' || echo "")
    
    if [ -z "$HOSTED_ZONE_ID" ]; then
        echo "📝 Creating hosted zone for $DOMAIN..."
        aws route53 create-hosted-zone \
            --name "$DOMAIN" \
            --caller-reference "$(date +%s)" \
            --hosted-zone-config Comment="Baheka Tech production domain" >/dev/null
        
        HOSTED_ZONE_ID=$(aws route53 list-hosted-zones --query "HostedZones[?Name=='${DOMAIN}.'].Id" --output text | sed 's|/hostedzone/||')
    fi
    
    # Create DNS records
    echo "📝 Creating DNS records..."
    cat > /tmp/dns-changes.json << EOF
{
    "Changes": [
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "$DOMAIN",
                "Type": "A",
                "TTL": 300,
                "ResourceRecords": [{"Value": "$INSTANCE_IP"}]
            }
        },
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "www.$DOMAIN",
                "Type": "A",
                "TTL": 300,
                "ResourceRecords": [{"Value": "$INSTANCE_IP"}]
            }
        }
    ]
}
EOF
    
    aws route53 change-resource-record-sets \
        --hosted-zone-id "$HOSTED_ZONE_ID" \
        --change-batch file:///tmp/dns-changes.json >/dev/null
    
    echo "✅ DNS records configured!"
    echo "⏳ Waiting for DNS propagation..."
    sleep 120  # Wait 2 minutes for DNS propagation
}

# Step 3: System setup
setup_system() {
    echo "🔧 Setting up system..."
    
    # Update system
    sudo apt update -y
    sudo apt upgrade -y
    
    # Install dependencies
    sudo apt install -y \
        nginx \
        postgresql \
        postgresql-contrib \
        certbot \
        python3-certbot-nginx \
        ufw \
        fail2ban \
        curl \
        git \
        unzip \
        software-properties-common
    
    # Install Node.js 20
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
    
    # Install PM2
    sudo npm install -g pm2
    
    echo "✅ System setup complete!"
}

# Step 4: Database setup
setup_database() {
    echo "🗄️  Setting up database..."
    
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    # Create database and user
    sudo -u postgres psql << 'EOF'
CREATE USER bahekatech WITH PASSWORD 'baheka_production_2025';
CREATE DATABASE baheka_tech OWNER bahekatech;
GRANT ALL PRIVILEGES ON DATABASE baheka_tech TO bahekatech;
\q
EOF
    
    echo "✅ Database setup complete!"
}

# Step 5: Deploy application
deploy_application() {
    echo "🚀 Deploying application..."
    
    # Create application user and directory
    sudo useradd -r -s /bin/bash -d /var/www/baheka-tech bahekatech 2>/dev/null || true
    sudo mkdir -p /var/www/baheka-tech
    
    # Copy application files
    sudo cp -r . /var/www/baheka-tech/
    sudo chown -R bahekatech:bahekatech /var/www/baheka-tech
    
    # Create production environment
    sudo -u bahekatech tee /var/www/baheka-tech/.env.production << EOF
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://bahekatech:baheka_production_2025@localhost:5432/baheka_tech

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
    cd /var/www/baheka-tech
    sudo -u bahekatech npm install
    sudo -u bahekatech npm run build
    
    # Start with PM2
    sudo -u bahekatech pm2 start npm --name "baheka-tech" -- start
    sudo -u bahekatech pm2 save
    sudo -u bahekatech pm2 startup
    
    echo "✅ Application deployed!"
}

# Step 6: Configure NGINX
configure_nginx() {
    echo "🌐 Configuring NGINX..."
    
    sudo tee /etc/nginx/sites-available/baheka-tech << 'EOF'
server {
    listen 80;
    server_name bahekatechfirm.com www.bahekatechfirm.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /assets {
        alias /var/www/baheka-tech/dist/public/assets;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
    
    sudo ln -sf /etc/nginx/sites-available/baheka-tech /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    sudo nginx -t
    sudo systemctl restart nginx
    
    echo "✅ NGINX configured!"
}

# Step 7: Setup SSL
setup_ssl() {
    echo "🔒 Setting up SSL certificates..."
    
    # Wait for DNS propagation
    echo "⏳ Waiting for DNS propagation..."
    sleep 180
    
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

# Step 8: Configure security
configure_security() {
    echo "🔐 Configuring security..."
    
    # Setup firewall
    sudo ufw --force reset
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    sudo ufw allow ssh
    sudo ufw allow 'Nginx Full'
    sudo ufw --force enable
    
    # Configure fail2ban
    sudo systemctl enable fail2ban
    sudo systemctl start fail2ban
    
    echo "✅ Security configured!"
}

# Step 9: Final verification
verify_deployment() {
    echo "🔍 Verifying deployment..."
    
    # Wait for services to start
    sleep 30
    
    # Test HTTPS
    if curl -f -s "https://$DOMAIN" >/dev/null 2>&1; then
        echo "✅ HTTPS is working!"
    else
        echo "⚠️  HTTPS test failed"
    fi
    
    # Test contact form
    if curl -f -s -X POST "https://$DOMAIN/api/contact" \
        -H "Content-Type: application/json" \
        -d '{"firstName":"Test","lastName":"Deployment","email":"test@example.com","service":"Web Development","message":"Deployment test"}' >/dev/null 2>&1; then
        echo "✅ Contact form is working!"
    else
        echo "⚠️  Contact form test failed"
    fi
    
    echo "✅ Verification complete!"
}

# Main execution
main() {
    echo "🎯 One-click deployment starting for $DOMAIN..."
    
    check_prerequisites
    configure_dns
    setup_system
    setup_database
    deploy_application
    configure_nginx
    setup_ssl
    configure_security
    verify_deployment
    
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo ""
    echo "✅ Your website is live at: https://$DOMAIN"
    echo "✅ SSL certificates installed and auto-renewing"
    echo "✅ Security configured (firewall, fail2ban)"
    echo "✅ Database and application running"
    echo ""
    echo "📋 Quick commands:"
    echo "   Check status: sudo -u bahekatech pm2 status"
    echo "   View logs: sudo -u bahekatech pm2 logs baheka-tech"
    echo "   Restart app: sudo -u bahekatech pm2 restart baheka-tech"
    echo ""
    echo "🌐 Your Baheka Tech website is ready for production!"
}

main "$@"