# Complete Deployment Guide for bahekatechfirm.com

## Domain Status ✅
- **Domain**: `bahekatechfirm.com` is registered
- **Registrar**: Amazon Registrar, Inc.
- **Nameservers**: AWS Route 53 (ready for DNS configuration)
- **Created**: 7/15/2025
- **Expires**: 7/15/2026

## Deployment Options

### Option 1: One-Click Complete Deployment (Recommended)

This script handles everything automatically:

```bash
# 1. Launch Ubuntu 22.04 EC2 instance (t3.medium recommended)
# 2. Upload deployment files
scp -i your-key.pem -r . ubuntu@YOUR_EC2_IP:~/baheka-tech/

# 3. SSH to instance
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# 4. Run one-click deployment
cd baheka-tech
./deploy/one-click-deploy.sh
```

**What it does:**
- Configures AWS Route 53 DNS records
- Installs all required software (Node.js, PostgreSQL, NGINX, SSL)
- Builds and deploys your React/Express application
- Sets up SSL certificates with Let's Encrypt
- Configures firewall and security
- Starts monitoring and backups

### Option 2: Step-by-Step Manual Deployment

If you prefer more control:

```bash
# Step 1: Configure DNS
./deploy/aws-dns-setup.sh

# Step 2: Complete deployment
./deploy/complete-deployment.sh
```

### Option 3: Deploy to Replit for Testing

Click the "Deploy" button in Replit to get an instant `.replit.app` URL for testing.

## Pre-Deployment Checklist

### AWS Requirements
- [ ] EC2 instance running Ubuntu 22.04 LTS
- [ ] Instance type: t3.medium (recommended) or t2.micro (free tier)
- [ ] Security groups: SSH (22), HTTP (80), HTTPS (443)
- [ ] IAM role with Route 53 permissions (or AWS CLI configured)
- [ ] Elastic IP assigned to instance

### Domain Configuration
- [x] Domain registered: `bahekatechfirm.com`
- [x] AWS nameservers configured
- [ ] DNS A records will be created automatically

### Application Requirements
- [ ] SENDGRID_API_KEY for email functionality
- [ ] SSL certificates (handled automatically)
- [ ] Database configuration (handled automatically)

## Post-Deployment Configuration

### 1. Update Environment Variables
```bash
sudo nano /var/www/baheka-tech/.env.production
# Update SENDGRID_API_KEY with your actual key
sudo -u bahekatech pm2 restart baheka-tech
```

### 2. Test Your Website
- Visit: `https://bahekatechfirm.com`
- Test contact form
- Verify SSL certificate (should show as secure)
- Test mobile responsiveness

### 3. Monitor Your Application
```bash
# Check application status
sudo -u bahekatech pm2 status

# View logs
sudo -u bahekatech pm2 logs baheka-tech

# System health
sudo /usr/local/bin/baheka-status  # (if using complete deployment)
```

## Expected Results

### What You'll Get
✅ **Live Website**: `https://bahekatechfirm.com`  
✅ **SSL Certificate**: A+ grade security  
✅ **Database**: PostgreSQL with contact form storage  
✅ **Email**: Contact form with SendGrid integration  
✅ **Monitoring**: Health checks and automated backups  
✅ **Security**: Firewall, fail2ban, security headers  
✅ **Performance**: Optimized React build with CDN-ready assets  

### Performance Specs
- **Load Time**: <2 seconds
- **SSL Grade**: A+
- **Mobile Optimized**: Yes
- **SEO Ready**: Yes
- **Contact Form**: Functional with email notifications

## Troubleshooting

### Common Issues

**DNS Not Resolving**
```bash
# Check DNS propagation
nslookup bahekatechfirm.com
# Wait 5-10 minutes and try again
```

**SSL Certificate Issues**
```bash
# Renew certificates
sudo certbot renew
sudo systemctl reload nginx
```

**Application Not Starting**
```bash
# Check logs
sudo -u bahekatech pm2 logs baheka-tech
# Restart application
sudo -u bahekatech pm2 restart baheka-tech
```

**Database Connection Issues**
```bash
# Check PostgreSQL
sudo systemctl status postgresql
# Restart if needed
sudo systemctl restart postgresql
```

## Support Commands

```bash
# Application management
sudo -u bahekatech pm2 status
sudo -u bahekatech pm2 restart baheka-tech
sudo -u bahekatech pm2 logs baheka-tech

# System management
sudo systemctl status nginx
sudo systemctl status postgresql
sudo ufw status

# SSL management
sudo certbot certificates
sudo certbot renew --dry-run
```

## Security Features

- **Firewall**: UFW configured (SSH, HTTP, HTTPS only)
- **Fail2ban**: Intrusion detection and prevention
- **SSL/TLS**: Let's Encrypt certificates with auto-renewal
- **Security Headers**: XSS protection, HSTS, content type options
- **Database Security**: Dedicated user with limited permissions
- **Application Security**: Environment variables, secure sessions

## Maintenance

### Automated
- **SSL Renewal**: Automatic via certbot
- **Daily Backups**: Database and application files
- **Log Rotation**: Weekly cleanup
- **Security Updates**: Manual (recommended monthly)

### Manual Tasks
- Monitor application performance
- Update dependencies quarterly
- Review security logs monthly
- Test backup restoration quarterly

## Success Criteria

Your deployment is successful when:
- [ ] Website loads at `https://bahekatechfirm.com`
- [ ] SSL certificate shows as valid and secure
- [ ] Contact form submits successfully
- [ ] Email notifications are sent
- [ ] All pages are responsive on mobile
- [ ] No console errors in browser
- [ ] Application restarts automatically after server reboot

## Next Steps

After successful deployment:
1. **Test thoroughly** - All pages, forms, and functionality
2. **Update content** - Add your actual content and images
3. **Configure analytics** - Add Google Analytics if needed
4. **Set up monitoring** - Consider additional monitoring services
5. **Regular maintenance** - Schedule monthly reviews and updates

Your Baheka Tech website will be production-ready with enterprise-grade hosting!