import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  // If Resend is not configured, log the email instead
  if (!resend) {
    console.log('📧 Email would be sent (Resend not configured):');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`HTML: ${html.substring(0, 100)}...`);
    return { success: true, data: { id: 'mock-email-id' } };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'office@dimaxdistribution.ro',
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

export async function sendUserApprovalEmail(userEmail: string, userName: string, approved: boolean) {
  const subject = approved 
    ? 'Your Account Has Been Approved - DMax'
    : 'Account Registration Update - DMax';

  const html = approved
    ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Welcome to DMax!</h2>
        <p>Dear ${userName},</p>
        <p>Great news! Your account has been approved and you can now access our B2B platform.</p>
        <p>You can now:</p>
        <ul>
          <li>Browse our product catalog</li>
          <li>Create quote requests</li>
          <li>Access pricing information</li>
          <li>Track your orders</li>
        </ul>
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
             style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Access Your Dashboard
          </a>
        </p>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>DMax Team</p>
      </div>
    `
    : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Account Registration Update</h2>
        <p>Dear ${userName},</p>
        <p>Thank you for your interest in our B2B platform. After reviewing your application, we are unable to approve your account at this time.</p>
        <p>If you have any questions or would like to discuss this further, please contact our support team.</p>
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact" 
             style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Contact Support
          </a>
        </p>
        <p>Best regards,<br>DMax Team</p>
      </div>
    `;

  return sendEmail({ to: userEmail, subject, html });
}

export async function sendNewUserNotificationEmail(adminEmail: string, userName: string, userEmail: string, companyName: string) {
  const subject = 'New User Registration - Requires Approval';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #16a34a;">New User Registration</h2>
      <p>A new user has registered and requires your approval:</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Name:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Company:</strong> ${companyName}</p>
      </div>
      <p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/users" 
           style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Review User
        </a>
      </p>
      <p>Please review and approve or reject this registration.</p>
    </div>
  `;

  return sendEmail({ to: adminEmail, subject, html });
}

export async function sendRFQOfferEmail(customerEmail: string, customerName: string, rfqId: string, totalAmount: number) {
  const subject = 'New Quote Offer - DMax';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #16a34a;">New Quote Offer Available</h2>
      <p>Dear ${customerName},</p>
      <p>We have prepared a quote for your recent request.</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>RFQ ID:</strong> #${rfqId.slice(-8)}</p>
        <p><strong>Total Amount:</strong> €${totalAmount.toFixed(2)}</p>
      </div>
      <p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/rfq/${rfqId}" 
           style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Offer
        </a>
      </p>
      <p>Please review the offer and let us know if you'd like to proceed.</p>
      <p>Best regards,<br>Vegetable Wholesale Co. Team</p>
    </div>
  `;

  return sendEmail({ to: customerEmail, subject, html });
}
