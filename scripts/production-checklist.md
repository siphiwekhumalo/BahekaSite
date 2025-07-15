# Production Deployment Checklist

## Pre-Deployment

### Domain & DNS
- [ ] Domain purchased and accessible
- [ ] DNS records configured (A record pointing to server IP)
- [ ] www subdomain configured (CNAME or A record)
- [ ] DNS propagation verified (use `nslookup domain.com`)

### AWS Setup
- [ ] AWS account created and accessible
- [ ] EC2 key pair created and downloaded
- [ ] Security group configured (SSH, HTTP, HTTPS)
- [ ] Elastic IP allocated and associated with instance

### Environment Configuration
- [ ] `.env.production` file configured with actual values
- [ ] Database password changed from default
- [ ] SendGrid API key obtained and added
- [ ] Session secret generated (long random string)
- [ ] JWT secret generated (long random string)

### Code Preparation
- [ ] All development dependencies removed from production
- [ ] Build process tested locally
- [ ] Database migrations tested
- [ ] All API endpoints tested
- [ ] Contact form tested with actual email delivery

## Deployment Steps

### Server Setup
- [ ] EC2 instance launched with correct configuration
- [ ] SSH access verified
- [ ] `ec2-setup.sh` script executed successfully
- [ ] All required services installed (Node.js, PostgreSQL, NGINX, PM2)
- [ ] Firewall configured and enabled

### Application Deployment
- [ ] Application code uploaded to `/var/www/baheka-tech/`
- [ ] File permissions set correctly (`chown -R bahekatech:bahekatech`)
- [ ] `app-deploy.sh` script executed successfully
- [ ] Dependencies installed (`npm install --production`)
- [ ] Application built (`npm run build`)
- [ ] Database setup completed (`npm run db:push`)

### Web Server Configuration
- [ ] NGINX configuration applied
- [ ] PM2 ecosystem configured
- [ ] Application started with PM2
- [ ] NGINX reloaded with new configuration
- [ ] HTTP access verified (should work before SSL)

### SSL Certificate
- [ ] DNS verified to point to server
- [ ] `ssl-setup.sh` script executed successfully
- [ ] SSL certificate installed and verified
- [ ] HTTPS access working
- [ ] HTTP redirects to HTTPS
- [ ] SSL auto-renewal configured

### Monitoring & Security
- [ ] `monitoring-setup.sh` script executed
- [ ] Health monitoring active
- [ ] Daily backups configured
- [ ] Log rotation setup
- [ ] fail2ban configured and active
- [ ] Security headers verified

## Post-Deployment Verification

### Website Functionality
- [ ] Homepage loads correctly
- [ ] All pages accessible
- [ ] Contact form submission works
- [ ] Email notifications received
- [ ] Database storing submissions correctly
- [ ] All API endpoints responding

### Performance & Security
- [ ] SSL certificate A+ rating (test with SSL Labs)
- [ ] Page load times acceptable (<3 seconds)
- [ ] Mobile responsiveness verified
- [ ] Security headers present
- [ ] HTTPS enforced (no mixed content)

### Monitoring & Maintenance
- [ ] System status dashboard accessible
- [ ] Log files being written correctly
- [ ] Backup system tested
- [ ] Update process documented
- [ ] Monitoring alerts configured

## Ongoing Maintenance

### Daily
- [ ] Check system status: `sudo /usr/local/bin/baheka-status.sh`
- [ ] Review application logs: `sudo -u bahekatech pm2 logs`
- [ ] Monitor resource usage: `htop`

### Weekly
- [ ] Check SSL certificate expiry
- [ ] Review backup logs
- [ ] Update system packages: `sudo apt update && sudo apt upgrade`
- [ ] Check security logs: `sudo fail2ban-client status`

### Monthly
- [ ] Review and archive old logs
- [ ] Test backup restoration process
- [ ] Update application dependencies
- [ ] Review security configuration
- [ ] Check for OS security updates

### Quarterly
- [ ] Review and update SSL certificate (if needed)
- [ ] Performance analysis and optimization
- [ ] Security audit
- [ ] Disaster recovery testing
- [ ] Update documentation

## Emergency Procedures

### Application Down
1. Check PM2 status: `sudo -u bahekatech pm2 status`
2. Restart application: `sudo -u bahekatech pm2 restart baheka-tech`
3. Check logs: `sudo -u bahekatech pm2 logs baheka-tech`
4. If persistent, check database: `sudo systemctl status postgresql`

### High Load/Traffic
1. Monitor resources: `htop`
2. Check NGINX logs: `sudo tail -f /var/log/nginx/access.log`
3. Consider upgrading instance type
4. Enable rate limiting if needed

### Security Incident
1. Check fail2ban logs: `sudo fail2ban-client status`
2. Review auth logs: `sudo tail -f /var/log/auth.log`
3. Check for unusual activity in application logs
4. Consider temporary IP blocking if needed

### Data Loss
1. Stop application: `sudo -u bahekatech pm2 stop baheka-tech`
2. Restore from backup: Use latest backup from `/var/backups/baheka-tech/`
3. Test data integrity
4. Restart application: `sudo -u bahekatech pm2 start baheka-tech`

## Contact Information

### Key Personnel
- **System Administrator**: [Your Name/Contact]
- **Domain Provider**: [Provider Name/Login]
- **AWS Account**: [Account Details]
- **Email Service**: [SendGrid Account]

### Important Files
- **SSL Certificate**: Auto-renewed by Let's Encrypt
- **Database Backups**: `/var/backups/baheka-tech/`
- **Application Logs**: `/var/log/baheka-tech/`
- **Environment Config**: `/var/www/baheka-tech/.env.production`

### Useful Commands
```bash
# System status
sudo /usr/local/bin/baheka-status.sh

# Application restart
sudo -u bahekatech pm2 restart baheka-tech

# Database access
sudo -u bahekatech psql -d baheka_tech

# SSL renewal
sudo certbot renew

# System update
sudo /usr/local/bin/baheka-update.sh
```

This checklist ensures your Baheka Tech website is properly deployed, secure, and maintainable in production.