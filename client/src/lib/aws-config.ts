// AWS Configuration for client-side usage
export const awsConfig = {
  // Check if we should use Lambda endpoints
  useLambda: import.meta.env.VITE_USE_LAMBDA === 'true',
  
  // API Gateway URL (if using Lambda)
  apiGatewayUrl: import.meta.env.VITE_API_GATEWAY_URL || '',
  
  // S3 bucket configuration
  s3Bucket: import.meta.env.VITE_S3_BUCKET || '',
  s3Region: import.meta.env.VITE_S3_REGION || 'us-east-1',
  
  // Lambda function names
  lambdaFunctions: {
    contact: import.meta.env.VITE_LAMBDA_CONTACT || 'baheka-tech-website-dev-contactForm',
    upload: import.meta.env.VITE_LAMBDA_UPLOAD || 'baheka-tech-website-dev-fileUpload',
    api: import.meta.env.VITE_LAMBDA_API || 'baheka-tech-website-dev-api',
  },
};

// API endpoint resolver
export const getApiEndpoint = (path: string): string => {
  if (awsConfig.useLambda && awsConfig.apiGatewayUrl) {
    return `${awsConfig.apiGatewayUrl}${path}`;
  }
  
  // Fall back to current Express server
  return `/api${path}`;
};

// File upload configuration
export const uploadConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
};

// Utility functions
export const awsClientUtils = {
  // Generate S3 URL
  generateS3Url(key: string): string {
    return `https://${awsConfig.s3Bucket}.s3.${awsConfig.s3Region}.amazonaws.com/${key}`;
  },

  // Validate file before upload
  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > uploadConfig.maxFileSize) {
      return {
        valid: false,
        error: `File size exceeds ${uploadConfig.maxFileSize / (1024 * 1024)}MB limit`,
      };
    }

    // Check file type
    if (!uploadConfig.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type not allowed. Allowed types: ${uploadConfig.allowedTypes.join(', ')}`,
      };
    }

    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !uploadConfig.allowedExtensions.includes(extension)) {
      return {
        valid: false,
        error: `File extension not allowed. Allowed extensions: ${uploadConfig.allowedExtensions.join(', ')}`,
      };
    }

    return { valid: true };
  },

  // Format file size for display
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Generate unique file name
  generateFileName(originalName: string): string {
    const extension = originalName.split('.').pop();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${random}.${extension}`;
  },
};