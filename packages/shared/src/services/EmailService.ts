import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  type: 'booking_confirmation' | 'quote_sent' | 'project_update' | 'completion_notification' | 'follow_up';
}

interface EmailData {
  to: string | string[];
  templateId: string;
  variables: Record<string, string>;
  attachments?: Array<{
    filename: string;
    path: string;
  }>;
}

class EmailService {
  private transporter: nodemailer.Transporter;
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
    
    // Configure email transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      const template = await this.getTemplate(emailData.templateId);
      if (!template) {
        throw new Error(`Template ${emailData.templateId} not found`);
      }

      const processedSubject = this.processTemplate(template.subject, emailData.variables);
      const processedContent = this.processTemplate(template.content, emailData.variables);

      const mailOptions = {
        from: `"Bowmans Kitchens & Bathrooms" <${process.env.SMTP_FROM || 'noreply@bowmanskb.co.uk'}>`,
        to: Array.isArray(emailData.to) ? emailData.to.join(', ') : emailData.to,
        subject: processedSubject,
        html: this.convertToHtml(processedContent),
        text: processedContent,
        attachments: emailData.attachments || [],
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      // Log the email in database
      await this.logEmail({
        to: mailOptions.to,
        subject: processedSubject,
        templateId: emailData.templateId,
        status: 'sent',
        messageId: result.messageId,
      });

      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      
      // Log failed email
      await this.logEmail({
        to: Array.isArray(emailData.to) ? emailData.to.join(', ') : emailData.to,
        subject: 'Failed to send',
        templateId: emailData.templateId,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      return false;
    }
  }

  async sendBookingConfirmation(customerEmail: string, bookingData: any): Promise<boolean> {
    return this.sendEmail({
      to: customerEmail,
      templateId: 'booking_confirmation',
      variables: {
        customerName: bookingData.customerName,
        date: new Date(bookingData.scheduledDate).toLocaleDateString('en-GB'),
        time: new Date(bookingData.scheduledDate).toLocaleTimeString('en-GB', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        serviceType: bookingData.serviceType,
        address: bookingData.address,
        technicianName: bookingData.technician?.name || 'TBC',
        technicianPhone: bookingData.technician?.phone || '0161 123 4567',
      },
    });
  }

  async sendQuote(customerEmail: string, quoteData: any): Promise<boolean> {
    const attachments = quoteData.pdfPath ? [{
      filename: `Quote_${quoteData.quoteNumber}.pdf`,
      path: quoteData.pdfPath,
    }] : [];

    return this.sendEmail({
      to: customerEmail,
      templateId: 'quote_sent',
      variables: {
        customerName: quoteData.customerName,
        projectTitle: quoteData.projectTitle,
        totalCost: quoteData.totalCost.toLocaleString(),
        validUntil: new Date(quoteData.validUntil).toLocaleDateString('en-GB'),
        projectManagerName: quoteData.projectManager?.name || 'Your Project Manager',
        projectManagerPhone: quoteData.projectManager?.phone || '0161 123 4567',
      },
      attachments,
    });
  }

  async sendProjectUpdate(customerEmail: string, projectData: any): Promise<boolean> {
    return this.sendEmail({
      to: customerEmail,
      templateId: 'project_update',
      variables: {
        customerName: projectData.customerName,
        projectTitle: projectData.title,
        currentPhase: projectData.currentPhase,
        progressPercentage: projectData.progressPercentage.toString(),
        nextPhase: projectData.nextPhase,
        expectedCompletion: new Date(projectData.expectedCompletion).toLocaleDateString('en-GB'),
        recentWork: projectData.recentWork || 'Work is progressing well',
        portalLink: `${process.env.FRONTEND_URL}/portal?token=${projectData.portalToken}`,
        projectManagerName: projectData.projectManager?.name || 'Your Project Manager',
      },
    });
  }

  async sendBulkEmail(recipients: string[], templateId: string, variables: Record<string, string>): Promise<{
    sent: number;
    failed: number;
    errors: string[];
  }> {
    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const email of recipients) {
      try {
        const success = await this.sendEmail({
          to: email,
          templateId,
          variables,
        });

        if (success) {
          results.sent++;
        } else {
          results.failed++;
          results.errors.push(`Failed to send to ${email}`);
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        results.failed++;
        results.errors.push(`Error sending to ${email}: ${error}`);
      }
    }

    return results;
  }

  private async getTemplate(templateId: string): Promise<EmailTemplate | null> {
    // Mock templates for now - in production, these would be stored in database
    const templates: Record<string, EmailTemplate> = {
      booking_confirmation: {
        id: 'booking_confirmation',
        name: 'Booking Confirmation',
        type: 'booking_confirmation',
        subject: 'Your consultation is confirmed - {{customerName}}',
        content: `Hi {{customerName}},

Great news! Your consultation has been confirmed for {{date}} at {{time}}.

Consultation Details:
• Service: {{serviceType}}
• Address: {{address}}
• Our Expert: {{technicianName}}
• Contact: {{technicianPhone}}

What to expect:
• Professional assessment of your requirements
• Detailed quote provided on the spot
• No obligation, completely free service
• Duration: approximately 1 hour

Need to reschedule? Simply reply to this email or call us on 0161 123 4567.

We look forward to meeting you!

Best regards,
The Bowmans Team
www.bowmanskb.co.uk`,
        variables: ['customerName', 'date', 'time', 'serviceType', 'address', 'technicianName', 'technicianPhone'],
      },
      quote_sent: {
        id: 'quote_sent',
        name: 'Quote Sent',
        type: 'quote_sent',
        subject: 'Your quote is ready - {{projectTitle}}',
        content: `Dear {{customerName}},

Thank you for choosing Bowmans Kitchens & Bathrooms for your {{projectTitle}} project.

Your detailed quote is attached to this email. Here's a summary:

Project: {{projectTitle}}
Total Cost: £{{totalCost}}
Valid Until: {{validUntil}}

Quote Highlights:
• All materials and labour included
• 12-month labour warranty
• Professional project management
• Experienced certified installers

Next Steps:
1. Review the detailed quote
2. Contact us with any questions
3. Accept the quote to secure your booking

We're confident you'll love the quality of our work. Check out our recent projects on our website.

Questions? Reply to this email or call {{projectManagerPhone}}.

Best regards,
{{projectManagerName}}
Bowmans Kitchens & Bathrooms`,
        variables: ['customerName', 'projectTitle', 'totalCost', 'validUntil', 'projectManagerName', 'projectManagerPhone'],
      },
      project_update: {
        id: 'project_update',
        name: 'Project Update',
        type: 'project_update',
        subject: 'Progress update - {{projectTitle}}',
        content: `Hi {{customerName}},

Quick update on your {{projectTitle}} project:

Current Status: {{currentPhase}}
Progress: {{progressPercentage}}% complete
Next Phase: {{nextPhase}}
Expected Completion: {{expectedCompletion}}

Recent Work Completed:
{{recentWork}}

Photos of progress are available in your customer portal:
{{portalLink}}

Your project manager {{projectManagerName}} will be in touch if any questions arise.

Thanks for your patience!

The Bowmans Team`,
        variables: ['customerName', 'projectTitle', 'currentPhase', 'progressPercentage', 'nextPhase', 'expectedCompletion', 'recentWork', 'portalLink', 'projectManagerName'],
      },
    };

    return templates[templateId] || null;
  }

  private processTemplate(template: string, variables: Record<string, string>): string {
    let processed = template;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processed = processed.replace(regex, value);
    }
    return processed;
  }

  private convertToHtml(text: string): string {
    return text
      .split('\n\n')
      .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
      .join('')
      .replace(/•/g, '&bull;');
  }

  private async logEmail(logData: {
    to: string;
    subject: string;
    templateId: string;
    status: 'sent' | 'failed';
    messageId?: string;
    error?: string;
  }): Promise<void> {
    try {
      // In production, store in database
      console.log('Email log:', logData);
    } catch (error) {
      console.error('Failed to log email:', error);
    }
  }

  async getEmailStats(): Promise<{
    totalSent: number;
    totalOpened: number;
    totalClicked: number;
    openRate: number;
    clickRate: number;
  }> {
    // Mock stats - in production, query from database
    return {
      totalSent: 1248,
      totalOpened: 903,
      totalClicked: 351,
      openRate: 72.4,
      clickRate: 28.1,
    };
  }
}

export default EmailService;
