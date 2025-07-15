import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

// Initialize AWS clients
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
});

const lambdaClient = new LambdaClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

const BUCKET_NAME = `baheka-tech-${process.env.STAGE || 'dev'}-assets`;

// S3 Service Functions
export class S3Service {
  static async uploadFile(file: Buffer, fileName: string, contentType: string, folder: string = 'uploads'): Promise<string> {
    const key = `${folder}/${randomUUID()}-${fileName}`;
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
    });

    await s3Client.send(command);
    return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
  }

  static async generatePresignedUrl(fileName: string, contentType: string, folder: string = 'uploads'): Promise<{
    uploadUrl: string;
    publicUrl: string;
    key: string;
  }> {
    const key = `${folder}/${randomUUID()}-${fileName}`;
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300, // 5 minutes
    });

    const publicUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;

    return {
      uploadUrl,
      publicUrl,
      key,
    };
  }

  static async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  }

  static async getFile(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);
    
    if (!response.Body) {
      throw new Error('File not found');
    }

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    const stream = response.Body as any;
    
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    
    return Buffer.concat(chunks);
  }
}

// Lambda Service Functions
export class LambdaService {
  static async invokeFunction(functionName: string, payload: any): Promise<any> {
    const command = new InvokeCommand({
      FunctionName: functionName,
      Payload: JSON.stringify(payload),
    });

    const response = await lambdaClient.send(command);
    
    if (!response.Payload) {
      throw new Error('No response from Lambda function');
    }

    const result = JSON.parse(new TextDecoder().decode(response.Payload));
    return result;
  }

  static async invokeContactForm(formData: any): Promise<any> {
    return this.invokeFunction('baheka-tech-website-dev-contactForm', formData);
  }

  static async invokeImageUpload(uploadData: any): Promise<any> {
    return this.invokeFunction('baheka-tech-website-dev-fileUpload', uploadData);
  }
}

// Utility functions for AWS integration
export const awsUtils = {
  // Check if AWS is configured
  isAwsConfigured(): boolean {
    return !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
  },

  // Get AWS environment variables
  getAwsConfig() {
    return {
      region: process.env.AWS_REGION || 'us-east-1',
      stage: process.env.STAGE || 'dev',
      bucketName: BUCKET_NAME,
    };
  },

  // Generate S3 public URL
  generateS3Url(key: string): string {
    return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
  },

  // Validate file type for uploads
  validateFileType(fileName: string, allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif']): boolean {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const mimeTypeMap: { [key: string]: string } = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
    };

    const mimeType = mimeTypeMap[extension || ''];
    return allowedTypes.includes(mimeType);
  },

  // Generate unique file name
  generateUniqueFileName(originalName: string): string {
    const extension = originalName.split('.').pop();
    return `${randomUUID()}.${extension}`;
  },
};