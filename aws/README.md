# AWS Deployment Guide for Baheka Tech

This guide will help you deploy the Baheka Tech website to AWS using S3 for static hosting and Lambda functions for the API.

## Architecture Overview

- **Frontend**: React app hosted on S3 with CloudFront CDN
- **Backend**: AWS Lambda functions with API Gateway
- **Database**: PostgreSQL (Neon or AWS RDS)
- **Email**: SendGrid for contact form notifications
- **Domain**: Route 53 for DNS management

## Prerequisites

1. **AWS CLI** installed and configured
   ```bash
   aws configure
   ```

2. **Environment Variables** set:
   ```bash
   export DATABASE_URL="postgresql://user:password@host:port/database"
   export SENDGRID_API_KEY="your-sendgrid-api-key"  # Optional
   export BAHEKA_EMAIL="contact@bahekatech.com"     # Optional
   ```

3. **Domain**: You own `bahekatechfirm.com` and have it in Route 53

## Quick Deployment

Run the automated deployment script:

```bash
chmod +x aws/deploy.sh
./aws/deploy.sh
```

## Manual Deployment Steps

### 1. Deploy API Gateway and Lambda Functions

```bash
# Create deployment packages
cd aws/lambda
npm install
zip -r contact.zip contact.js package.json node_modules/
zip -r contact-submissions.zip contact-submissions.js package.json node_modules/
cd ../..

# Deploy CloudFormation stack
aws cloudformation deploy \
    --template-file aws/cloudformation/api-gateway.yml \
    --stack-name baheka-tech-stack \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
        DatabaseUrl="$DATABASE_URL" \
        SendGridApiKey="$SENDGRID_API_KEY" \
        BahekaEmail="$BAHEKA_EMAIL"

# Update Lambda function code
aws lambda update-function-code \
    --function-name baheka-contact-form \
    --zip-file fileb://aws/lambda/contact.zip

aws lambda update-function-code \
    --function-name baheka-contact-submissions \
    --zip-file fileb://aws/lambda/contact-submissions.zip
```

### 2. Get API Gateway URL

```bash
API_URL=$(aws cloudformation describe-stacks \
    --stack-name baheka-tech-stack \
    --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayUrl`].OutputValue' \
    --output text)

echo "API Gateway URL: $API_URL"
```

### 3. Build and Deploy Frontend

```bash
# Create production environment file
echo "VITE_API_URL=$API_URL" > .env.production

# Build the frontend
npm run build

# Create S3 bucket and configure for static hosting
aws s3api create-bucket --bucket bahekatechfirm.com --region us-east-1

aws s3api put-bucket-website \
    --bucket bahekatechfirm.com \
    --website-configuration '{
        "IndexDocument": {"Suffix": "index.html"},
        "ErrorDocument": {"Key": "index.html"}
    }'

# Make bucket public
aws s3api put-bucket-policy \
    --bucket bahekatechfirm.com \
    --policy '{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicRead",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::bahekatechfirm.com/*"
            }
        ]
    }'

# Upload files to S3
aws s3 sync dist/public/ s3://bahekatechfirm.com --delete
```

### 4. Set up CloudFront (Optional but Recommended)

```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
    --distribution-config '{
        "CallerReference": "baheka-tech-'$(date +%s)'",
        "Origins": {
            "Quantity": 1,
            "Items": [
                {
                    "Id": "S3-bahekatechfirm.com",
                    "DomainName": "bahekatechfirm.com.s3-website-us-east-1.amazonaws.com",
                    "CustomOriginConfig": {
                        "HTTPPort": 80,
                        "HTTPSPort": 443,
                        "OriginProtocolPolicy": "http-only"
                    }
                }
            ]
        },
        "DefaultCacheBehavior": {
            "TargetOriginId": "S3-bahekatechfirm.com",
            "ViewerProtocolPolicy": "redirect-to-https",
            "TrustedSigners": {
                "Enabled": false,
                "Quantity": 0
            },
            "MinTTL": 0,
            "ForwardedValues": {
                "QueryString": false,
                "Cookies": {"Forward": "none"}
            }
        },
        "Comment": "Baheka Tech website distribution",
        "Enabled": true,
        "Aliases": {
            "Quantity": 1,
            "Items": ["bahekatechfirm.com"]
        },
        "DefaultRootObject": "index.html"
    }'
```

### 5. Configure Route 53

```bash
# Create A record pointing to S3 website endpoint
aws route53 change-resource-record-sets \
    --hosted-zone-id YOUR_HOSTED_ZONE_ID \
    --change-batch '{
        "Changes": [
            {
                "Action": "CREATE",
                "ResourceRecordSet": {
                    "Name": "bahekatechfirm.com",
                    "Type": "A",
                    "AliasTarget": {
                        "DNSName": "bahekatechfirm.com.s3-website-us-east-1.amazonaws.com",
                        "EvaluateTargetHealth": false,
                        "HostedZoneId": "Z3AQBSTGFYJSTF"
                    }
                }
            }
        ]
    }'
```

## API Endpoints

After deployment, your API will be available at:
- `POST /contact` - Submit contact form
- `GET /contact/submissions` - Get all submissions (admin)
- `GET /contact/submissions/{id}` - Get specific submission
- `PUT /contact/submissions/{id}/status` - Update submission status

## Environment Variables

### Required
- `DATABASE_URL` - PostgreSQL connection string

### Optional
- `SENDGRID_API_KEY` - For email notifications
- `BAHEKA_EMAIL` - Recipient email for contact form submissions

## Frontend Configuration

The frontend needs to know the API Gateway URL. Create a `.env.production` file:

```env
VITE_API_URL=https://your-api-gateway-url.amazonaws.com/prod
```

## Testing

1. **Test API endpoints**:
   ```bash
   curl -X POST https://your-api-gateway-url.amazonaws.com/prod/contact \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "John",
       "lastName": "Doe",
       "email": "john@example.com",
       "service": "Web Development",
       "message": "Test message"
     }'
   ```

2. **Test frontend**: Visit `http://bahekatechfirm.com` and submit the contact form

## Monitoring

- **CloudWatch Logs**: Monitor Lambda function logs
- **API Gateway Metrics**: Track API usage and errors
- **S3 Access Logs**: Monitor website traffic

## Troubleshooting

### Common Issues

1. **CORS errors**: Ensure OPTIONS method is configured for API Gateway
2. **Database connection**: Verify DATABASE_URL is correct
3. **Email not sending**: Check SENDGRID_API_KEY configuration
4. **404 errors**: Ensure S3 bucket has proper website configuration

### Logs

Check Lambda function logs:
```bash
aws logs tail /aws/lambda/baheka-contact-form --follow
```

## Cost Optimization

- Use S3 Standard-IA for static assets
- Configure CloudFront caching
- Set up Lambda provisioned concurrency if needed
- Use RDS Aurora Serverless for database

## Security

- API Gateway has rate limiting enabled
- Lambda functions run with minimal IAM permissions
- S3 bucket allows public read access only
- Database connection uses SSL

## Maintenance

### Updates

1. **Lambda functions**: Update code and redeploy
2. **Frontend**: Run build and sync to S3
3. **Database**: Use migrations for schema changes

### Monitoring

Set up CloudWatch alarms for:
- Lambda function errors
- API Gateway 5xx errors
- High database connections

## Rollback

If deployment fails:
```bash
aws cloudformation delete-stack --stack-name baheka-tech-stack
```

Then redeploy with fixes.