import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { storage } from '../server/storage';
import { sendContactFormNotification } from '../server/email';
import { insertContactSubmissionSchema } from '../shared/schema';
import { fromZodError } from 'zod-validation-error';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    console.log('Contact form submission:', body);

    // Validate request body
    const validatedData = insertContactSubmissionSchema.parse(body);
    
    // Store submission
    const submission = await storage.createContactSubmission(validatedData);

    // Send email notification (non-blocking)
    if (process.env.SENDGRID_API_KEY) {
      sendContactFormNotification(
        submission,
        'contact@bahekatech.com'
      ).catch(console.error);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Contact form submitted successfully',
        id: submission.id,
      }),
    };

  } catch (error: any) {
    console.error('Contact form error:', error);
    
    // Handle validation errors
    if (error.name === 'ZodError') {
      const validationError = fromZodError(error);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: 'Validation error',
          error: validationError.toString(),
        }),
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Internal Server Error',
        error: error.message,
      }),
    };
  }
};