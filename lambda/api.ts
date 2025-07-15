import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { storage } from '../server/storage';
import { sendContactFormNotification } from '../server/email';
import { insertContactSubmissionSchema } from '../shared/schema';
import { fromZodError } from 'zod-validation-error';

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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

  try {
    const path = event.path;
    const method = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : {};

    console.log(`${method} ${path}`, body);

    // Contact form submission
    if (path === '/api/contact' && method === 'POST') {
      try {
        const validatedData = insertContactSubmissionSchema.parse(body);
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
    }

    // Get all contact submissions
    if (path === '/api/contact/submissions' && method === 'GET') {
      const submissions = await storage.getContactSubmissions();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(submissions),
      };
    }

    // Get specific contact submission
    if (path.startsWith('/api/contact/submissions/') && method === 'GET') {
      const id = parseInt(path.split('/').pop() || '');
      if (isNaN(id)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Invalid submission ID' }),
        };
      }

      const submission = await storage.getContactSubmission(id);
      if (!submission) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Submission not found' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(submission),
      };
    }

    // Update contact submission status
    if (path.includes('/status') && method === 'PUT') {
      const pathParts = path.split('/');
      const id = parseInt(pathParts[pathParts.length - 2]);
      
      if (isNaN(id)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Invalid submission ID' }),
        };
      }

      const { status } = body;
      if (!status) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Status is required' }),
        };
      }

      const updatedSubmission = await storage.updateContactSubmissionStatus(id, status);
      if (!updatedSubmission) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Submission not found' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(updatedSubmission),
      };
    }

    // Default 404 response
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: 'Not Found' }),
    };

  } catch (error: any) {
    console.error('Lambda error:', error);
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