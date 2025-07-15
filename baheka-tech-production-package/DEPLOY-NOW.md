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
