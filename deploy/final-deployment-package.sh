#!/bin/bash

# Final Production Deployment Package for bahekatechfirm.com
# This script prepares everything for EC2 deployment

set -e

echo "📦 Preparing production deployment package for bahekatechfirm.com..."

# Create deployment directory
DEPLOY_DIR="baheka-tech-production-package"
mkdir -p $DEPLOY_DIR

# Copy essential files
echo "📋 Copying deployment files..."
cp -r deploy/ $DEPLOY_DIR/
cp -r client/ $DEPLOY_DIR/
cp -r server/ $DEPLOY_DIR/
cp -r shared/ $DEPLOY_DIR/
cp package.json $DEPLOY_DIR/
cp package-lock.json $DEPLOY_DIR/
cp tsconfig.json $DEPLOY_DIR/
cp vite.config.ts $DEPLOY_DIR/
cp tailwind.config.ts $DEPLOY_DIR/
cp postcss.config.js $DEPLOY_DIR/
cp drizzle.config.ts $DEPLOY_DIR/
cp components.json $DEPLOY_DIR/
cp .env.example $DEPLOY_DIR/
cp README.md $DEPLOY_DIR/
cp DEPLOYMENT-GUIDE.md $DEPLOY_DIR/

# Create production environment template
cat > $DEPLOY_DIR/.env.production << 'EOF'
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://bahekatech:CHANGE_THIS_PASSWORD@localhost:5432/baheka_tech

# Email configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
BAHEKA_EMAIL=contact@bahekatechfirm.com

# Domain configuration
DOMAIN=bahekatechfirm.com
SUBDOMAIN=www.bahekatechfirm.com

# Security - CHANGE THESE VALUES
SESSION_SECRET=your_session_secret_here_change_this_value
JWT_SECRET=your_jwt_secret_here_change_this_value

# AWS Configuration (optional)
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
STAGE=production
EOF

# Make scripts executable
chmod +x $DEPLOY_DIR/deploy/*.sh

# Create deployment instructions
cat > $DEPLOY_DIR/DEPLOY-NOW.md << 'EOF'
# Deploy bahekatechfirm.com NOW

## Quick Commands

### 1. Upload to EC2
```bash
scp -i YOUR_KEY.pem -r . ubuntu@YOUR_ELASTIC_IP:~/baheka-tech/
```

### 2. SSH and Deploy
```bash
ssh -i YOUR_KEY.pem ubuntu@YOUR_ELASTIC_IP
cd baheka-tech
./deploy/bahekatechfirm-deploy.sh
```

### 3. Configure DNS when prompted
- Add A record: @ -> YOUR_ELASTIC_IP
- Add A record: www -> YOUR_ELASTIC_IP

### 4. Update environment
```bash
sudo nano /var/www/baheka-tech/.env.production
# Update API keys and secrets
sudo -u bahekatech pm2 restart baheka-tech
```

### 5. Test
Visit: https://bahekatechfirm.com

Done! Your website is live.
EOF

# Create archive
echo "📦 Creating deployment archive..."
tar -czf baheka-tech-production-$(date +%Y%m%d).tar.gz $DEPLOY_DIR/

# Create final instructions
cat > FINAL-DEPLOYMENT-INSTRUCTIONS.md << 'EOF'
# Final Deployment Instructions for bahekatechfirm.com

## What's Ready
- Complete deployment package created
- All scripts configured for bahekatechfirm.com
- One-click deployment script ready
- Production environment pre-configured

## Deploy Now

1. **Extract the package**: `tar -xzf baheka-tech-production-*.tar.gz`
2. **Follow**: `PRODUCTION-DEPLOYMENT.md` for step-by-step guide
3. **Quick deploy**: Use `bahekatechfirm-deploy.sh` for one-click deployment

## Files Included
- All source code
- Deployment scripts
- SSL setup
- Monitoring tools
- Database setup
- Production configuration

Your website will be live at: https://bahekatechfirm.com
EOF

echo "✅ Production deployment package ready!"
echo ""
echo "📁 Files created:"
echo "   - $DEPLOY_DIR/ (deployment directory)"
echo "   - baheka-tech-production-$(date +%Y%m%d).tar.gz (archive)"
echo "   - FINAL-DEPLOYMENT-INSTRUCTIONS.md"
echo ""
echo "🚀 Next steps:"
echo "1. Follow PRODUCTION-DEPLOYMENT.md for complete guide"
echo "2. Or use the one-click script: bahekatechfirm-deploy.sh"
echo ""
echo "Your website will be live at: https://bahekatechfirm.com"