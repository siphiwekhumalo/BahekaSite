#!/bin/bash

# AWS deployment script for Baheka Tech

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting AWS deployment for Baheka Tech${NC}"

# Configuration
STACK_NAME="baheka-tech-stack"
REGION="us-east-1"
S3_BUCKET="bahekatechfirm.com"
CLOUDFRONT_DISTRIBUTION_ID=""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

# Function to deploy Lambda functions
deploy_lambda() {
    echo -e "${YELLOW}📦 Preparing Lambda deployment packages...${NC}"
    
    # Create deployment packages
    cd aws/lambda
    
    # Install dependencies
    npm install
    
    # Create zip files for Lambda functions
    zip -r contact.zip contact.js package.json node_modules/
    zip -r contact-submissions.zip contact-submissions.js package.json node_modules/
    
    echo -e "${GREEN}✅ Lambda packages created${NC}"
    cd ../..
}

# Function to deploy API Gateway and Lambda functions
deploy_api() {
    echo -e "${YELLOW}🔧 Deploying API Gateway and Lambda functions...${NC}"
    
    # Deploy CloudFormation stack
    aws cloudformation deploy \
        --template-file aws/cloudformation/api-gateway.yml \
        --stack-name $STACK_NAME \
        --capabilities CAPABILITY_IAM \
        --parameter-overrides \
            DatabaseUrl="$DATABASE_URL" \
            SendGridApiKey="$SENDGRID_API_KEY" \
            BahekaEmail="$BAHEKA_EMAIL" \
        --region $REGION
    
    # Update Lambda function code
    aws lambda update-function-code \
        --function-name baheka-contact-form \
        --zip-file fileb://aws/lambda/contact.zip \
        --region $REGION
    
    aws lambda update-function-code \
        --function-name baheka-contact-submissions \
        --zip-file fileb://aws/lambda/contact-submissions.zip \
        --region $REGION
    
    # Get API Gateway URL
    API_URL=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayUrl`].OutputValue' \
        --output text \
        --region $REGION)
    
    echo -e "${GREEN}✅ API Gateway deployed at: $API_URL${NC}"
    
    # Save API URL for frontend build
    echo "VITE_API_URL=$API_URL" > .env.production
}

# Function to build and deploy frontend
deploy_frontend() {
    echo -e "${YELLOW}🏗️ Building frontend for production...${NC}"
    
    # Build the frontend
    npm run build
    
    echo -e "${YELLOW}📤 Deploying to S3...${NC}"
    
    # Create S3 bucket if it doesn't exist
    if ! aws s3api head-bucket --bucket $S3_BUCKET 2>/dev/null; then
        aws s3api create-bucket --bucket $S3_BUCKET --region $REGION
        
        # Configure bucket for static website hosting
        aws s3api put-bucket-website \
            --bucket $S3_BUCKET \
            --website-configuration '{
                "IndexDocument": {"Suffix": "index.html"},
                "ErrorDocument": {"Key": "index.html"}
            }'
        
        # Make bucket public
        aws s3api put-bucket-policy \
            --bucket $S3_BUCKET \
            --policy '{
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Sid": "PublicRead",
                        "Effect": "Allow",
                        "Principal": "*",
                        "Action": "s3:GetObject",
                        "Resource": "arn:aws:s3:::'"$S3_BUCKET"'/*"
                    }
                ]
            }'
    fi
    
    # Sync files to S3
    aws s3 sync dist/public/ s3://$S3_BUCKET --delete
    
    echo -e "${GREEN}✅ Frontend deployed to S3${NC}"
    echo -e "${GREEN}🌐 Website URL: http://$S3_BUCKET.s3-website-$REGION.amazonaws.com${NC}"
}

# Function to deploy CloudFront (optional)
deploy_cloudfront() {
    echo -e "${YELLOW}🌍 Setting up CloudFront distribution...${NC}"
    
    # This is a placeholder for CloudFront setup
    # You would need to create a CloudFormation template for CloudFront
    echo -e "${YELLOW}⚠️ CloudFront setup not implemented in this script${NC}"
    echo -e "${YELLOW}Please set up CloudFront manually for HTTPS support${NC}"
}

# Function to setup Route 53 (optional)
setup_route53() {
    echo -e "${YELLOW}🔗 Route 53 setup...${NC}"
    
    echo -e "${YELLOW}⚠️ Route 53 setup not implemented in this script${NC}"
    echo -e "${YELLOW}Please configure Route 53 manually:${NC}"
    echo -e "${YELLOW}1. Go to Route 53 → Hosted zones → bahekatechfirm.com${NC}"
    echo -e "${YELLOW}2. Create A record pointing to S3 website endpoint${NC}"
}

# Main deployment function
main() {
    echo -e "${GREEN}Starting deployment process...${NC}"
    
    # Check required environment variables
    if [ -z "$DATABASE_URL" ]; then
        echo -e "${RED}❌ DATABASE_URL environment variable is required${NC}"
        exit 1
    fi
    
    # Optional environment variables
    if [ -z "$SENDGRID_API_KEY" ]; then
        echo -e "${YELLOW}⚠️ SENDGRID_API_KEY not set - email notifications will be disabled${NC}"
    fi
    
    if [ -z "$BAHEKA_EMAIL" ]; then
        echo -e "${YELLOW}⚠️ BAHEKA_EMAIL not set - using default contact@bahekatech.com${NC}"
        export BAHEKA_EMAIL="contact@bahekatech.com"
    fi
    
    # Deploy components
    deploy_lambda
    deploy_api
    deploy_frontend
    
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo -e "${GREEN}📋 Summary:${NC}"
    echo -e "${GREEN}  - API Gateway: $API_URL${NC}"
    echo -e "${GREEN}  - Frontend: http://$S3_BUCKET.s3-website-$REGION.amazonaws.com${NC}"
    echo -e "${GREEN}  - Database: Connected to provided DATABASE_URL${NC}"
    
    echo -e "${YELLOW}📝 Next steps:${NC}"
    echo -e "${YELLOW}  1. Set up CloudFront for HTTPS${NC}"
    echo -e "${YELLOW}  2. Configure Route 53 for custom domain${NC}"
    echo -e "${YELLOW}  3. Test the contact form${NC}"
}

# Run main function
main "$@"