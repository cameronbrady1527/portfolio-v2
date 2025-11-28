// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

// Base schema that all forms share
const baseContactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"), 
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  formVariant: z.enum(['tutoring', 'portfolio', 'general']).default('general'),
});

// Variant-specific schemas
const tutoringSchema = baseContactSchema.extend({
  subject: z.string().min(1, "Subject is required"),
});

const portfolioSchema = baseContactSchema.extend({
  projectType: z.string().min(1, "Project type is required"),
  budget: z.string().optional(),
});

const generalSchema = baseContactSchema; // No additional fields

// Dynamic validation based on form variant
const validateFormData = (data: any) => {
  switch (data.formVariant) {
    case 'tutoring':
      return tutoringSchema.parse(data);
    case 'portfolio':
      return portfolioSchema.parse(data);
    case 'general':
    default:
      return generalSchema.parse(data);
  }
};

// Generate email content based on variant
const generateEmailContent = (data: any) => {
  const { firstName, lastName, email, phone, message, formVariant } = data;

  let subjectLine = '';
  let specialFields = '';
  let responseContext = '';

  switch (formVariant) {
    case 'tutoring':
      subjectLine = `New Tutoring Inquiry: ${data.subject}`;
      specialFields = `<p><strong>Subject(s):</strong> ${data.subject}</p>`;
      responseContext = 'tutoring inquiry';
      break;
    
    case 'portfolio':
      subjectLine = `New Project Inquiry: ${data.projectType}`;
      specialFields = `
        <p><strong>Project Type:</strong> ${data.projectType}</p>
        ${data.budget ? `<p><strong>Budget:</strong> ${data.budget}</p>` : ''}
      `;
      responseContext = 'project inquiry';
      break;
    
    case 'general':
    default:
      subjectLine = `New Contact Form Submission from ${firstName} ${lastName}`;
      specialFields = '';
      responseContext = 'message';
      break;
  }

  const tutorEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">${subjectLine}</h2>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #374151;">Contact Information</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        ${specialFields}
      </div>

      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px;">
        <h3 style="margin-top: 0; color: #374151;">Message</h3>
        <p style="white-space: pre-line;">${message}</p>
      </div>

      <div style="margin-top: 20px; padding: 15px; background-color: #ecfdf5; border-radius: 8px;">
        <p style="margin: 0; font-size: 14px; color: #059669;">
          <strong>Form Type:</strong> ${formVariant} | 
          <strong>Quick Actions:</strong> Reply directly to this email${phone ? ` or call/text ${phone}` : ''} to respond.
        </p>
      </div>
    </div>
  `;

  return { subjectLine, tutorEmailHtml, responseContext };
};

// Generate confirmation email based on variant
const generateConfirmationEmail = (data: any) => {
  const { firstName, formVariant } = data;

  let title = '';
  let description = '';
  let nextSteps = [];
  let details = {};

  switch (formVariant) {
    case 'tutoring':
      title = `Thanks for your tutoring inquiry, ${firstName}!`;
      description = `I've received your inquiry about tutoring for <strong>${data.subject}</strong> and I'll get back to you within 24 hours.`;
      nextSteps = [
        "I'll review your message and learning goals",
        "We'll schedule a brief consultation call",
        "I'll create a personalized learning plan for you",
        "We can start building your confidence right away!"
      ];
      details = {
        "Rate": "$60/hour",
        "Formats": "In-person (Dutchess County) & Virtual", 
        "Availability": "Weekday evenings & flexible weekends"
      };
      break;

    case 'portfolio':
      title = `Thanks for reaching out, ${firstName}!`;
      description = `I've received your inquiry about <strong>${data.projectType}</strong> and I'll get back to you within 24 hours to discuss your project.`;
      nextSteps = [
        "I'll review your project requirements",
        "We'll schedule a consultation call", 
        "I'll provide a detailed proposal and timeline",
        "We can start bringing your vision to life!"
      ];
      details = {
        "Services": "Web Development, Mobile Apps, Data Analysis",
        "Process": "Consultation → Proposal → Development → Launch",
        "Timeline": "Varies by project scope"
      };
      break;

    case 'general':
    default:
      title = `Thanks for reaching out, ${firstName}!`;
      description = `I've received your message and I'll get back to you within 24 hours.`;
      nextSteps = [
        "I'll review your message",
        "I'll respond with any information you need",
        "We can discuss next steps if applicable"
      ];
      details = {};
      break;
  }

  const confirmationHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">${title}</h2>
      
      <p>${description}</p>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #374151;">What happens next?</h3>
        <ul style="color: #6b7280;">
          ${nextSteps.map(step => `<li>${step}</li>`).join('')}
        </ul>
      </div>

      ${Object.keys(details).length > 0 ? `
        <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #374151;">Quick Details</h3>
          ${Object.entries(details).map(([key, value]) => 
            `<p style="margin: 5px 0;"><strong>${key}:</strong> ${value}</p>`
          ).join('')}
        </div>
      ` : ''}

      <p style="margin-top: 30px;">
        Looking forward to ${formVariant === 'tutoring' ? 'helping you succeed' : 'working together'}!<br>
        <strong>Cameron Brady</strong><br>
        <a href="mailto:cameronbrady1527@gmail.com">your-email@gmail.com</a><br>
        <a href="https://cameronbrady.dev">cameronbrady.dev</a>
      </p>
    </div>
  `;

  return confirmationHtml;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the form data based on variant
    const validatedData = validateFormData(body);
    
    const { firstName, lastName, email, formVariant } = validatedData;

    // Generate email content
    const { subjectLine, tutorEmailHtml } = generateEmailContent(validatedData);

    // Send email to you (the recipient)
    const { data: tutorEmail, error: tutorError } = await resend.emails.send({
      from: `${formVariant === 'tutoring' ? 'Tutoring' : formVariant === 'portfolio' ? 'Portfolio' : 'Contact'} Inquiry <noreply@cameronbrady.dev>`,
      to: ['cameronbrady1527@gmail.com'],
      subject: subjectLine,
      html: tutorEmailHtml,
    });

    if (tutorError) {
      console.error('Error sending notification email:', tutorError);
      return NextResponse.json(
        { error: 'Failed to send inquiry' },
        { status: 500 }
      );
    }

    // Send confirmation email to the sender
    const confirmationHtml = generateConfirmationEmail(validatedData);
    
    const { data: confirmationEmail, error: confirmationError } = await resend.emails.send({
      from: 'Cameron Brady <noreply@cameronbrady.dev>',
      to: [email],
      subject: formVariant === 'tutoring' ? 'Thanks for your tutoring inquiry!' : 
               formVariant === 'portfolio' ? 'Thanks for your project inquiry!' : 
               'Thanks for reaching out!',
      html: confirmationHtml,
    });

    if (confirmationError) {
      console.error('Error sending confirmation email:', confirmationError);
      // Don't fail the request if confirmation fails
    }

    return NextResponse.json(
      { 
        message: 'Message sent successfully!',
        variant: formVariant 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}