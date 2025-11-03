const nodemailer = require('nodemailer');
const config = require('../config/config');
const fs = require('fs');

const transporter = nodemailer.createTransport({
  host: config.EMAIL_SERVICE_HOST,
  port: config.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
  tls: {
    ciphers: 'SSLv3' // Use this option to enforce using TLS
  }
});

const sendNotification = async (recipient, subject, htmlContent) => {
  const mailOptions = {
    from: `"DoctorsInFrance" <${config.EMAIL_USER}>`,
    to: recipient,
    subject: subject,
    html: htmlContent, // Use 'text' for plain text emails or 'html' for HTML emails
  };

  // Set a timeout for the email sending process
  const sendMailWithTimeout = (mailOptions, timeout = 10000) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Email sending timeout'));
      }, timeout);

      transporter.sendMail(mailOptions, (error, info) => {
        clearTimeout(timer);
        if (error) {
          return reject(error);
        }
        resolve(info);
      });
    });
  };

  try {
    const info = await sendMailWithTimeout(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      response: info.response
    };
  } catch (error) {
    console.error('Error sending email: ', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = { sendNotification };
