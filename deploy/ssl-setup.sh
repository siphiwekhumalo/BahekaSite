#!/bin/bash

# SSL Certificate Setup Script using Let's Encrypt
# Run this after your domain is pointing to the server

set -e

DOMAIN="${1:-bahekatech.com}"
EMAIL="${2:-contact@bahekatech.com}"

echo "🔒 Setting up SSL certificate for $DOMAIN..."

# Verify domain is pointing to this server
echo "🧪 Verifying domain DNS..."
SERVER_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
DOMAIN_IP=$(dig +short $DOMAIN)

if [ "$SERVER_IP" != "$DOMAIN_IP" ]; then
    echo "⚠️  Warning: Domain $DOMAIN does not point to this server"
    echo "   Server IP: $SERVER_IP"
    echo "   Domain IP: $DOMAIN_IP"
    echo "   Please update your DNS records and try again"
    exit 1
fi

# Test HTTP access
echo "🌐 Testing HTTP access..."
if ! curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN | grep -q "200"; then
    echo "❌ HTTP access test failed. Please check your NGINX configuration."
    exit 1
fi

# Install SSL certificate
echo "🔐 Installing SSL certificate..."
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive

# Verify SSL certificate
echo "🧪 Verifying SSL certificate..."
if curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN | grep -q "200"; then
    echo "✅ SSL certificate successfully installed!"
else
    echo "❌ SSL verification failed. Please check the certificate installation."
    exit 1
fi

# Setup auto-renewal
echo "🔄 Setting up auto-renewal..."
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Test renewal
echo "🧪 Testing certificate renewal..."
sudo certbot renew --dry-run

# Update NGINX configuration for better security
echo "🔧 Updating NGINX security configuration..."
sudo tee /etc/nginx/snippets/ssl-params.conf > /dev/null <<EOF
# SSL Configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_timeout 10m;
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off;
ssl_stapling on;
ssl_stapling_verify on;

# Security headers
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-src 'self';" always;
EOF

# Update site configuration to include SSL parameters
sudo sed -i '/server_name/a\\tinclude /etc/nginx/snippets/ssl-params.conf;' /etc/nginx/sites-available/baheka-tech

# Test and reload NGINX
echo "🧪 Testing NGINX configuration..."
sudo nginx -t
sudo systemctl reload nginx

echo "✅ SSL setup complete!"
echo ""
echo "🔒 SSL Certificate Status:"
echo "   - Domain: $DOMAIN"
echo "   - Certificate: Let's Encrypt"
echo "   - Auto-renewal: Enabled"
echo "   - Security headers: Configured"
echo ""
echo "🌐 Your website is now available at:"
echo "   - https://$DOMAIN"
echo "   - https://www.$DOMAIN"
echo ""
echo "🔧 Useful commands:"
echo "   - Check certificate: sudo certbot certificates"
echo "   - Renew certificate: sudo certbot renew"
echo "   - Test renewal: sudo certbot renew --dry-run"
echo "   - Check renewal timer: sudo systemctl status certbot.timer"