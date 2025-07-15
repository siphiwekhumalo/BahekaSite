const sgMail = require('@sendgrid/mail');

// Configure SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const BAHEKA_EMAIL = process.env.BAHEKA_EMAIL || 'contact@bahekatechfirm.com';

async function sendEmail(params) {
  const { to, from, subject, text, html } = params;
  
  // If no SendGrid API key, log and return success (for development)
  if (!process.env.SENDGRID_API_KEY) {
    console.log('📧 Email would be sent:', { to, from, subject, text: text?.substring(0, 100) });
    return true;
  }
  
  try {
    const msg = {
      to,
      from,
      subject,
      text,
      html,
    };
    
    await sgMail.send(msg);
    console.log('📧 Email sent successfully to:', to);
    return true;
  } catch (error) {
    console.error('📧 Email sending failed:', error);
    return false;
  }
}

async function sendContactFormNotification(submission) {
  const { firstName, lastName, email, service, message, createdAt } = submission;
  
  const subject = `New Contact Form Submission - ${service}`;
  
  const text = `
New contact form submission received:

Name: ${firstName} ${lastName}
Email: ${email}
Service: ${service}
Message: ${message}

Submitted: ${new Date(createdAt).toLocaleString()}

Please respond promptly to maintain excellent customer service.
`;

  const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
    New Contact Form Submission
  </h2>
  
  <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
    <h3 style="color: #007bff; margin-top: 0;">Contact Details</h3>
    <p><strong>Name:</strong> ${firstName} ${lastName}</p>
    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
    <p><strong>Service Interested:</strong> ${service}</p>
    <p><strong>Submitted:</strong> ${new Date(createdAt).toLocaleString()}</p>
  </div>
  
  <div style="background: #fff; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0;">
    <h3 style="color: #333; margin-top: 0;">Message</h3>
    <p style="white-space: pre-wrap;">${message}</p>
  </div>
  
  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
    <p style="color: #666; font-size: 14px;">
      This email was automatically generated from the Baheka Tech contact form.
    </p>
  </div>
</div>
`;

  return await sendEmail({
    to: BAHEKA_EMAIL,
    from: BAHEKA_EMAIL,
    subject,
    text,
    html,
  });
}

const handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

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
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body);
    
    // Validate required fields
    const { firstName, lastName, email, service, message } = body;
    
    if (!firstName || !lastName || !email || !service || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'All fields are required' }),
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email format' }),
      };
    }

    // Create contact submission object
    const contactSubmission = {
      firstName,
      lastName,
      email,
      service,
      message,
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    // Send email notification
    try {
      await sendContactFormNotification(contactSubmission);
      console.log('Email notification sent successfully');
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue processing even if email fails
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Contact form submitted successfully',
        id: Date.now() // Simple ID generation for tracking
      }),
    };

  } catch (error) {
    console.error('Contact form error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to process contact form submission'
      }),
    };
  }
};

module.exports = { handler };