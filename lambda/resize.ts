import { S3Event, S3Handler } from 'aws-lambda';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
});

// Image processing function (simplified - you can integrate with Sharp library for advanced processing)
const processImage = async (buffer: Buffer, format: string): Promise<Buffer> => {
  // For now, return the original buffer
  // In a real implementation, you would use libraries like Sharp to resize/optimize
  return buffer;
};

export const handler: S3Handler = async (event: S3Event) => {
  console.log('S3 event received:', JSON.stringify(event, null, 2));

  try {
    for (const record of event.Records) {
      const bucket = record.s3.bucket.name;
      const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
      
      console.log(`Processing object: ${key} from bucket: ${bucket}`);

      // Skip if not an image or already processed
      if (!key.match(/\.(jpg|jpeg|png)$/i) || key.includes('processed/')) {
        console.log(`Skipping non-image or already processed file: ${key}`);
        continue;
      }

      // Get the original object
      const getObjectCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      const response = await s3Client.send(getObjectCommand);
      
      if (!response.Body) {
        console.error(`No body found for object: ${key}`);
        continue;
      }

      // Convert stream to buffer
      const stream = response.Body as Readable;
      const chunks: Buffer[] = [];
      
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      
      const buffer = Buffer.concat(chunks);
      
      // Process the image (resize, optimize, etc.)
      const processedBuffer = await processImage(buffer, response.ContentType || 'image/jpeg');
      
      // Create processed versions
      const sizes = [
        { suffix: 'thumb', width: 150, height: 150 },
        { suffix: 'medium', width: 500, height: 500 },
        { suffix: 'large', width: 1200, height: 1200 },
      ];

      for (const size of sizes) {
        const processedKey = key.replace(/^uploads\//, 'processed/').replace(/\.(jpg|jpeg|png)$/i, `_${size.suffix}.$1`);
        
        // In a real implementation, you would resize the image here
        // For now, we'll just copy the original
        const putObjectCommand = new PutObjectCommand({
          Bucket: bucket,
          Key: processedKey,
          Body: processedBuffer,
          ContentType: response.ContentType,
          Metadata: {
            'original-key': key,
            'processed-size': size.suffix,
            'processed-timestamp': new Date().toISOString(),
          },
        });

        await s3Client.send(putObjectCommand);
        console.log(`Created processed image: ${processedKey}`);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Images processed successfully' }),
    };

  } catch (error) {
    console.error('Error processing images:', error);
    throw error;
  }
};