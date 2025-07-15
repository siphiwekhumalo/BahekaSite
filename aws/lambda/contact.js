// AWS Lambda function for contact form submission
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import sgMail from '@sendgrid/mail';
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

const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).pick({
  firstName: true,
  lastName: true,
  email: true,
  service: true,
  message: true,
});

// Initialize database
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema: { contactSubmissions } });

// Initialize SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

async function sendContactFormNotification(submission, recipientEmail, fromEmail = 'noreply@bahekatech.com') {
  if (!SENDGRID_API_KEY) {
    console.warn('SendGrid API key not configured, skipping contact form notification');
    return false;
  }

  const subject = `New Contact Form Submission from ${submission.firstName} ${submission.lastName}`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #166534;">New Contact Form Submission</h2>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #374151;">Contact Details</h3>
        <p><strong>Name:</strong> ${submission.firstName} ${submission.lastName}</p>
        <p><strong>Email:</strong> ${submission.email}</p>
        <p><strong>Service:</strong> ${submission.service}</p>
        <p><strong>Submitted:</strong> ${new Date(submission.createdAt).toLocaleDateString()}</p>
      </div>
      
      <div style="background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
        <h3 style="margin-top: 0; color: #374151;">Message</h3>
        <p style="line-height: 1.6; color: #6b7280;">${submission.message}</p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 14px;">
          This notification was sent from the Baheka Tech contact form.
        </p>
      </div>
    </div>
  `;

  try {
    await sgMail.send({
      to: recipientEmail,
      from: fromEmail,
      subject,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    // Parse request body
    const requestBody = JSON.parse(event.body);
    
    // Validate the request body using the schema
    const validatedData = insertContactSubmissionSchema.parse(requestBody);
    
    // Create the contact submission
    const [submission] = await db
      .insert(contactSubmissions)
      .values(validatedData)
      .returning();
    
    // Send email notification
    const recipientEmail = process.env.BAHEKA_EMAIL || "contact@bahekatech.com";
    const emailSent = await sendContactFormNotification(submission, recipientEmail);
    
    if (!emailSent) {
      console.warn("Failed to send email notification for contact form submission");
    }
    
    console.log("New contact submission received:", {
      id: submission.id,
      email: submission.email,
      service: submission.service,
      name: `${submission.firstName} ${submission.lastName}`,
      emailSent
    });
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: "Contact submission received successfully",
        id: submission.id 
      }),
    };
  } catch (error) {
    console.error("Error processing contact submission:", error);
    
    if (error instanceof z.ZodError) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: "Validation error", 
          errors: error.errors 
        }),
      };
    }
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: "Internal server error" 
      }),
    };
  }
};