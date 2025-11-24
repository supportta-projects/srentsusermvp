import nodemailer from 'nodemailer';

// Email configuration from environment variables
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.hostinger.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465');
const SMTP_USER = process.env.SMTP_USER || 'contact@rentorent.net';
const SMTP_PASS = process.env.SMTP_PASS || '1@Abijithcb';
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'info@abijithcb.com';

// Create transporter with better error handling
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false,
  },
  // Connection timeout
  connectionTimeout: 10000, // 10 seconds
  // Socket timeout
  socketTimeout: 10000, // 10 seconds
});

// Verify transporter configuration on startup
let smtpVerified = false;
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP configuration error:', error);
    console.error('SMTP Config:', {
      host: SMTP_HOST,
      port: SMTP_PORT,
      user: SMTP_USER,
      hasPassword: !!SMTP_PASS,
    });
  } else {
    console.log('✅ SMTP server is ready to send emails');
    smtpVerified = true;
  }
});

export interface ContactEmailData {
  name?: string;
  phone: string;
  message?: string;
  productTitle: string;
  productId: string;
  shopId: string;
  shopName?: string;
  productPrice?: number;
  productCity?: string;
}

export interface PaymentEmailData {
  vendorId: string;
  vendorEmail?: string;
  vendorName?: string;
  vendorPhone?: string;
  planId: string;
  planName: string;
  amount: number;
  orderId: string;
  paymentId?: string;
  status: 'pending' | 'completed' | 'failed';
  paymentDate?: Date;
}

/**
 * Send contact form submission notification email
 */
export async function sendContactNotification(data: ContactEmailData): Promise<void> {
  const emailSubject = `New Contact Request - ${data.productTitle}`;
  
  const emailBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #DC2626; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { color: #333; margin-top: 5px; }
        .product-info { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Contact Request</h2>
        </div>
        <div class="content">
          <h3>Product Information</h3>
          <div class="product-info">
            <div class="field">
              <div class="label">Product:</div>
              <div class="value">${data.productTitle}</div>
            </div>
            ${data.productPrice ? `
            <div class="field">
              <div class="label">Price:</div>
              <div class="value">₹${data.productPrice}/day</div>
            </div>
            ` : ''}
            ${data.productCity ? `
            <div class="field">
              <div class="label">City:</div>
              <div class="value">${data.productCity}</div>
            </div>
            ` : ''}
            <div class="field">
              <div class="label">Product ID:</div>
              <div class="value">${data.productId}</div>
            </div>
            ${data.shopName ? `
            <div class="field">
              <div class="label">Shop:</div>
              <div class="value">${data.shopName}</div>
            </div>
            ` : ''}
            <div class="field">
              <div class="label">Shop ID:</div>
              <div class="value">${data.shopId}</div>
            </div>
          </div>

          <h3>Contact Information</h3>
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${data.name || 'Not provided'}</div>
          </div>
          <div class="field">
            <div class="label">Phone:</div>
            <div class="value"><a href="tel:${data.phone}">${data.phone}</a></div>
          </div>
          ${data.message ? `
          <div class="field">
            <div class="label">Message:</div>
            <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
          </div>
          ` : ''}
          
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            This is an automated notification from rentorent.net<br>
            Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    console.log('📧 Attempting to send contact notification email...');
    console.log('Email config:', {
      from: SMTP_USER,
      to: NOTIFICATION_EMAIL,
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
    });
    console.log('Email subject:', emailSubject);
    console.log('Email data:', {
      name: data.name,
      phone: data.phone,
      productTitle: data.productTitle,
    });
    
    const mailOptions = {
      from: `"RentOrent" <${SMTP_USER}>`,
      to: NOTIFICATION_EMAIL,
      subject: emailSubject,
      html: emailBody,
      text: `New Contact Request - ${data.productTitle}\n\nName: ${data.name || 'Not provided'}\nPhone: ${data.phone}\nMessage: ${data.message || 'No message'}\n\nProduct: ${data.productTitle}\nShop: ${data.shopName || 'Unknown'}\nPrice: ₹${data.productPrice || 'N/A'}/day`,
    };
    
    console.log('📧 Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });
    
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Contact notification email sent successfully');
    console.log('Email result:', {
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected,
      response: result.response,
    });
    
    if (result.rejected && result.rejected.length > 0) {
      console.error('⚠️ Email was rejected:', result.rejected);
    }
    
    if (!result.accepted || result.accepted.length === 0) {
      console.error('⚠️ Email was not accepted by any recipient');
    }
  } catch (error: any) {
    console.error('❌ Error sending contact notification email:', error);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
}

/**
 * Send payment notification email
 */
export async function sendPaymentNotification(data: PaymentEmailData): Promise<void> {
  const statusEmoji = data.status === 'completed' ? '✅' : data.status === 'pending' ? '⏳' : '❌';
  const statusText = data.status === 'completed' ? 'Payment Completed' : data.status === 'pending' ? 'Payment Pending' : 'Payment Failed';
  
  const emailSubject = `${statusEmoji} ${statusText} - ${data.planName} Subscription`;

  const emailBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: ${data.status === 'completed' ? '#10B981' : data.status === 'pending' ? '#F59E0B' : '#EF4444'}; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { color: #333; margin-top: 5px; }
        .payment-info { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
        .status-completed { background-color: #10B981; color: white; }
        .status-pending { background-color: #F59E0B; color: white; }
        .status-failed { background-color: #EF4444; color: white; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>${statusText}</h2>
        </div>
        <div class="content">
          <h3>Subscription Details</h3>
          <div class="payment-info">
            <div class="field">
              <div class="label">Plan:</div>
              <div class="value">${data.planName}</div>
            </div>
            <div class="field">
              <div class="label">Amount:</div>
              <div class="value">₹${data.amount.toLocaleString('en-IN')}</div>
            </div>
            <div class="field">
              <div class="label">Status:</div>
              <div class="value">
                <span class="status-badge status-${data.status}">${statusText}</span>
              </div>
            </div>
            ${data.paymentDate ? `
            <div class="field">
              <div class="label">Payment Date:</div>
              <div class="value">${data.paymentDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div>
            </div>
            ` : ''}
          </div>

          <h3>Vendor Information</h3>
          <div class="field">
            <div class="label">Vendor ID:</div>
            <div class="value">${data.vendorId}</div>
          </div>
          ${data.vendorName ? `
          <div class="field">
            <div class="label">Vendor Name:</div>
            <div class="value">${data.vendorName}</div>
          </div>
          ` : ''}
          ${data.vendorEmail ? `
          <div class="field">
            <div class="label">Vendor Email:</div>
            <div class="value">${data.vendorEmail}</div>
          </div>
          ` : ''}
          ${data.vendorPhone ? `
          <div class="field">
            <div class="label">Vendor Phone:</div>
            <div class="value"><a href="tel:${data.vendorPhone}">${data.vendorPhone}</a></div>
          </div>
          ` : ''}

          <h3>Payment Details</h3>
          <div class="field">
            <div class="label">Order ID:</div>
            <div class="value">${data.orderId}</div>
          </div>
          ${data.paymentId ? `
          <div class="field">
            <div class="label">Payment ID:</div>
            <div class="value">${data.paymentId}</div>
          </div>
          ` : ''}
          <div class="field">
            <div class="label">Plan ID:</div>
            <div class="value">${data.planId}</div>
          </div>
          
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            This is an automated notification from rentorent.net<br>
            ${data.paymentDate ? `Processed at: ${data.paymentDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}` : `Generated at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    console.log(`📧 Attempting to send payment ${data.status} notification email...`);
    console.log('Email config:', {
      from: SMTP_USER,
      to: NOTIFICATION_EMAIL,
      vendorEmail: data.vendorEmail || 'Not provided',
      host: SMTP_HOST,
      port: SMTP_PORT,
    });
    
    // Send email to admin (always)
    const adminResult = await transporter.sendMail({
      from: `"RentOrent" <${SMTP_USER}>`,
      to: NOTIFICATION_EMAIL,
      subject: emailSubject,
      html: emailBody,
    });
    
    console.log(`✅ Payment ${data.status} notification email sent to admin (${NOTIFICATION_EMAIL})`);
    console.log('Admin email result:', {
      messageId: adminResult.messageId,
      accepted: adminResult.accepted,
      rejected: adminResult.rejected,
    });
    
    // Also send email to vendor if email is provided
    if (data.vendorEmail) {
      try {
        const vendorResult = await transporter.sendMail({
          from: `"RentOrent" <${SMTP_USER}>`,
          to: data.vendorEmail,
          subject: emailSubject,
          html: emailBody,
        });
        
        console.log(`✅ Payment ${data.status} notification email sent to vendor (${data.vendorEmail})`);
        console.log('Vendor email result:', {
          messageId: vendorResult.messageId,
          accepted: vendorResult.accepted,
          rejected: vendorResult.rejected,
        });
      } catch (vendorError: any) {
        console.error(`⚠️ Failed to send email to vendor (${data.vendorEmail}):`, vendorError);
        // Don't throw - vendor email failure shouldn't break the process
      }
    } else {
      console.log('⚠️ Vendor email not provided - skipping vendor notification');
    }
  } catch (error: any) {
    console.error(`❌ Error sending payment ${data.status} notification email:`, error);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
    });
    throw error;
  }
}

