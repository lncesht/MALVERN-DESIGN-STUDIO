const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter with Gmail SMTP configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true', 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};


const sendContactEmail = async (formData) => {
  try {
    const transporter = createTransporter();


    const userMailOptions = {
      from: {
        name: 'Art Visa Portfolio',
        address: process.env.SMTP_USER,
      },
      to: formData.email, 
      replyTo: process.env.SMTP_USER, 
      subject: `Thank you for contacting Art Visa - We received your message`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
              border-radius: 8px;
            }
            .header {
              background-color: #5c4033;
              color: white;
              padding: 20px;
              border-radius: 8px 8px 0 0;
              text-align: center;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .field {
              margin-bottom: 20px;
            }
            .label {
              font-weight: bold;
              color: #5c4033;
              display: block;
              margin-bottom: 5px;
            }
            .value {
              color: #333;
              padding: 10px;
              background-color: #f5f5f5;
              border-radius: 4px;
              border-left: 3px solid #5c4033;
            }
            .message-box {
              background-color: #f5f5f5;
              padding: 15px;
              border-radius: 4px;
              border-left: 3px solid #5c4033;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            .footer {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Thank You for Contacting Us!</h1>
              <p style="margin: 5px 0 0 0;">Art Visa Portfolio</p>
            </div>
            <div class="content">
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                Dear ${formData.name},
              </p>
              
              <p style="font-size: 14px; color: #555; line-height: 1.8; margin-bottom: 20px;">
                Thank you for reaching out to us! We have received your message and will get back to you as soon as possible.
              </p>
              
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; border-left: 4px solid #5c4033; margin: 20px 0;">
                <p style="font-weight: bold; color: #5c4033; margin-bottom: 10px;">Your Message:</p>
                <div class="message-box">${formData.message}</div>
              </div>
              
              <p style="font-size: 14px; color: #555; line-height: 1.8; margin-top: 20px;">
                We appreciate your interest in our artwork. If you have any urgent questions, feel free to reply to this email.
              </p>
              
              <div class="footer">
                <p><strong>Art Visa Portfolio</strong></p>
                <p>Malvern Design Studio</p>
                ${formData.country ? `<p>Serving clients in ${formData.country} and worldwide</p>` : ''}
                <p style="margin-top: 15px; font-size: 11px; color: #999;">
                  This is an automated confirmation email. Please do not reply to this message.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Thank You for Contacting Art Visa Portfolio

Dear ${formData.name},

Thank you for reaching out to us! We have received your message and will get back to you as soon as possible.

Your Message:
${formData.message}

We appreciate your interest in our artwork. If you have any urgent questions, feel free to reply to this email.

---
Art Visa Portfolio
Malvern Design Studio
${formData.country ? `Serving clients in ${formData.country} and worldwide` : ''}

This is an automated confirmation email.
      `,
    };


    const ownerMailOptions = {
      from: {
        name: 'Art Visa Contact Form',
        address: process.env.SMTP_USER,
      },
      to: process.env.SMTP_USER, 
      replyTo: formData.email, 
      subject: `New Contact Form Submission from ${formData.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
              border-radius: 8px;
            }
            .header {
              background-color: #5c4033;
              color: white;
              padding: 20px;
              border-radius: 8px 8px 0 0;
              text-align: center;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .field {
              margin-bottom: 20px;
            }
            .label {
              font-weight: bold;
              color: #5c4033;
              display: block;
              margin-bottom: 5px;
            }
            .value {
              color: #333;
              padding: 10px;
              background-color: #f5f5f5;
              border-radius: 4px;
              border-left: 3px solid #5c4033;
            }
            .message-box {
              background-color: #f5f5f5;
              padding: 15px;
              border-radius: 4px;
              border-left: 3px solid #5c4033;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            .footer {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">New Contact Form Submission</h1>
              <p style="margin: 5px 0 0 0;">Art Visa Portfolio</p>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Name:</span>
                <div class="value">${formData.name}</div>
              </div>
              
              <div class="field">
                <span class="label">Email:</span>
                <div class="value">
                  <a href="mailto:${formData.email}" style="color: #5c4033; text-decoration: none;">
                    ${formData.email}
                  </a>
                </div>
              </div>
              
              ${formData.country ? `
              <div class="field">
                <span class="label">Country:</span>
                <div class="value">${formData.country}</div>
              </div>
              ` : ''}
              
              <div class="field">
                <span class="label">Message:</span>
                <div class="message-box">${formData.message}</div>
              </div>
              
              <div class="footer">
                <p>This email was sent from the Art Visa contact form.</p>
                <p>Received on: ${new Date().toLocaleString()}</p>
                <p style="margin-top: 10px; color: #5c4033;">
                  <strong>Click "Reply" to respond directly to ${formData.name}</strong>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
New Contact Form Submission - Art Visa Portfolio

Name: ${formData.name}
Email: ${formData.email}
${formData.country ? `Country: ${formData.country}` : ''}

Message:
${formData.message}

---
Received on: ${new Date().toLocaleString()}
Click "Reply" to respond directly to ${formData.name}
      `,
    };


    const userEmail = await transporter.sendMail(userMailOptions);
    console.log('✅ Confirmation email sent to user:', userEmail.messageId);
    
    const ownerEmail = await transporter.sendMail(ownerMailOptions);
    console.log('✅ Notification email sent to owner:', ownerEmail.messageId);
    
    return {
      success: true,
      messageId: userEmail.messageId,
      message: 'Emails sent successfully',
    };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to send email',
    };
  }
};

// Verify SMTP connection
const verifyConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully');
    return true;
  } catch (error) {
    console.error('❌ SMTP connection verification failed:', error);
    return false;
  }
};

module.exports = {
  sendContactEmail,
  verifyConnection,
};
