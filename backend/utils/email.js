const nodemailer = require('nodemailer');

// Create transporter
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


// Email templates
const emailTemplates = {
  'email-verification': (data) => ({
    subject: 'Verify Your Email Address',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h2 style="color: #333;">Welcome to E-Learning Platform!</h2>
        <p>Hello ${data.name},</p>
        <p>Thank you for registering with our e-learning platform. To complete your registration, please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.verificationLink}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${data.verificationLink}</p>
        <p>This link will expire in 24 hours for security reasons.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">If you didn't create an account with us, please ignore this email.</p>
      </div>
    `
  }),

  // New OTP verification template
  'otp-verification': (data) => ({
    subject: 'Verify Your Email - OTP Code',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h2 style="color: #333;">Email Verification Required</h2>
        <p>Hello ${data.name},</p>
        <p>Thank you for registering with our e-learning platform. To complete your registration, please use the OTP code below:</p>
        
        <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
          <h1 style="color: #007bff; font-size: 36px; letter-spacing: 5px; margin: 0; font-family: monospace;">
            ${data.otp}
          </h1>
          <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
            Enter this code in the verification form
          </p>
        </div>
        
        <p><strong>Important:</strong></p>
        <ul style="color: #666; font-size: 14px;">
          <li>This OTP is valid for 10 minutes only</li>
          <li>Do not share this code with anyone</li>
          <li>If you didn't request this code, please ignore this email</li>
        </ul>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px; text-align: center;">
          This is an automated message, please do not reply to this email.
        </p>
      </div>
    `
  }),
  
  'password-reset': (data) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hello ${data.name},</p>
        <p>We received a request to reset your password for your E-Learning Platform account.</p>
        <p>If you made this request, click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetLink}" 
             style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${data.resetLink}</p>
        <p>This link will expire in 1 hour for security reasons.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
      </div>
    `
  }),

  'welcome': (data) => ({
    subject: 'Welcome to E-Learning Platform!',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h2 style="color: #333;">Welcome to E-Learning Platform!</h2>
        <p>Hello ${data.name},</p>
        <p>Welcome to our e-learning platform! We're excited to have you join our community of learners.</p>
        <p>Here are some things you can do to get started:</p>
        <ul style="line-height: 1.6;">
          <li>Browse our course catalog</li>
          <li>Enroll in free courses</li>
          <li>Complete your profile</li>
          <li>Start learning!</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/courses" 
             style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Explore Courses
          </a>
        </div>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Happy learning!</p>
      </div>
    `
  }),

  // Course review templates
  'course-approved': (data) => ({
    subject: `Course Approved: ${data.courseTitle}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
          <h2 style="color: #155724; margin: 0;">🎉 Course Approved!</h2>
        </div>
        
        <p>Hello ${data.instructorName},</p>
        <p>Great news! Your course <strong>"${data.courseTitle}"</strong> has been reviewed and approved.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">What's Next?</h3>
          <ul style="line-height: 1.8; color: #666;">
            <li>Your course is now ready for publication</li>
            <li>An administrator will publish it shortly</li>
            <li>You'll receive another notification once it's live</li>
            <li>Start preparing your promotional materials</li>
          </ul>
        </div>

        ${data.comments ? `
        <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h4 style="margin-top: 0; color: #856404;">Reviewer Comments:</h4>
          <p style="color: #856404; margin: 0;">${data.comments}</p>
        </div>
        ` : ''}
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/instructor/instructor-course" 
             style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            View Course
          </a>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">Thank you for contributing quality content to our platform!</p>
      </div>
    `
  }),

  'course-rejected': (data) => ({
    subject: `Course Review Update: ${data.courseTitle}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
          <h2 style="color: #721c24; margin: 0;">Course Needs Revision</h2>
        </div>
        
        <p>Hello ${data.instructorName},</p>
        <p>Thank you for submitting your course <strong>"${data.courseTitle}"</strong>. After review, we've identified some areas that need attention before we can approve it.</p>
        
        ${data.comments ? `
        <div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #856404;">Reviewer Feedback:</h3>
          <p style="color: #333; line-height: 1.6; margin: 0;">${data.comments}</p>
        </div>
        ` : ''}
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Next Steps:</h3>
          <ol style="line-height: 1.8; color: #666;">
            <li>Review the feedback carefully</li>
            <li>Make the necessary updates to your course</li>
            <li>Resubmit for review when ready</li>
          </ol>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/instructor/instructor-course" 
             style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Edit Course
          </a>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">If you have any questions about the feedback, please don't hesitate to contact our support team.</p>
      </div>
    `
  }),

  'course-changes-requested': (data) => ({
    subject: `Changes Requested: ${data.courseTitle}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background-color: #d1ecf1; border-left: 4px solid #17a2b8; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
          <h2 style="color: #0c5460; margin: 0;">📝 Changes Requested</h2>
        </div>
        
        <p>Hello ${data.instructorName},</p>
        <p>The reviewer has requested some changes to your course <strong>"${data.courseTitle}"</strong> before it can be approved.</p>
        
        ${data.comments ? `
        <div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #856404;">Requested Changes:</h3>
          <p style="color: #333; line-height: 1.6; margin: 0;">${data.comments}</p>
        </div>
        ` : ''}
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Action Required:</h3>
          <ul style="line-height: 1.8; color: #666;">
            <li>Review the requested changes</li>
            <li>Update your course content accordingly</li>
            <li>Resubmit for review</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/instructor/instructor-course" 
             style="background-color: #17a2b8; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Make Changes
          </a>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">We appreciate your cooperation in maintaining our platform's quality standards.</p>
      </div>
    `
  }),

  'course-published': (data) => ({
    subject: `Your Course is Now Live: ${data.courseTitle}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
          <h2 style="color: #155724; margin: 0;">🚀 Course Published!</h2>
        </div>
        
        <p>Hello ${data.instructorName},</p>
        <p>Exciting news! Your course <strong>"${data.courseTitle}"</strong> is now live and available to students.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Your Course is Live!</h3>
          <p style="color: #666; margin: 0;">Students can now discover, enroll in, and learn from your course. We'll keep you updated on enrollments and student feedback.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/instructor/instructor-course" 
             style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; margin-right: 10px;">
            View Course
          </a>
          <a href="${process.env.FRONTEND_URL}/instructor/instructor-dashboard" 
             style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Go to Dashboard
          </a>
        </div>
        
        <div style="background-color: #e7f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #004085;">💡 Pro Tips:</h4>
          <ul style="color: #004085; line-height: 1.8; margin: 0;">
            <li>Share your course on social media</li>
            <li>Engage with your students in Q&A</li>
            <li>Monitor your course analytics</li>
            <li>Keep your course content updated</li>
          </ul>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">Thank you for being part of our instructor community!</p>
      </div>
    `
  }),

  'course-submitted': (data) => ({
    subject: `Course Submitted: ${data.courseTitle}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background-color: #d1ecf1; border-left: 4px solid #17a2b8; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
          <h2 style="color: #0c5460; margin: 0;">✅ Course Submitted Successfully</h2>
        </div>
        
        <p>Hello ${data.instructorName},</p>
        <p>Thank you for submitting your course <strong>"${data.courseTitle}"</strong> for review.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">What Happens Next?</h3>
          <ul style="line-height: 1.8; color: #666;">
            <li>Our review team will evaluate your course content</li>
            <li>Expected review time: 5-10 business days</li>
            <li>You'll receive an email once the review is complete</li>
            <li>Your course is temporarily locked during review</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/instructor/instructor-course" 
            style="background-color: #17a2b8; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            View Course Status
          </a>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">Thank you for your patience during the review process!</p>
      </div>
    `
  }),

  'course-resubmitted': (data) => ({
    subject: `Course Resubmitted: ${data.courseTitle}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
          <h2 style="color: #155724; margin: 0;">🔄 Course Resubmitted Successfully</h2>
        </div>
        
        <p>Hello ${data.instructorName},</p>
        <p>Thank you for resubmitting your course <strong>"${data.courseTitle}"</strong> with the requested changes.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Next Steps:</h3>
          <ul style="line-height: 1.8; color: #666;">
            <li>Our review team will evaluate your updates</li>
            <li>Expected review time: 3-5 business days</li>
            <li>You'll be notified once the review is complete</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/instructor/instructor-course" 
            style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            View Course
          </a>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">We appreciate your cooperation and commitment to quality!</p>
      </div>
    `
  }),

  'admin-course-submission': (data) => ({
    subject: `New Course Submission: ${data.courseTitle}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
          <h2 style="color: #856404; margin: 0;">📚 New Course Awaiting Review</h2>
        </div>
        
        <p>Hello ${data.adminName},</p>
        <p>A new course has been submitted for review and requires your attention.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Course Details:</h3>
          <ul style="line-height: 1.8; color: #666; list-style: none; padding: 0;">
            <li><strong>Course Title:</strong> ${data.courseTitle}</li>
            <li><strong>Instructor:</strong> ${data.instructorName}</li>
            <li><strong>Status:</strong> Pending Review</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/admin/instructor-requests" 
            style="background-color: #ffc107; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Review Course
          </a>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">Please review this course at your earliest convenience.</p>
      </div>
    `
  }),

  'admin-course-resubmission': (data) => ({
    subject: `Course Resubmitted: ${data.courseTitle}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background-color: #d1ecf1; border-left: 4px solid #17a2b8; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
          <h2 style="color: #0c5460; margin: 0;">🔄 Course Resubmitted for Review</h2>
        </div>
        
        <p>Hello ${data.adminName},</p>
        <p>An instructor has resubmitted a course with the requested changes.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Course Details:</h3>
          <ul style="line-height: 1.8; color: #666; list-style: none; padding: 0;">
            <li><strong>Course Title:</strong> ${data.courseTitle}</li>
            <li><strong>Instructor:</strong> ${data.instructorName}</li>
            <li><strong>Status:</strong> Ready for Re-review</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/admin/instructor-requests" 
            style="background-color: #17a2b8; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Review Changes
          </a>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">The instructor has addressed your previous feedback.</p>
      </div>
    `
  })
};

// Send email function
const sendEmail = async ({ to, subject, template, data, html, text }) => {
  try {

    let emailContent = {};

    if (template && emailTemplates[template]) {
      emailContent = emailTemplates[template](data || {});
    } else if (html || text) {
      emailContent = { subject, html, text };
    } else {
      throw new Error('Either template or html/text content is required');
    }

    const mailOptions = {
      from: `"Zyural" <${process.env.EMAIL_USER}>`,
      to,
      subject: emailContent.subject || subject,
      html: emailContent.html,
      text: emailContent.text
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('🚀 Email sent successfully:', result.messageId);
    return result;

  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  }
};

// Send bulk emails
const sendBulkEmails = async (emails) => {
  try {
    const results = [];

    for (const email of emails) {
      try {
        const result = await sendEmail(email);
        results.push({ success: true, messageId: result.messageId, to: email.to });
      } catch (error) {
        results.push({ success: false, error: error.message, to: email.to });
      }
    }

    return results;
  } catch (error) {
    console.error('❌ Failed to send bulk emails:', error);
    throw error;
  }
};

// Helper function for course review emails
const sendCourseReviewEmail = async (instructor, course, action, comments = '') => {
  const templateMap = {
    'approve': 'course-approved',
    'reject': 'course-rejected',
    'request-changes': 'course-changes-requested'
  };

  const template = templateMap[action];
  if (!template) {
    throw new Error(`Invalid action: ${action}`);
  }

  return await sendEmail({
    to: instructor.email,
    template: template,
    data: {
      instructorName: `${instructor.firstName} ${instructor.lastName}`,
      courseTitle: course.title,
      courseId: course.id,
      comments: comments
    }
  });
};

module.exports = {
  sendEmail,
  sendBulkEmails,
  sendCourseReviewEmail
};