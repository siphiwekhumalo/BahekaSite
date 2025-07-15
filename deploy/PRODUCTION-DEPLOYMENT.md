# Production Deployment for bahekatechfirm.com

## Quick Start Guide

### Prerequisites
- AWS Account with EC2 access
- Domain `bahekatechfirm.com` (purchased and accessible)
- SSH key pair for EC2 access

### Step 1: Launch EC2 Instance

1. **Go to AWS Console → EC2 → Launch Instance**
2. **Configuration**:
   - **Name**: `baheka-tech-production`
   - **AMI**: Ubuntu Server 22.04 LTS (Free tier eligible)
   - **Instance Type**: `t3.medium` (recommended) or `t2.micro` (free tier)
   - **Key Pair**: Select your existing key pair or create new one
   - **Security Group**: Create new with these rules:
     ```
     SSH (22)    - Your IP only
     HTTP (80)   - 0.0.0.0/0
     HTTPS (443) - 0.0.0.0/0
     ```
   - **Storage**: 20GB gp3 (minimum)

3. **Launch the instance**

### Step 2: Get Elastic IP
1. **EC2 → Elastic IPs → Allocate Elastic IP**
2. **Associate with your instance**
3. **Note the IP address** (you'll need it for DNS)

### Step 3: Upload and Run Deployment

```bash
# From your local machine (where you have this project)
# Replace YOUR_KEY.pem and YOUR_ELASTIC_IP with actual values

# Upload the one-click deployment script
scp -i YOUR_KEY.pem deploy/bahekatechfirm-deploy.sh ubuntu@YOUR_ELASTIC_IP:~/

# Upload the project files
scp -i YOUR_KEY.pem -r . ubuntu@YOUR_ELASTIC_IP:~/baheka-tech-source/

# Connect to your server
ssh -i YOUR_KEY.pem ubuntu@YOUR_ELASTIC_IP

# Run the deployment
chmod +x bahekatechfirm-deploy.sh
./bahekatechfirm-deploy.sh
```

### Step 4: Configure DNS (When Prompted)

The script will pause and ask you to configure DNS. Here's what to do:

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
3. **Wait 5-60 minutes** for DNS to propagate
4. **Test**: `nslookup bahekatechfirm.com` should return your IP
5. **Press Enter** in the deployment script to continue

### Step 5: Update Environment Variables

After deployment, update your production environment:

```bash
# Edit the environment file
sudo nano /var/www/baheka-tech/.env.production

# Update these critical values:
DATABASE_URL=postgresql://bahekatech:NEW_SECURE_PASSWORD@localhost:5432/baheka_tech
SENDGRID_API_KEY=your_actual_sendgrid_key_here
SESSION_SECRET=generate_long_random_string_here
JWT_SECRET=generate_another_long_random_string_here

# Save and restart the application
sudo -u bahekatech pm2 restart baheka-tech
```

### Step 6: Final Testing

```bash
# Test your website
curl -I https://bahekatechfirm.com

# Test contact form
curl -X POST https://bahekatechfirm.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","service":"Web Development","message":"Test deployment"}'

# Check system status
sudo /usr/local/bin/baheka-status.sh
```

## What Gets Deployed

### Infrastructure
- **Ubuntu 22.04 LTS** server
- **Node.js 20** runtime
- **PostgreSQL 15** database
- **NGINX** reverse proxy
- **PM2** process manager
- **Let's Encrypt SSL** certificates

### Security
- **Firewall** configured (only SSH, HTTP, HTTPS)
- **fail2ban** for intrusion prevention
- **SSL/TLS** with A+ grade security
- **Security headers** configured
- **Database** with dedicated user

### Monitoring & Maintenance
- **Health checks** every 5 minutes
- **Daily backups** at 3 AM
- **Log rotation** weekly
- **SSL auto-renewal**
- **System monitoring** tools

### Application Features
- **React frontend** with optimized build
- **Express.js backend** with clustering
- **Contact form** with email integration
- **Database** for contact submissions
- **Responsive design** for all devices

## Post-Deployment Commands

```bash
# Check application status
sudo -u bahekatech pm2 status

# View application logs
sudo -u bahekatech pm2 logs baheka-tech

# Restart application
sudo -u bahekatech pm2 restart baheka-tech

# Check system health
sudo /usr/local/bin/baheka-status.sh

# Manual backup
sudo /usr/local/bin/baheka-backup.sh

# Update application
sudo /usr/local/bin/baheka-update.sh
```

## Troubleshooting

### Common Issues

**502 Bad Gateway**
```bash
sudo -u bahekatech pm2 restart baheka-tech
sudo systemctl reload nginx
```

**SSL Certificate Issues**
```bash
sudo certbot renew --dry-run
sudo systemctl reload nginx
```

**Database Connection Issues**
```bash
sudo systemctl restart postgresql
sudo -u bahekatech pm2 restart baheka-tech
```

### Support Files
- **Logs**: `/var/log/baheka-tech/`
- **Backups**: `/var/backups/baheka-tech/`
- **Config**: `/var/www/baheka-tech/.env.production`

## Success Indicators

✅ **Website loads** at `https://bahekatechfirm.com`
✅ **SSL certificate** shows as secure
✅ **Contact form** sends emails successfully
✅ **All pages** load correctly
✅ **Mobile responsive** design works
✅ **Database** stores contact submissions
✅ **Monitoring** system active
✅ **Backups** running daily

Your Baheka Tech website will be live at `https://bahekatechfirm.com` with enterprise-grade hosting!