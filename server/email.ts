import sgMail from '@sendgrid/mail';
import type { ContactSubmission } from '@shared/schema';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    await sgMail.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export async function sendContactFormNotification(
  submission: ContactSubmission,
  recipientEmail: string,
  fromEmail: string = 'noreply@bahekatech.com'
): Promise<boolean> {
  const subject = `New Contact Form Submission from ${submission.firstName} ${submission.lastName}`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #166534;">New Contact Form Submission</h2>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #374151;">Contact Information</h3>
        <p><strong>Name:</strong> ${submission.firstName} ${submission.lastName}</p>
        <p><strong>Email:</strong> ${submission.email}</p>
        <p><strong>Service Interest:</strong> ${submission.service}</p>
        <p><strong>Submitted:</strong> ${new Date(submission.createdAt).toLocaleString()}</p>
      </div>
      
      <div style="background: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="margin-top: 0; color: #374151;">Message</h3>
        <p style="white-space: pre-wrap;">${submission.message}</p>
      </div>
      
      <div style="margin-top: 20px; padding: 15px; background: #ecfdf5; border-radius: 8px;">
        <p style="margin: 0; color: #065f46; font-size: 14px;">
          This email was automatically generated from your Baheka Tech website contact form.
        </p>
      </div>
    </div>
  `;

  const textContent = `
New Contact Form Submission

Name: ${submission.firstName} ${submission.lastName}
Email: ${submission.email}
Service Interest: ${submission.service}
Submitted: ${new Date(submission.createdAt).toLocaleString()}

Message:
${submission.message}

--
This email was automatically generated from your Baheka Tech website contact form.
  `;

  return await sendEmail({
    to: recipientEmail,
    from: fromEmail,
    subject,
    text: textContent,
    html: htmlContent,
  });
}