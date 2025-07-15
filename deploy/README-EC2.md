# EC2 Deployment Guide for Baheka Tech Website

This guide provides complete instructions for deploying your Baheka Tech website on AWS EC2 with production-ready configuration, SSL certificates, and monitoring.

## Prerequisites

1. **AWS Account** with EC2 access
2. **Domain Name** (e.g., bahekatech.com)
3. **SSH Key Pair** for EC2 access
4. **Basic Linux knowledge**

## Step 1: Launch EC2 Instance

### Instance Configuration
```bash
# Recommended instance type: t3.medium or t3.large
# Operating System: Ubuntu 22.04 LTS
# Storage: 20GB+ EBS volume
# Security Group: Allow SSH (22), HTTP (80), HTTPS (443)
```

### Security Group Rules
```bash
Type            Protocol    Port    Source
SSH             TCP         22      Your IP
HTTP            TCP         80      0.0.0.0/0
HTTPS           TCP         443     0.0.0.0/0
```

## Step 2: Initial Server Setup

### Connect to your instance
```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### Run the setup script
```bash
# Upload the setup script
scp -i your-key.pem deploy/ec2-setup.sh ubuntu@your-ec2-public-ip:~/

# Make it executable and run
chmod +x ec2-setup.sh
./ec2-setup.sh
```

## Step 3: Upload Application Code

### Option A: Using SCP
```bash
# From your local machine
scp -i your-key.pem -r . ubuntu@your-ec2-public-ip:/tmp/baheka-tech/

# On the server
sudo mv /tmp/baheka-tech/* /var/www/baheka-tech/
sudo chown -R bahekatech:bahekatech /var/www/baheka-tech/
```

### Option B: Using Git
```bash
# On the server
sudo -u bahekatech git clone https://github.com/yourusername/baheka-tech.git /var/www/baheka-tech/
```

## Step 4: Configure Environment

### Edit production environment file
```bash
sudo nano /var/www/baheka-tech/.env.production
```

### Required environment variables
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://bahekatech:your_secure_password@localhost:5432/baheka_tech

# Email configuration
SENDGRID_API_KEY=your_sendgrid_api_key
BAHEKA_EMAIL=contact@bahekatech.com

# Domain configuration
DOMAIN=bahekatech.com
SUBDOMAIN=www.bahekatech.com

# Security
SESSION_SECRET=your_secure_session_secret
JWT_SECRET=your_jwt_secret

# AWS (optional)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
```

## Step 5: Deploy Application

### Run the deployment script
```bash
# Make sure you're in the correct directory
cd /var/www/baheka-tech

# Run deployment script
sudo ./deploy/app-deploy.sh bahekatech.com
```

## Step 6: Configure Domain DNS

### Set up DNS records
```bash
# A Record
Type: A
Name: @ (or your domain)
Value: your-ec2-public-ip
TTL: 3600

# CNAME Record
Type: CNAME
Name: www
Value: bahekatech.com
TTL: 3600
```

### Get Elastic IP (Recommended)
```bash
# In AWS Console:
# EC2 → Elastic IPs → Allocate Elastic IP
# Associate with your instance
```

## Step 7: Setup SSL Certificate

### Wait for DNS propagation (5-60 minutes)
```bash
# Check DNS propagation
nslookup bahekatech.com
dig bahekatech.com
```

### Install SSL certificate
```bash
sudo ./deploy/ssl-setup.sh bahekatech.com contact@bahekatech.com
```

## Step 8: Setup Monitoring

### Install monitoring tools
```bash
sudo ./deploy/monitoring-setup.sh
```

### Verify monitoring is working
```bash
# Check system status
sudo /usr/local/bin/baheka-status.sh

# Check monitoring logs
sudo tail -f /var/log/baheka-tech/monitor.log
```

## Step 9: Final Verification

### Test your website
```bash
# HTTP redirect to HTTPS
curl -I http://bahekatech.com

# HTTPS response
curl -I https://bahekatech.com

# SSL certificate
openssl s_client -servername bahekatech.com -connect bahekatech.com:443 < /dev/null
```

### Check all services
```bash
# Application status
sudo -u bahekatech pm2 status

# NGINX status
sudo systemctl status nginx

# Database status
sudo systemctl status postgresql

# SSL certificate status
sudo certbot certificates
```

## Maintenance Commands

### Application Management
```bash
# View application logs
sudo -u bahekatech pm2 logs baheka-tech

# Restart application
sudo -u bahekatech pm2 restart baheka-tech

# Update application
sudo /usr/local/bin/baheka-update.sh
```

### System Management
```bash
# Check system status
sudo /usr/local/bin/baheka-status.sh

# Manual backup
sudo /usr/local/bin/baheka-backup.sh

# Check security logs
sudo fail2ban-client status
```

### SSL Management
```bash
# Check certificate expiry
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

## Troubleshooting

### Common Issues

1. **502 Bad Gateway**
   ```bash
   # Check if app is running
   sudo -u bahekatech pm2 status
   
   # Check NGINX logs
   sudo tail -f /var/log/nginx/error.log
   ```

2. **Database Connection Error**
   ```bash
   # Check PostgreSQL
   sudo systemctl status postgresql
   
   # Test database connection
   sudo -u postgres psql -d baheka_tech
   ```

3. **SSL Certificate Issues**
   ```bash
   # Check certificate
   sudo certbot certificates
   
   # Check NGINX SSL config
   sudo nginx -t
   ```

4. **High Memory Usage**
   ```bash
   # Check memory usage
   free -h
   
   # Restart PM2 if needed
   sudo -u bahekatech pm2 restart baheka-tech
   ```

### Log Files
```bash
# Application logs
/var/log/baheka-tech/app.log
/var/log/baheka-tech/error.log

# NGINX logs
/var/log/nginx/access.log
/var/log/nginx/error.log

# System logs
/var/log/syslog
/var/log/auth.log
```

## Security Best Practices

1. **Regular Updates**
   ```bash
   # Update system packages
   sudo apt update && sudo apt upgrade -y
   
   # Update application
   sudo /usr/local/bin/baheka-update.sh
   ```

2. **Monitor Security**
   ```bash
   # Check fail2ban status
   sudo fail2ban-client status
   
   # Monitor auth logs
   sudo tail -f /var/log/auth.log
   ```

3. **Backup Strategy**
   ```bash
   # Automated daily backups are configured
   # Manual backup: sudo /usr/local/bin/baheka-backup.sh
   
   # Backup location: /var/backups/baheka-tech/
   ```

## Performance Optimization

### Enable HTTP/2
```bash
# Already configured in NGINX
# Verify: curl -I --http2 https://bahekatech.com
```

### Enable Gzip Compression
```bash
# Already configured in NGINX
# Test: curl -H "Accept-Encoding: gzip" -I https://bahekatech.com
```

### Database Optimization
```bash
# PostgreSQL is configured with optimal settings
# Monitor with: sudo -u postgres psql -d baheka_tech -c "SELECT * FROM pg_stat_activity;"
```

## Scaling Considerations

1. **Vertical Scaling**: Upgrade EC2 instance type
2. **Horizontal Scaling**: Use Application Load Balancer + Auto Scaling
3. **Database Scaling**: Consider RDS for managed PostgreSQL
4. **CDN**: Add CloudFront for static assets

## Cost Optimization

1. **Reserved Instances**: Save up to 70% for predictable workloads
2. **Spot Instances**: Use for development environments
3. **Monitoring**: Set up billing alerts
4. **Auto Scaling**: Scale down during low traffic periods

Your Baheka Tech website is now fully deployed on EC2 with enterprise-grade security, monitoring, and SSL certificates!