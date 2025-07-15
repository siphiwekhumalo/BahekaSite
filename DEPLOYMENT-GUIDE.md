# 🚀 Baheka Tech Website - Production Deployment Guide

## Quick Start Deployment

### Step 1: Launch EC2 Instance

1. **Go to AWS Console** → EC2 → Launch Instance
2. **Choose AMI**: Ubuntu Server 22.04 LTS (Free tier eligible)
3. **Instance Type**: t3.medium (recommended) or t2.micro (free tier)
4. **Key Pair**: Create new or use existing
5. **Security Group**: 
   - SSH (port 22) - Your IP only
   - HTTP (port 80) - Anywhere
   - HTTPS (port 443) - Anywhere
6. **Storage**: 20GB gp3 (minimum)
7. **Launch Instance**

### Step 2: Get Elastic IP (Important!)

1. Go to **EC2 → Elastic IPs**
2. Click **Allocate Elastic IP address**
3. **Associate** with your instance
4. **Note the IP address** - you'll need it for DNS

### Step 3: Upload Deployment Scripts

```bash
# From your local machine where you have this project
scp -i your-key.pem deploy/ec2-setup.sh ubuntu@YOUR_ELASTIC_IP:~/
scp -i your-key.pem deploy/app-deploy.sh ubuntu@YOUR_ELASTIC_IP:~/
scp -i your-key.pem deploy/ssl-setup.sh ubuntu@YOUR_ELASTIC_IP:~/
scp -i your-key.pem deploy/monitoring-setup.sh ubuntu@YOUR_ELASTIC_IP:~/
```

### Step 4: Run Initial Setup

```bash
# Connect to your server
ssh -i your-key.pem ubuntu@YOUR_ELASTIC_IP

# Make scripts executable
chmod +x *.sh

# Run the setup (this takes 5-10 minutes)
./ec2-setup.sh

# The script will install:
# - Node.js 20
# - PostgreSQL
# - NGINX
# - PM2
# - SSL tools
# - Security tools
```

### Step 5: Upload Your Application

```bash
# Option A: Upload entire project
scp -i your-key.pem -r . ubuntu@YOUR_ELASTIC_IP:/tmp/baheka-tech/

# On the server, move to correct location
sudo mv /tmp/baheka-tech/* /var/www/baheka-tech/
sudo chown -R bahekatech:bahekatech /var/www/baheka-tech/

# Option B: Use Git (if your code is in a repository)
sudo -u bahekatech git clone https://github.com/yourusername/baheka-tech.git /var/www/baheka-tech/
```

### Step 6: Configure Environment

```bash
# Edit the production environment file
sudo nano /var/www/baheka-tech/.env.production

# Update these values:
DATABASE_URL=postgresql://bahekatech:CHANGE_THIS_PASSWORD@localhost:5432/baheka_tech
SENDGRID_API_KEY=your_sendgrid_api_key_here
BAHEKA_EMAIL=contact@bahekatechfirm.com
DOMAIN=bahekatechfirm.com
SESSION_SECRET=generate_a_secure_random_string_here
```

### Step 7: Deploy Application

```bash
# Run the deployment script
cd /var/www/baheka-tech
sudo ./deploy/app-deploy.sh bahekatechfirm.com

# This will:
# - Install dependencies
# - Build the application
# - Setup database
# - Configure PM2
# - Configure NGINX
# - Start everything
```

### Step 8: Configure Domain DNS

**Before SSL setup, you MUST configure your domain:**

1. **Go to your domain registrar** (GoDaddy, Namecheap, etc.)
2. **Add these DNS records**:
   ```
   Type: A
   Name: @
   Value: YOUR_ELASTIC_IP
   TTL: 300
   
   Type: A
   Name: www
   Value: YOUR_ELASTIC_IP
   TTL: 300
   ```
3. **Wait 5-60 minutes** for DNS propagation
4. **Test**: `nslookup bahekatechfirm.com` should return your IP

### Step 9: Setup SSL Certificate

```bash
# Only run this AFTER DNS is pointing to your server
sudo ./deploy/ssl-setup.sh bahekatechfirm.com contact@bahekatechfirm.com

# This will:
# - Verify DNS is pointing to your server
# - Install Let's Encrypt SSL certificate
# - Configure automatic renewal
# - Update NGINX with SSL
```

### Step 10: Setup Monitoring

```bash
# Install monitoring and maintenance tools
sudo ./deploy/monitoring-setup.sh

# This adds:
# - Health monitoring every 5 minutes
# - Daily backups at 3 AM
# - Log rotation
# - Security monitoring
# - System status tools
```

## Verification Steps

### Check Website is Live
```bash
# Test HTTP (should redirect to HTTPS)
curl -I http://bahekatechfirm.com

# Test HTTPS (should return 200)
curl -I https://bahekatechfirm.com

# Test contact form
curl -X POST https://bahekatechfirm.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","service":"Web Development","message":"Test message"}'
```

### Check Services
```bash
# Check application status
sudo -u bahekatech pm2 status

# Check NGINX
sudo systemctl status nginx

# Check PostgreSQL
sudo systemctl status postgresql

# Check SSL certificate
sudo certbot certificates

# Overall system status
sudo /usr/local/bin/baheka-status.sh
```

## Post-Deployment Tasks

### 1. Update Environment Variables
```bash
# Edit production environment
sudo nano /var/www/baheka-tech/.env.production

# Add your actual API keys:
# - SendGrid API key for email
# - Any other service API keys
```

### 2. Test Contact Form
- Visit your website
- Fill out the contact form
- Check if email notifications work
- Check database for stored submissions

### 3. Monitor Logs
```bash
# Application logs
sudo -u bahekatech pm2 logs

# NGINX logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System monitoring
sudo tail -f /var/log/baheka-tech/monitor.log
```

## Maintenance Commands

### Daily Operations
```bash
# Check system status
sudo /usr/local/bin/baheka-status.sh

# Restart application if needed
sudo -u bahekatech pm2 restart baheka-tech

# View recent logs
sudo -u bahekatech pm2 logs baheka-tech --lines 50
```

### Updates
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update application (if using git)
sudo /usr/local/bin/baheka-update.sh

# Manual application restart
sudo -u bahekatech pm2 restart baheka-tech
sudo systemctl reload nginx
```

### Backups
```bash
# Manual backup
sudo /usr/local/bin/baheka-backup.sh

# View backups
ls -la /var/backups/baheka-tech/

# Restore from backup (if needed)
sudo -u postgres psql -d baheka_tech < /var/backups/baheka-tech/database_YYYYMMDD_HHMMSS.sql
```

## Security Checklist

- [ ] SSH key authentication only (no passwords)
- [ ] Firewall configured (only ports 22, 80, 443)
- [ ] SSL certificate installed and auto-renewing
- [ ] Database with dedicated user (not root)
- [ ] Application running as non-root user
- [ ] fail2ban installed and configured
- [ ] Regular security updates enabled
- [ ] Environment variables secured
- [ ] Monitoring and alerting active

## Scaling & Performance

### For Higher Traffic
1. **Upgrade instance type**: t3.medium → t3.large → t3.xlarge
2. **Add Application Load Balancer** with multiple instances
3. **Use RDS** for managed PostgreSQL
4. **Add CloudFront CDN** for static assets
5. **Implement Redis** for session storage

### Cost Optimization
1. **Use Reserved Instances** for 1-3 year commitments (up to 70% savings)
2. **Monitor usage** with CloudWatch
3. **Set up billing alerts**
4. **Use spot instances** for development

## Troubleshooting

### Common Issues

**502 Bad Gateway**
```bash
# Check if app is running
sudo -u bahekatech pm2 status
sudo -u bahekatech pm2 restart baheka-tech
```

**SSL Certificate Issues**
```bash
# Check certificate status
sudo certbot certificates
# Renew if needed
sudo certbot renew --dry-run
```

**Database Connection Issues**
```bash
# Check PostgreSQL
sudo systemctl status postgresql
# Test connection
sudo -u bahekatech psql -d baheka_tech
```

**High Resource Usage**
```bash
# Check system resources
htop
# Check disk space
df -h
# Check memory
free -h
```

## Support

### Log Files
- Application: `/var/log/baheka-tech/`
- NGINX: `/var/log/nginx/`
- System: `/var/log/syslog`
- PostgreSQL: `/var/log/postgresql/`

### Monitoring
- Health checks run every 5 minutes
- Daily backups at 3 AM
- Log rotation weekly
- SSL certificate monitoring

Your Baheka Tech website is now running in production with enterprise-grade security, performance, and monitoring!

## Next Steps After Deployment

1. **Set up monitoring alerts** (email/SMS when issues occur)
2. **Configure CDN** for better global performance
3. **Set up staging environment** for testing updates
4. **Implement CI/CD pipeline** for automated deployments
5. **Add database connection pooling** for better performance

Your website is now live and ready for business!