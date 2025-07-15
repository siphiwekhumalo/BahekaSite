# AWS Deployment from Replit

## Prerequisites Setup

Since you're deploying from Replit, you'll need to configure AWS credentials. Here's how:

### 1. Get AWS Credentials

1. Go to AWS Console → IAM → Users → Your user → Security credentials
2. Create new Access Key (for CLI usage)
3. Copy the Access Key ID and Secret Access Key

### 2. Configure AWS CLI in Replit

Run these commands in the Replit terminal:

```bash
aws configure
```

When prompted, enter:
- AWS Access Key ID: `your_access_key_id`
- AWS Secret Access Key: `your_secret_access_key`
- Default region name: `us-east-1`
- Default output format: `json`

### 3. Environment Variables

Your current environment is already set up with:
- DATABASE_URL: ✅ Ready
- BAHEKA_EMAIL: ✅ Set to contact@bahekatech.com
- SENDGRID_API_KEY: ⚠️ Not set (emails will be skipped)

### 4. Run Deployment

After AWS credentials are configured, run:

```bash
./aws/deploy.sh
```

## What Will Be Deployed

1. **Lambda Functions**: Contact form API endpoints
2. **API Gateway**: REST API for frontend to communicate with Lambda
3. **S3 Bucket**: Static website hosting for React frontend
4. **CloudFormation Stack**: Infrastructure as code

## Expected Results

- API Gateway URL: `https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod`
- S3 Website URL: `http://bahekatechfirm.com.s3-website-us-east-1.amazonaws.com`
- Contact form will work with database storage
- Email notifications will be skipped (no SendGrid key)

## Next Steps After Deployment

1. **Set up CloudFront** for HTTPS and better performance
2. **Configure Route 53** to point bahekatechfirm.com to your S3 website
3. **Add SendGrid API key** for email notifications
4. **Test the contact form** on the deployed site

## Troubleshooting

If deployment fails:
- Check AWS credentials: `aws sts get-caller-identity`
- Verify permissions: IAM user needs Lambda, API Gateway, S3, and CloudFormation permissions
- Check logs: CloudWatch logs for Lambda functions

Ready to proceed? Configure AWS credentials and run the deployment script!