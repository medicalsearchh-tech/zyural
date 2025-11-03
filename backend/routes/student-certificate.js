// routes/student-certificates.js
const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { 
  CertificateTemplate, 
  StudentCertificate, 
  QuizAttempt, 
  Payment, 
  User, 
  Quiz, 
  Enrollment,
  Course 
} = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');
const { sequelize } = require('../models');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// @route   GET /api/student-certificates
// @desc    Get all student's certificates and eligible courses
// @access  Private (Student)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.id;

    // Get all courses where student has quiz attempts
    const quizAttempts = await QuizAttempt.findAll({
      where: { 
        userId: studentId,
        completedAt: { [Op.not]: null }
      },
      include: [
        {
          model: Quiz,
          as: 'quiz',
          include: [
            {
              model: Course,
              as: 'course',
              include: [
                {
                  model: User,
                  as: 'instructor',
                  attributes: ['firstName', 'lastName']
                }
              ]
            }
          ]
        }
      ],
      order: [['completedAt', 'DESC']]
    });

    // UPDATED: Get student's purchased certificates with enhanced associations
    const purchasedCertificates = await StudentCertificate.findAll({
      where: { studentId },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'slug', 'pricing']
        },
        {
          model: CertificateTemplate,
          as: 'template',
          attributes: ['id', 'name', 'backgroundImageUrl', 'previewImageUrl']
        },
        {
          model: Enrollment,
          as: 'enrollment',
          attributes: ['id', 'progressPercentage', 'completedAt']
        }
      ],
      order: [['issuedAt', 'DESC']]
    });

    // Process quiz attempts to determine certificate eligibility
    const certificateEligibility = [];
    const processedCourses = new Set();

    for (const attempt of quizAttempts) {
      const course = attempt.quiz.course;
      const courseId = course.id;

      // Skip if we've already processed this course
      if (processedCourses.has(courseId)) continue;
      processedCourses.add(courseId);

      // Check if student passed the quiz
      const passed = attempt.passed || (attempt.score >= (attempt.quiz.passingScore || 70));
      
      // UPDATED: Check for active certificate templates instead of legacy Certificate model
      const templates = await CertificateTemplate.findAll({
        where: {
          status: 'active',
          [Op.or]: [
            { courseId: courseId },
            { isGlobal: true }
          ]
        }
      });
      
      const hasCertificateTemplate = templates.length > 0;
      
      // Check if already purchased
      const alreadyPurchased = purchasedCertificates.some(cert => cert.courseId === courseId);

      // Determine status
      let status = 'not_eligible';
      let action = null;
      let message = '';
      let certificatePrice = 250; // Default price

      if (!passed) {
        status = 'quiz_not_passed';
        message = 'Complete the course quiz to unlock certificate';
      } else if (!hasCertificateTemplate) {
        status = 'no_certificate_available';
        message = 'Certificate not available for this course';
      } else if (alreadyPurchased) {
        status = 'purchased';
        action = 'view_certificate';
        message = 'Certificate purchased';
      } else {
        status = 'eligible_for_purchase';
        action = 'buy_certificate';
        // Get price from template or course pricing
        certificatePrice = course.pricing?.certPrice || 250;
        message = `Purchase certificate for $${certificatePrice}`;
      }

      certificateEligibility.push({
        courseId: courseId,
        courseTitle: course.title,
        courseSlug: course.slug,
        instructorName: `${course.instructor.firstName} ${course.instructor.lastName}`,
        certificatePrice: certificatePrice,
        quizScore: Math.round(attempt.score),
        quizPassed: passed,
        completedAt: attempt.completedAt,
        status: status,
        action: action,
        message: message,
        // UPDATED: Include template information instead of legacy certificate
        template: hasCertificateTemplate ? {
          id: templates[0].id,
          name: templates[0].name,
          backgroundImageUrl: templates[0].backgroundImageUrl
        } : null,
        availableTemplates: templates
      });
    }

    res.json({
      success: true,
      data: {
        eligibleCourses: certificateEligibility,
        purchasedCertificates: purchasedCertificates,
        totalEligible: certificateEligibility.filter(c => c.status === 'eligible_for_purchase').length,
        totalPurchased: purchasedCertificates.length
      }
    });

  } catch (error) {
    console.error('Get student certificates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificate information'
    });
  }
});

// @route   POST /api/student-certificates/create-payment-intent
// @desc    Create Stripe payment intent for certificate purchase
// @access  Private (Student)
router.post('/create-payment-intent',
  authenticateToken,
  [
    body('courseId').isUUID().withMessage('Valid course ID is required'),
    body('templateId').isUUID().withMessage('Valid template ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { courseId, templateId } = req.body;
      const studentId = req.user.id;

      // UPDATED: Validate eligibility with templateId
      const { eligible, course, template, price, reason } = await validateCertificatePurchase(studentId, courseId, templateId);
      
      if (!eligible) {
        return res.status(400).json({
          success: false,
          message: reason
        });
      }

      // Check if certificate already exists
      const existingCertificate = await StudentCertificate.findOne({
        where: {
          studentId,
          courseId,
          templateId
        }
      });

      if (existingCertificate) {
        return res.status(400).json({
          success: false,
          message: 'Certificate already purchased for this course'
        });
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(price * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          studentId,
          courseId,
          templateId,
          type: 'certificate_purchase'
        }
      });

      // Create pending payment record
      await Payment.create({
        userId: studentId,
        courseId,
        amount: price,
        currency: 'USD',
        stripePaymentIntentId: paymentIntent.id,
        status: 'pending',
        paymentType: 'certificate',
        metadata: {
          courseTitle: course.title,
          templateId,
          templateName: template.name,
          studentName: `${req.user.firstName} ${req.user.lastName}`
        }
      });

      res.json({
        success: true,
        data: {
          clientSecret: paymentIntent.client_secret,
          amount: price,
          templateId: template.id
        }
      });

    } catch (error) {
      console.error('Create payment intent error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create payment intent'
      });
    }
  }
);

// @route   POST /api/student-certificates/confirm-payment
// @desc    Confirm payment and generate certificate
// @access  Private (Student)
router.post('/confirm-payment',
  authenticateToken,
  [
    body('paymentIntentId').notEmpty().withMessage('Payment intent ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { paymentIntentId } = req.body;
      const studentId = req.user.id;

      // Verify payment intent
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({
          success: false,
          message: 'Payment not completed'
        });
      }

      // Get payment record
      const payment = await Payment.findOne({
        where: {
          stripePaymentIntentId: paymentIntentId,
          userId: studentId
        }
      });

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment record not found'
        });
      }

      // Update payment status
      await payment.update({
        status: 'completed',
        stripeChargeId: paymentIntent.latest_charge
      });

      // Get enrollment for this course
      const enrollment = await Enrollment.findOne({
        where: {
          userId: studentId,
          courseId: payment.courseId
        }
      });

      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: 'Enrollment not found for this course'
        });
      }

      // Get template info
      const template = await CertificateTemplate.findByPk(payment.metadata?.templateId);
      
      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Certificate template not found'
        });
      }

      // CHECK IF CERTIFICATE ALREADY EXISTS FIRST
      const existingCertificate = await StudentCertificate.findOne({
        where: {
          studentId: studentId,
          courseId: payment.courseId,
          templateId: template.id
        }
      });

      let certificate;

      if (existingCertificate) {
        // Update existing certificate instead of creating new one
        console.log('Certificate already exists, updating existing record...');
        certificate = existingCertificate;
        
        // Update payment reference if needed
        if (!certificate.paymentId) {
          await certificate.update({
            paymentId: payment.id,
            status: 'pending' // Reset status to regenerate
          });
        }
      } else {
        // Create new certificate record
        const certificateData = await generateEnhancedCertificateData(studentId, payment.courseId, template.id, enrollment.id, payment.id);
        certificate = await StudentCertificate.create(certificateData);
      }

      // Generate certificate using certificate generation service
      try {
        const certificateGenerator = require('../services/certificateGenerator');
        const { imageUrl, pdfUrl } = await certificateGenerator.generateCertificate(template, certificate.toJSON());
        
        console.log("##############################", imageUrl, pdfUrl);
        
        if (!imageUrl && !pdfUrl) {
          throw new Error('Certificate generation failed');
        }

        // Update certificate with generated URLs
        await certificate.update({
          certificateImageUrl: imageUrl,
          certificatePdfUrl: pdfUrl,
          status: (imageUrl || pdfUrl) ? 'issued' : 'pending'
        });

        // Update enrollment
        await enrollment.update({
          certificateIssued: true,
          certificateUrl: pdfUrl || imageUrl
        });

        res.json({
          success: true,
          message: 'Certificate purchased and generated successfully',
          data: { 
            certificate: {
              ...certificate.toJSON(),
              certificateUrl: pdfUrl || imageUrl
            }
          }
        });

      } catch (generationError) {
        console.error('Certificate generation error:', generationError);
        // Still return success but mark as pending generation
        await certificate.update({
          status: 'pending'
        });

        res.json({
          success: true,
          message: 'Certificate purchased successfully. Your certificate is being generated and will be available shortly.',
          data: { certificate }
        });
      }

    } catch (error) {
      console.error('Confirm payment error:', error);
      
      // Handle specific constraint error
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'Certificate already exists for this course. Please check your certificates list.'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to confirm payment and generate certificate'
      });
    }
  }
);

// @route   GET /api/student-certificates/eligible-courses
// @desc    Get courses where student is eligible for certificate
// @access  Private (Student)
router.get('/eligible-courses', authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.id;

    const eligibleCourses = await getEligibleCoursesForCertificates(studentId);

    res.json({
      success: true,
      data: {
        eligibleCourses,
        totalEligible: eligibleCourses.length
      }
    });

  } catch (error) {
    console.error('Get eligible courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch eligible courses'
    });
  }
});

// @route   POST /api/student-certificates/generate-certificate
// @desc    Generate and issue certificate for student (manual generation)
// @access  Private (Student)
router.post('/generate-certificate',
  authenticateToken,
  [
    body('courseId').isUUID().withMessage('Valid course ID is required'),
    body('templateId').isUUID().withMessage('Valid template ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { courseId, templateId } = req.body;
      const studentId = req.user.id;

      // Validate eligibility
      const eligibility = await validateCertificateEligibility(studentId, courseId, templateId);
      if (!eligibility.eligible) {
        return res.status(400).json({
          success: false,
          message: eligibility.reason
        });
      }

      // Get enrollment for this course
      const enrollment = await Enrollment.findOne({
        where: {
          userId: studentId,
          courseId
        }
      });

      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: 'Enrollment not found for this course'
        });
      }

      // Check if certificate already exists
      const existingCertificate = await StudentCertificate.findOne({
        where: {
          studentId,
          courseId,
          templateId
        }
      });

      if (existingCertificate) {
        return res.status(400).json({
          success: false,
          message: 'Certificate already issued for this course'
        });
      }

      // FIXED: Generate enhanced certificate data
      const certificateData = await generateEnhancedCertificateData(studentId, courseId, templateId, enrollment.id, null);
      
      // FIXED: Create certificate record
      const certificate = await StudentCertificate.create(certificateData);

      // Generate certificate using certificate generation service
      try {
        const certificateGenerator = require('../services/certificateGenerator');
        const { imageUrl, pdfUrl } = await certificateGenerator.generateCertificate(eligibility.template, certificateData);
        
        console.log("#########################", imageUrl, pdfUrl);
        
        // Update certificate with generated URLs
        await certificate.update({
          certificateImageUrl: imageUrl,
          certificatePdfUrl: pdfUrl,
          status: 'issued'
        });

        // Update enrollment
        await enrollment.update({
          certificateIssued: true,
          certificateUrl: pdfUrl || imageUrl
        });

        res.json({
          success: true,
          message: 'Certificate generated successfully',
          data: { 
            certificate: {
              ...certificate.toJSON(),
              certificateUrl: pdfUrl || imageUrl
            }
          }
        });

      } catch (generationError) {
        console.error('Certificate generation error:', generationError);
        // Still return success but mark as pending generation
        await certificate.update({
          status: 'pending'
        });

        res.json({
          success: true,
          message: 'Certificate generated successfully. The certificate file is being processed and will be available shortly.',
          data: { certificate }
        });
      }

    } catch (error) {
      console.error('Generate certificate error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate certificate'
      });
    }
  }
);

// @route   GET /api/student-certificates/:id/download
// @desc    Download certificate (PDF or image)
// @access  Private (Student)
router.get('/:id/download', 
  authenticateToken,
  [
    param('id').isUUID().withMessage('Valid certificate ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const studentId = req.user.id;

      const certificate = await StudentCertificate.findOne({
        where: {
          id,
          studentId,
          isValid: true
        },
        include: [
          {
            model: CertificateTemplate,
            as: 'template',
            attributes: ['id', 'name']
          }
        ]
      });

      if (!certificate) {
        return res.status(404).json({
          success: false,
          message: 'Certificate not found or access denied'
        });
      }

      // Mark as downloaded
      await certificate.markAsDownloaded();

      // Return download URL (prefer PDF over image)
      const downloadUrl = certificate.certificateImageUrl;
      
      if (!downloadUrl) {
        return res.status(404).json({
          success: false,
          message: 'Certificate file not available for download'
        });
      }

      res.json({
        success: true,
        data: {
          downloadUrl,
          certificateNumber: certificate.certificateNumber,
          fileName: `certificate-${certificate.certificateNumber}.${certificate.certificatePdfUrl ? 'pdf' : 'jpg'}`
        }
      });

    } catch (error) {
      console.error('Download certificate error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to download certificate'
      });
    }
  }
);

// @route   GET /api/student-certificates/verify/:verificationCode
// @desc    Public certificate verification
// @access  Public
router.get('/verify/:verificationCode', 
  [
    param('verificationCode').notEmpty().withMessage('Verification code is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { verificationCode } = req.params;

      const certificate = await StudentCertificate.findByVerificationCode(verificationCode);

      if (!certificate) {
        return res.status(404).json({
          success: false,
          message: 'Certificate not found or invalid verification code'
        });
      }

      res.json({
        success: true,
        data: {
          certificate: {
            id: certificate.id,
            certificateNumber: certificate.certificateNumber,
            studentName: certificate.studentName,
            courseTitle: certificate.courseTitle,
            instructorName: certificate.instructorName,
            completionDate: certificate.completionDate,
            issueDate: certificate.issueDate,
            creditHours: certificate.creditHours,
            creditType: certificate.creditType,
            accreditationBody: certificate.accreditationBody,
            isValid: certificate.isValid,
            status: certificate.status
          },
          verification: {
            verified: true,
            verifiedAt: new Date().toISOString()
          }
        }
      });

    } catch (error) {
      console.error('Certificate verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify certificate'
      });
    }
  }
);

// ==================== ENHANCED HELPER FUNCTIONS ====================

async function getEligibleCoursesForCertificates(studentId) {
  const quizAttempts = await QuizAttempt.findAll({
    where: { 
      userId: studentId,
      completedAt: { [Op.not]: null }
    },
    include: [
      {
        model: Quiz,
        as: 'quiz',
        include: [
          {
            model: Course,
            as: 'course',
            include: [
              {
                model: User,
                as: 'instructor',
                attributes: ['firstName', 'lastName']
              }
            ]
          }
        ]
      }
    ],
    order: [['completedAt', 'DESC']]
  });

  const eligibleCourses = [];
  const processedCourses = new Set();

  for (const attempt of quizAttempts) {
    const course = attempt.quiz.course;
    if (processedCourses.has(course.id)) continue;

    processedCourses.add(course.id);

    const passed = attempt.score >= (attempt.quiz.passingScore || 70);
    
    // FIXED: Use sequelize.literal() instead of Op.literal
    const templates = await CertificateTemplate.findAll({
      where: {
        status: 'active',
        [Op.or]: [
          { courseId: course.id },
          { isGlobal: true }
        ]
      },
      order: [
        // Prefer course-specific templates
        [sequelize.literal('CASE WHEN "courseId" IS NOT NULL THEN 0 ELSE 1 END'), 'ASC'],
        ['version', 'DESC']
      ]
    });

    const hasTemplates = templates.length > 0;

    if (passed && hasTemplates) {
      // Check if already purchased
      const existingCertificate = await StudentCertificate.findOne({
        where: {
          studentId,
          courseId: course.id
        }
      });

      eligibleCourses.push({
        courseId: course.id,
        courseTitle: course.title,
        courseSlug: course.slug,
        certificatePrice: course.pricing.certPrice,
        instructorName: `${course.instructor.firstName} ${course.instructor.lastName}`,
        quizScore: Math.round(attempt.score),
        completedAt: attempt.completedAt,
        templates: templates,
        alreadyPurchased: !!existingCertificate,
        existingCertificateId: existingCertificate?.id
      });
    }
  }

  return eligibleCourses;
}

async function validateCertificateEligibility(studentId, courseId, templateId) {
  try {
    // Check if template exists and is active
    const template = await CertificateTemplate.findOne({
      where: {
        id: templateId,
        status: 'active',
        [Op.or]: [
          { courseId: courseId },
          { isGlobal: true }
        ]
      }
    });

    if (!template) {
      return {
        eligible: false,
        reason: 'Certificate template not available for this course'
      };
    }

    // Check if student passed the course quiz
    const quizAttempt = await QuizAttempt.findOne({
      where: {
        userId: studentId,
        completedAt: { [Op.not]: null }
      },
      include: [
        {
          model: Quiz,
          as: 'quiz',
          where: { courseId }
        }
      ],
      order: [['completedAt', 'DESC']]
    });

    if (!quizAttempt) {
      return {
        eligible: false,
        reason: 'No completed quiz found for this course'
      };
    }

    const passed = quizAttempt.passed || (quizAttempt.score >= (quizAttempt.quiz.passingScore || 70));
    if (!passed) {
      return {
        eligible: false,
        reason: 'Quiz not passed. Please retake the quiz to qualify for certificate.'
      };
    }

    return {
      eligible: true,
      template,
      quizAttempt
    };

  } catch (error) {
    console.error('Eligibility validation error:', error);
    return {
      eligible: false,
      reason: 'Error validating eligibility'
    };
  }
}

// UPDATED: Enhanced certificate purchase validation with template support
async function validateCertificatePurchase(studentId, courseId, templateId) {
  // Check if template exists and is active
  const template = await CertificateTemplate.findOne({
    where: {
      id: templateId,
      status: 'active',
      [Op.or]: [
        { courseId: courseId },
        { isGlobal: true }
      ]
    }
  });

  if (!template) {
    return {
      eligible: false,
      reason: 'Certificate template not available for this course'
    };
  }

  // Check if student passed the course quiz
  const quizAttempt = await QuizAttempt.findOne({
    where: {
      userId: studentId,
      completedAt: { [Op.not]: null }
    },
    include: [
      {
        model: Quiz,
        as: 'quiz',
        where: { courseId }
      }
    ],
    order: [['completedAt', 'DESC']]
  });

  if (!quizAttempt) {
    return {
      eligible: false,
      reason: 'No completed quiz found for this course'
    };
  }

  const passed = quizAttempt.passed || (quizAttempt.score >= (quizAttempt.quiz.passingScore || 70));
  if (!passed) {
    return {
      eligible: false,
      reason: 'Quiz not passed. Please retake the quiz to qualify for certificate.'
    };
  }

  // Get course info
  const course = await Course.findByPk(courseId);

  if (!course) {
    return {
      eligible: false,
      reason: 'Course not found'
    };
  }

  // Get certificate price from template or course pricing
  const certificatePrice = course.pricing?.certPrice || 250;

  return {
    eligible: true,
    course,
    template,
    price: certificatePrice,
    reason: 'Eligible for certificate purchase'
  };
}

// UPDATED: Enhanced certificate data generation with new fields
async function generateEnhancedCertificateData(studentId, courseId, templateId, enrollmentId, paymentId) {
  const student = await User.findByPk(studentId);
  const course = await Course.findByPk(courseId, {
    include: [
      {
        model: User,
        as: 'instructor',
        attributes: ['firstName', 'lastName']
      }
    ]
  });

  const quizAttempt = await QuizAttempt.findOne({
    where: {
      userId: studentId,
      completedAt: { [Op.not]: null }
    },
    include: [
      {
        model: Quiz,
        as: 'quiz',
        where: { courseId }
      }
    ],
    order: [['completedAt', 'DESC']]
  });

  // Generate unique identifiers with better uniqueness
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  
  const certificateNumber = `CERT-${timestamp}-${random}`;
  const verificationCode = `VERIFY-${Math.random().toString(36).substring(2, 12).toUpperCase()}`;

  return {
    // Enhanced fields
    enrollmentId,
    templateId,
    paymentId,
    studentId,
    courseId,
    
    // FIXED: Use null for certificateId since it's causing unique constraint issues
    certificateId: null, // Remove this field or set to null since we're using templateId
    
    // Identification fields
    certificateNumber,
    verificationCode,
    
    // Content fields
    studentName: `${student.firstName} ${student.lastName}`,
    courseTitle: course.title,
    instructorName: `${course.instructor.firstName} ${course.instructor.lastName}`,
    
    // Date fields
    completionDate: quizAttempt?.completedAt || new Date(),
    issueDate: new Date(),
    issuedAt: new Date(),
    
    // Accreditation fields
    creditHours: course.accreditedCreditHours,
    creditType: course.accreditedCreditType,
    accreditationBody: course.accreditationBody,
    
    // Status fields
    status: 'pending',
    isValid: true,
    
    // Metadata
    metadata: JSON.stringify({
      quizScore: quizAttempt?.score || 100,
      quizAttemptId: quizAttempt?.id,
      courseSlug: course.slug,
      studentEmail: student.email,
      purchaseDate: new Date().toISOString(),
      templateVersion: 1
    })
  };
}

// Legacy function for backward compatibility
async function generateCertificateData(studentId, courseId, templateId) {
  const basicData = await generateEnhancedCertificateData(studentId, courseId, templateId, null, null);
  
  // Return only the legacy fields for backward compatibility
  return {
    certificateId: templateId,
    studentId: basicData.studentId,
    courseId: basicData.courseId,
    certificateNumber: basicData.certificateNumber,
    studentName: basicData.studentName,
    courseTitle: basicData.courseTitle,
    instructorName: basicData.instructorName,
    completionDate: basicData.completionDate,
    issueDate: basicData.issueDate,
    status: 'pending',
    isValid: true,
    metadata: basicData.metadata
  };
}

module.exports = router;