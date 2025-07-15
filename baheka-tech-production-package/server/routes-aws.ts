import { Express } from "express";
import { S3Service, LambdaService, awsUtils } from "./aws-services";
import { storage } from "./storage";
import { sendContactFormNotification } from "./email";
import { insertContactSubmissionSchema } from "../shared/schema";
import { fromZodError } from "zod-validation-error";

export function registerAwsRoutes(app: Express) {
  // File upload endpoint with S3 integration
  app.post("/api/upload", async (req, res) => {
    try {
      const { fileName, fileType, fileSize, folder = 'uploads' } = req.body;

      if (!fileName || !fileType) {
        return res.status(400).json({ 
          message: 'fileName and fileType are required' 
        });
      }

      // Check if AWS is configured
      if (!awsUtils.isAwsConfigured()) {
        return res.status(503).json({ 
          message: 'AWS S3 not configured' 
        });
      }

      // Validate file type
      if (!awsUtils.validateFileType(fileName)) {
        return res.status(400).json({ 
          message: 'Invalid file type' 
        });
      }

      // Generate presigned URL
      const result = await S3Service.generatePresignedUrl(fileName, fileType, folder);
      
      res.json({
        message: 'Presigned URL generated successfully',
        ...result,
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({ 
        message: 'Internal Server Error', 
        error: error.message 
      });
    }
  });

  // Lambda contact form endpoint
  app.post("/api/contact/lambda", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      
      // Check if Lambda is configured
      if (!awsUtils.isAwsConfigured()) {
        // Fall back to local processing
        const submission = await storage.createContactSubmission(validatedData);
        
        // Send email notification
        if (process.env.SENDGRID_API_KEY) {
          sendContactFormNotification(
            submission,
            'contact@bahekatech.com'
          ).catch(console.error);
        }

        return res.json({
          message: 'Contact form submitted successfully (local)',
          id: submission.id,
        });
      }

      // Use Lambda function
      const result = await LambdaService.invokeContactForm(validatedData);
      
      res.json({
        message: 'Contact form submitted successfully (Lambda)',
        ...result,
      });

    } catch (error: any) {
      console.error('Contact form error:', error);
      
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({
          message: 'Validation error',
          error: validationError.toString(),
        });
      }

      res.status(500).json({
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  });

  // S3 file management endpoints
  app.delete("/api/s3/file/:key", async (req, res) => {
    try {
      const { key } = req.params;
      
      if (!awsUtils.isAwsConfigured()) {
        return res.status(503).json({ 
          message: 'AWS S3 not configured' 
        });
      }

      await S3Service.deleteFile(key);
      
      res.json({ 
        message: 'File deleted successfully' 
      });

    } catch (error: any) {
      console.error('Delete error:', error);
      res.status(500).json({ 
        message: 'Internal Server Error', 
        error: error.message 
      });
    }
  });

  // AWS configuration status endpoint
  app.get("/api/aws/status", async (req, res) => {
    try {
      const isConfigured = awsUtils.isAwsConfigured();
      const config = awsUtils.getAwsConfig();
      
      res.json({
        configured: isConfigured,
        config: isConfigured ? config : null,
      });

    } catch (error: any) {
      console.error('AWS status error:', error);
      res.status(500).json({ 
        message: 'Internal Server Error', 
        error: error.message 
      });
    }
  });
}