#!/bin/bash

# AWS Lambda and S3 Deployment Script for Baheka Tech Website

set -e

echo "🚀 Starting AWS deployment for Baheka Tech website..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if Serverless Framework is installed
if ! command -v serverless &> /dev/null; then
    echo "❌ Serverless Framework is not installed. Installing now..."
    npm install -g serverless
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Please run 'aws configure' first."
    exit 1
fi

# Set deployment variables
STAGE=${1:-dev}
REGION=${2:-us-east-1}

echo "📋 Deployment Configuration:"
echo "   Stage: $STAGE"
echo "   Region: $REGION"

# Build the project
echo "🔨 Building project..."
npm run build

# Deploy to AWS
echo "☁️  Deploying to AWS..."
serverless deploy --stage $STAGE --region $REGION

# Get the deployed endpoints
echo "📡 Getting deployment information..."
serverless info --stage $STAGE --region $REGION

echo "✅ Deployment completed successfully!"
echo ""
echo "🔗 Next steps:"
echo "1. Update your frontend environment variables:"
echo "   - VITE_USE_LAMBDA=true"
echo "   - VITE_API_GATEWAY_URL=<your-api-gateway-url>"
echo "   - VITE_S3_BUCKET=baheka-tech-$STAGE-assets"
echo "   - VITE_S3_REGION=$REGION"
echo ""
echo "2. Test your deployed functions:"
echo "   - Contact form: POST to your API Gateway URL/api/contact"
echo "   - File upload: POST to your API Gateway URL/api/upload"
echo ""
echo "3. Monitor your functions in AWS CloudWatch"