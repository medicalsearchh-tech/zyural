const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

// Contact Model (optional - if you want to store messages in DB)
// You can create this model or just send emails without storing
const { ContactMessage } = require('../models');

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    ciphers: 'SSLv3' // Use this option to enforce using TLS
  }
});

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post(
  '/',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email address'),
    body('phone')
      .optional()
      .trim()
      .matches(/^[0-9+\-\s()]*$/)
      .withMessage('Please provide a valid phone number'),
    body('subject')
      .trim()
      .notEmpty()
      .withMessage('Subject is required')
      .isLength({ min: 3, max: 200 })
      .withMessage('Subject must be between 3 and 200 characters'),
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message is required')
      .isLength({ min: 10, max: 5000 })
      .withMessage('Message must be between 10 and 5000 characters')
  ],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { name, email, phone, subject, message } = req.body;

      // Save to database (optional)
      try {
        await ContactMessage.create({
          name,
          email,
          phone: phone || null,
          subject,
          message,
          status: 'new',
          ipAddress: req.ip,
          userAgent: req.headers['user-agent']
        });
      } catch (dbError) {
        console.error('Database save error (non-critical):', dbError);
        // Continue even if DB save fails
      }

      // Send email to admin
      const adminMailOptions = {
        from: `"Zyural" <${process.env.EMAIL_USER}>`,
        to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
        replyTo: email,
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #4F46E5; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
              .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #4F46E5; }
              .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>New Contact Form Submission</h2>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Name:</div>
                  <div>${name}</div>
                </div>
                <div class="field">
                  <div class="label">Email:</div>
                  <div><a href="mailto:${email}">${email}</a></div>
                </div>
                ${phone ? `
                <div class="field">
                  <div class="label">Phone:</div>
                  <div><a href="tel:${phone}">${phone}</a></div>
                </div>
                ` : ''}
                <div class="field">
                  <div class="label">Subject:</div>
                  <div>${subject}</div>
                </div>
                <div class="field">
                  <div class="label">Message:</div>
                  <div style="white-space: pre-wrap;">${message}</div>
                </div>
                <div class="footer">
                  <p>Submitted: ${new Date().toLocaleString()}</p>
                  <p>IP Address: ${req.ip}</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `
      };

      // Send confirmation email to user
      const userMailOptions = {
        from: `"Zyural" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Thank you for contacting us',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #4F46E5; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
              .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Thank You for Contacting Us</h2>
              </div>
              <div class="content">
                <p>Dear ${name},</p>
                <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
                <p><strong>Your Message:</strong></p>
                <p style="background: white; padding: 15px; border-left: 3px solid #4F46E5; white-space: pre-wrap;">${message}</p>
                <p>If you have any urgent questions, please don't hesitate to reach out to us directly.</p>
                <p>Best regards,<br>Zyural Team</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      // Send emails
      await Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(userMailOptions)
      ]);

      res.json({
        success: true,
        message: 'Thank you for contacting us! We will get back to you soon.'
      });

    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send message. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// @route   GET /api/contact/messages
// @desc    Get all contact messages (Admin only)
// @access  Private/Admin
router.get('/messages', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const status = req.query.status || '';

    const where = {};
    if (status) {
      where.status = status;
    }

    const { count, rows: messages } = await ContactMessage.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          currentPage: page,
          totalPages,
          totalMessages: count,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get messages'
    });
  }
});

// @route   PATCH /api/contact/messages/:id/status
// @desc    Update message status (Admin only)
// @access  Private/Admin
router.patch('/messages/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['new', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const message = await ContactMessage.findByPk(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    message.status = status;
    await message.save();

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: message
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status'
    });
  }
});

module.exports = router;