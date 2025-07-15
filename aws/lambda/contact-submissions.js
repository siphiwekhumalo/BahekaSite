// AWS Lambda function for managing contact submissions
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

// Database schema
const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  service: text("service").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").default("pending").notNull(),
});

// Initialize database
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema: { contactSubmissions } });

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      },
      body: '',
    };
  }

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    // GET /api/contact/submissions - Get all submissions
    if (event.httpMethod === 'GET' && !event.pathParameters?.id) {
      const submissions = await db.select().from(contactSubmissions);
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(submissions),
      };
    }

    // GET /api/contact/submissions/:id - Get specific submission
    if (event.httpMethod === 'GET' && event.pathParameters?.id) {
      const id = parseInt(event.pathParameters.id);
      if (isNaN(id)) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ message: "Invalid submission ID" }),
        };
      }

      const [submission] = await db.select().from(contactSubmissions).where(eq(contactSubmissions.id, id));
      
      if (!submission) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ message: "Submission not found" }),
        };
      }

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(submission),
      };
    }

    // PUT /api/contact/submissions/:id/status - Update submission status
    if (event.httpMethod === 'PUT' && event.pathParameters?.id && event.path?.includes('/status')) {
      const id = parseInt(event.pathParameters.id);
      if (isNaN(id)) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ message: "Invalid submission ID" }),
        };
      }

      const { status } = JSON.parse(event.body);
      if (!status) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ message: "Status is required" }),
        };
      }

      const [updated] = await db
        .update(contactSubmissions)
        .set({ status })
        .where(eq(contactSubmissions.id, id))
        .returning();

      if (!updated) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ message: "Submission not found" }),
        };
      }

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(updated),
      };
    }

    // Method not allowed
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  } catch (error) {
    console.error("Error processing request:", error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        message: "Internal server error" 
      }),
    };
  }
};