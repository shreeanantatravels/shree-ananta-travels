import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (options: { email: string; subject: string; message: string; html?: string }) => {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key_here') {
    console.warn('RESEND_API_KEY not configured. Email not sent.');
    console.log('Would have sent:', options);
    return;
  }

  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // Default testing email for Resend
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    });
    
    console.log('Message sent successfully:', data);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};
