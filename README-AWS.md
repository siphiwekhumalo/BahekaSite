# AWS Lambda and S3 Integration

This document outlines the AWS Lambda and S3 setup for the Baheka Tech website, providing serverless functionality while maintaining the existing UI/UX design.

## Architecture Overview

The AWS integration provides:
- **Lambda Functions**: Serverless API endpoints for contact forms and file uploads
- **S3 Storage**: Secure file storage with presigned URLs
- **API Gateway**: RESTful API management
- **Automatic Image Processing**: Resize and optimize uploaded images

## Setup Instructions

### Prerequisites

1. AWS CLI installed and configured
2. Serverless Framework installed globally
3. AWS credentials with appropriate permissions

### Installation

```bash
# Install required packages (already done)
npm install @aws-sdk/client-s3 @aws-sdk/client-lambda @aws-sdk/s3-request-presigner
npm install serverless serverless-esbuild serverless-offline

# Set up AWS credentials
aws configure
```

### Environment Variables

Create a `.env` file with:

```env
# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
STAGE=dev

# Frontend Lambda Integration (Optional)
VITE_USE_LAMBDA=true
VITE_API_GATEWAY_URL=https://your-api-gateway-url.amazonaws.com/dev
VITE_S3_BUCKET=baheka-tech-dev-assets
VITE_S3_REGION=us-east-1
```

### Deployment

```bash
# Deploy to AWS
serverless deploy

# Deploy to production
serverless deploy --stage prod

# Run locally for testing
serverless offline
```

## Lambda Functions

### 1. Contact Form Handler (`lambda/contact.ts`)
- Handles contact form submissions
- Validates input using Zod schemas
- Stores submissions in database
- Sends email notifications

**Endpoint**: `POST /api/contact`

### 2. File Upload Handler (`lambda/upload.ts`)
- Generates presigned URLs for S3 uploads
- Validates file types and sizes
- Handles secure file uploads

**Endpoint**: `POST /api/upload`

### 3. API Gateway Handler (`lambda/api.ts`)
- Unified API handler for all endpoints
- Routes requests to appropriate functions
- Handles CORS and authentication

**Endpoint**: `ANY /api/{proxy+}`

### 4. Image Processor (`lambda/resize.ts`)
- Automatically processes uploaded images
- Creates multiple image sizes (thumb, medium, large)
- Optimizes images for web delivery

**Triggered by**: S3 object creation events

## S3 Configuration

### Bucket Structure
```
baheka-tech-{stage}-assets/
├── uploads/           # Original uploaded files
├── processed/         # Processed/resized images
├── static/           # Static website assets
└── backups/          # Backup files
```

### CORS Configuration
The S3 bucket is configured to allow:
- Cross-origin requests from your domain
- GET, PUT, POST, DELETE methods
- All necessary headers

## Express.js Integration

### AWS Services Module (`server/aws-services.ts`)
- S3Service class for file operations
- LambdaService class for function invocation
- Utility functions for AWS integration

### AWS Routes (`server/routes-aws.ts`)
- Express.js routes that use AWS services
- Fallback to local processing when AWS is unavailable
- Hybrid deployment support

## Frontend Integration

### AWS Configuration (`client/src/lib/aws-config.ts`)
- Environment-based endpoint resolution
- Switches between Lambda and Express endpoints
- File upload validation and utilities

### File Upload Hook (`client/src/hooks/use-file-upload.tsx`)
- React hook for file uploads
- Progress tracking and error handling
- Automatic retry and validation

### Contact Form Updates
The contact form automatically uses Lambda endpoints when configured:
- No UI changes required
- Seamless fallback to Express.js
- Same validation and error handling

## Development Workflow

### Local Development
```bash
# Start Express server (default)
npm run dev

# Start serverless offline (Lambda simulation)
npm run aws:local

# Both servers can run simultaneously
```

### Testing
```bash
# Test contact form
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","service":"Web Development","message":"Test message"}'

# Test file upload
curl -X POST http://localhost:3001/api/upload \
  -H "Content-Type: application/json" \
  -d '{"fileName":"test.jpg","fileType":"image/jpeg","fileSize":1024000}'
```

## Deployment Options

### Option 1: Express.js Only (Current)
- Traditional server deployment
- No AWS dependencies
- Suitable for shared hosting

### Option 2: Hybrid Deployment
- Express.js server with AWS services
- Optional Lambda functions
- Best of both worlds

### Option 3: Full Serverless
- Pure Lambda functions
- Static hosting for frontend
- Maximum scalability

## Cost Optimization

### Lambda
- Free tier: 1M requests/month
- Pay-per-request pricing
- Automatic scaling

### S3
- Free tier: 5GB storage
- Pay-per-GB pricing
- CDN integration available

### API Gateway
- Free tier: 1M requests/month
- Pay-per-request pricing
- Caching available

## Security

### IAM Permissions
Lambda functions have minimal permissions:
- S3 bucket access only
- No admin privileges
- Resource-specific access

### File Upload Security
- File type validation
- Size limits enforced
- Virus scanning (optional)
- Signed URLs for uploads

### API Security
- CORS configuration
- Rate limiting
- Input validation
- Error handling

## Monitoring

### CloudWatch Logs
- All Lambda functions log to CloudWatch
- Error tracking and debugging
- Performance monitoring

### Metrics
- Request counts
- Error rates
- Response times
- Storage usage

## Troubleshooting

### Common Issues

1. **Lambda timeout**: Increase timeout in `serverless.yml`
2. **S3 permissions**: Check IAM roles and bucket policies
3. **CORS errors**: Verify CORS configuration
4. **Large files**: Increase Lambda memory or use direct S3 upload

### Debug Mode
Enable debug logging by setting:
```env
DEBUG=true
LOG_LEVEL=debug
```

## Migration Path

To migrate from Express.js to Lambda:

1. Deploy Lambda functions alongside Express.js
2. Update frontend environment variables
3. Test both endpoints
4. Gradually migrate traffic
5. Decommission Express.js endpoints

## Future Enhancements

- Image optimization with Sharp
- CDN integration
- Database connection pooling
- Advanced monitoring
- Custom domains
- SSL certificates

This setup provides a robust, scalable solution that maintains your existing UI/UX while adding powerful serverless capabilities.