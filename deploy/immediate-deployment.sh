#!/bin/bash

# Immediate Deployment Script
# Deploy to EC2 with IP access while domain is being configured

set -e

echo "🚀 Immediate deployment for testing while domain is configured..."

# Step 1: Deploy to EC2 with IP access
echo "📋 Step 1: Setting up EC2 deployment with IP access"

# Create IP-based NGINX configuration
create_ip_nginx_config() {
    local IP=$1
    cat > /tmp/nginx-ip-config << EOF
server {
    listen 80;
    server_name $IP;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
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
    }
    
    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF
}

# Get EC2 public IP
get_ec2_ip() {
    curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "IP_NOT_AVAILABLE"
}

# Main deployment function
deploy_with_ip() {
    local IP=$(get_ec2_ip)
    
    if [ "$IP" = "IP_NOT_AVAILABLE" ]; then
        echo "⚠️  Not running on EC2 or IP not available"
        echo "💡 Please provide your server IP address:"
        read -p "Server IP: " IP
    fi
    
    echo "🌐 Deploying with IP access: $IP"
    
    # Create IP-based NGINX config
    create_ip_nginx_config $IP
    
    # Apply configuration
    sudo cp /tmp/nginx-ip-config /etc/nginx/sites-available/baheka-tech-ip
    sudo ln -sf /etc/nginx/sites-available/baheka-tech-ip /etc/nginx/sites-enabled/
    
    # Test and reload NGINX
    sudo nginx -t && sudo systemctl reload nginx
    
    echo "✅ Website accessible at: http://$IP"
    echo "📝 Test commands:"
    echo "   curl -I http://$IP"
    echo "   curl -X POST http://$IP/api/contact -H 'Content-Type: application/json' -d '{\"firstName\":\"Test\",\"lastName\":\"User\",\"email\":\"test@test.com\",\"service\":\"Web Development\",\"message\":\"Test\"}'"
}

# Step 2: Prepare domain configuration for later
prepare_domain_config() {
    echo "📋 Step 2: Preparing domain configuration for bahekatechfirm.com"
    
    # Create domain-ready NGINX config
    cat > /tmp/nginx-domain-config << 'EOF'
server {
    listen 80;
    server_name bahekatechfirm.com www.bahekatechfirm.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name bahekatechfirm.com www.bahekatechfirm.com;
    
    # SSL configuration (to be added by certbot)
    
    # Security headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
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
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
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
    
    sudo cp /tmp/nginx-domain-config /etc/nginx/sites-available/baheka-tech-domain
    
    echo "✅ Domain configuration prepared"
    echo "💡 When domain is ready, run: sudo ln -sf /etc/nginx/sites-available/baheka-tech-domain /etc/nginx/sites-enabled/"
}

# Step 3: Domain switch instructions
create_domain_switch_script() {
    cat > /tmp/switch-to-domain.sh << 'EOF'
#!/bin/bash

# Script to switch from IP access to domain access
set -e

echo "🌐 Switching to domain access for bahekatechfirm.com..."

# Check if domain resolves
if ! getent hosts bahekatechfirm.com > /dev/null 2>&1; then
    echo "❌ Domain bahekatechfirm.com is not resolving to this server"
    echo "💡 Please configure DNS first:"
    echo "   1. Add A record: @ -> $(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
    echo "   2. Add A record: www -> $(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
    echo "   3. Wait for DNS propagation (5-60 minutes)"
    echo "   4. Test: nslookup bahekatechfirm.com"
    exit 1
fi

# Switch to domain configuration
sudo rm -f /etc/nginx/sites-enabled/baheka-tech-ip
sudo ln -sf /etc/nginx/sites-available/baheka-tech-domain /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Setup SSL
sudo certbot --nginx -d bahekatechfirm.com -d www.bahekatechfirm.com --non-interactive --agree-tos --email contact@bahekatechfirm.com

echo "✅ Successfully switched to domain access!"
echo "🌐 Website now available at: https://bahekatechfirm.com"
EOF
    
    chmod +x /tmp/switch-to-domain.sh
    sudo mv /tmp/switch-to-domain.sh /usr/local/bin/switch-to-domain
    
    echo "✅ Domain switch script created: /usr/local/bin/switch-to-domain"
}

# Main execution
main() {
    echo "🚀 Starting immediate deployment process..."
    
    # Deploy with IP access
    deploy_with_ip
    
    # Prepare domain configuration
    prepare_domain_config
    
    # Create domain switch script
    create_domain_switch_script
    
    echo ""
    echo "✅ Immediate deployment complete!"
    echo ""
    echo "📋 Current status:"
    echo "   - Website accessible via IP address"
    echo "   - Domain configuration prepared"
    echo "   - Switch script ready"
    echo ""
    echo "🌐 Next steps:"
    echo "   1. Test website with IP address"
    echo "   2. Configure DNS for bahekatechfirm.com"
    echo "   3. Run: sudo /usr/local/bin/switch-to-domain"
    echo ""
    echo "🔧 Domain configuration needed:"
    echo "   - Register bahekatechfirm.com if not done"
    echo "   - Add A record: @ -> $(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'YOUR_SERVER_IP')"
    echo "   - Add A record: www -> $(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'YOUR_SERVER_IP')"
}

main "$@"
EOF

chmod +x /tmp/immediate-deployment.sh
sudo mv /tmp/immediate-deployment.sh /usr/local/bin/immediate-deployment

echo "🚀 Immediate deployment script created!"
echo "💡 Run: sudo /usr/local/bin/immediate-deployment"