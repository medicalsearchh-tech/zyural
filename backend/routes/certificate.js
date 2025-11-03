const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { body, param, validationResult } = require('express-validator');
const { Course, Certificate, User, StudentCertificate, Enrollment } = require('../models');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for certificate template uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for certificate templates
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files for certificate templates
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Certificate template must be an image file (PNG, JPG, JPEG)'), false);
    }
  }
});

// Helper function to upload certificate template to Cloudinary
const uploadCertificateTemplate = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: 'image',
      folder: 'certificate-templates',
      quality: 'auto:best',
      format: 'png', // Ensure high quality for certificates
      transformation: [
        { width: 1200, height: 850, crop: 'limit' }, // Standard certificate size
        { quality: 'auto:best' }
      ],
      ...options
    };

    cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(buffer);
  });
};

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

// CERTIFICATE ROUTES - ADMIN ONLY

// @route   POST /api/admin/certificates
// @desc    Create new certificate template (Admin can create for any course)
// @access  Private (Admin only)
router.post('/', 
  authenticateToken, 
  isAdmin, 
  upload.single('template'),
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Certificate title is required')
      .isLength({ min: 3, max: 200 })
      .withMessage('Title must be between 3 and 200 characters'),
    body('courseId')
      .isUUID()
      .withMessage('Valid course ID is required'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description must not exceed 500 characters'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean value')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const {
        title,
        description,
        courseId,
        isActive,
        settings
      } = req.body;

      // Verify course exists (Admin can access any course)
      const course = await Course.findOne({
        where: { id: courseId },
        include: [
          {
            model: User,
            as: 'instructor',
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      });

      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      // Check if certificate already exists for this course
      const existingCertificate = await Certificate.findOne({
        where: { courseId }
      });

      if (existingCertificate) {
        return res.status(400).json({
          success: false,
          message: 'Certificate template already exists for this course'
        });
      }

      // Handle template upload
      let templateUrl = null;
      let templatePublicId = null;

      if (req.file) {
        try {
          const uploadResult = await uploadCertificateTemplate(req.file.buffer, {
            public_id: `cert-${courseId}-${Date.now()}`
          });
          templateUrl = uploadResult.secure_url;
          templatePublicId = uploadResult.public_id;
        } catch (uploadError) {
          console.error('Certificate template upload error:', uploadError);
          return res.status(500).json({
            success: false,
            message: 'Failed to upload certificate template'
          });
        }
      }

      // Parse settings if provided
      let certificateSettings = {};
      if (settings) {
        try {
          certificateSettings = typeof settings === 'string' ? JSON.parse(settings) : settings;
        } catch (e) {
          certificateSettings = {};
        }
      }

      // Default certificate settings
      const defaultSettings = {
        showInstructorName: true,
        showCompletionDate: true,
        showCourseTitle: true,
        showStudentName: true,
        fontFamily: 'Arial',
        fontSize: {
          studentName: 36,
          courseTitle: 24,
          completionText: 18,
          instructorName: 16
        },
        colors: {
          primary: '#1a1a1a',
          secondary: '#666666',
          accent: '#007bff'
        },
        positions: {
          studentName: { x: 50, y: 45 },
          courseTitle: { x: 50, y: 60 },
          completionDate: { x: 50, y: 75 },
          instructorName: { x: 50, y: 85 }
        }
      };

      const finalSettings = { ...defaultSettings, ...certificateSettings };

      const certificate = await Certificate.create({
        title,
        description: description || '',
        courseId,
        templateUrl,
        templatePublicId,
        settings: JSON.stringify(finalSettings),
        isActive: isActive !== undefined ? isActive : true,
        createdBy: req.user.id
      });

      // Include course and instructor info in response
      const certificateWithDetails = await Certificate.findOne({
        where: { id: certificate.id },
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'title', 'slug'],
            include: [
              {
                model: User,
                as: 'instructor',
                attributes: ['id', 'firstName', 'lastName']
              }
            ]
          },
          {
            model: User,
            as: 'instructor',
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Certificate template created successfully',
        data: { certificate: certificateWithDetails }
      });

    } catch (error) {
      console.error('Create certificate error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create certificate template'
      });
    }
  }
);

// @route   GET /api/admin/certificates
// @desc    Get all certificates in the system (Admin view)
// @access  Private (Admin only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const courseId = req.query.courseId || '';
    const instructorId = req.query.instructorId || '';
    const isActive = req.query.isActive;

    const whereConditions = {};
    
    // Search functionality
    if (search) {
      whereConditions[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Filter by course
    if (courseId) {
      whereConditions.courseId = courseId;
    }

    // Filter by active status
    if (isActive !== undefined) {
      whereConditions.isActive = isActive === 'true';
    }

    const includeOptions = [
      {
        model: Course,
        as: 'course',
        attributes: ['id', 'title', 'slug', 'instructorId'],
        include: [
          {
            model: User,
            as: 'instructor',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      },
      {
        model: User,
        as: 'instructor',
        attributes: ['id', 'firstName', 'lastName']
      }
    ];

    // Filter by instructor
    if (instructorId) {
      includeOptions[0].where = { instructorId };
    }

    const { count, rows: certificates } = await Certificate.findAndCountAll({
      where: whereConditions,
      include: includeOptions,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      distinct: true
    });

    // Get issued certificate counts for each certificate
    const certificatesWithStats = await Promise.all(
      certificates.map(async (certificate) => {
        const issuedCount = await StudentCertificate.count({
          where: { certificateId: certificate.id }
        });

        return {
          ...certificate.toJSON(),
          issuedCount
        };
      })
    );

    const totalPages = Math.ceil(count / limit);

    // Get summary statistics
    const totalCertificates = await Certificate.count();
    const activeCertificates = await Certificate.count({ where: { isActive: true } });
    const certificatesWithIssued = await Certificate.count({
      include: [{
        model: StudentCertificate,
        as: 'issuedCertificates',
        required: true
      }]
    });

    res.json({
      success: true,
      data: {
        certificates: certificatesWithStats,
        stats: {
          totalCertificates,
          activeCertificates,
          inactiveCertificates: totalCertificates - activeCertificates,
          certificatesWithIssued,
          certificatesWithoutIssued: totalCertificates - certificatesWithIssued
        },
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: count,
          itemsPerPage: limit,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificates'
    });
  }
});

// @route   GET /api/admin/certificates/:id
// @desc    Get single certificate by ID with full details
// @access  Private (Admin only)
router.get('/:id',
  authenticateToken,
  isAdmin,
  [
    param('id').isUUID().withMessage('Valid certificate ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      const certificate = await Certificate.findOne({
        where: { id },
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'title', 'slug', 'description', 'instructorId'],
            include: [
              {
                model: User,
                as: 'instructor',
                attributes: ['id', 'firstName', 'lastName', 'email']
              }
            ]
          },
          {
            model: User,
            as: 'instructor',
            attributes: ['id', 'firstName', 'lastName']
          },
          {
            model: StudentCertificate,
            as: 'issuedCertificates',
            attributes: ['id', 'studentName', 'issueDate', 'certificateNumber'],
            limit: 10,
            order: [['issueDate', 'DESC']]
          }
        ]
      });

      if (!certificate) {
        return res.status(404).json({
          success: false,
          message: 'Certificate not found'
        });
      }

      // Get issued certificates count
      const issuedCount = await StudentCertificate.count({
        where: { certificateId: id }
      });

      const certificateWithStats = {
        ...certificate.toJSON(),
        issuedCount
      };

      res.json({
        success: true,
        data: { certificate: certificateWithStats }
      });

    } catch (error) {
      console.error('Get certificate error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch certificate'
      });
    }
  }
);

// @route   PUT /api/admin/certificates/:id
// @desc    Update certificate template (Admin can update any certificate)
// @access  Private (Admin only)
router.put('/:id',
  authenticateToken,
  isAdmin,
  upload.single('template'),
  [
    param('id').isUUID().withMessage('Valid certificate ID is required'),
    body('title')
      .optional()
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Title must be between 3 and 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description must not exceed 500 characters'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean value')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        isActive,
        settings
      } = req.body;

      // Find certificate (Admin can access any certificate)
      const certificate = await Certificate.findOne({
        where: { id },
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'title']
          }
        ]
      });

      if (!certificate) {
        return res.status(404).json({
          success: false,
          message: 'Certificate not found'
        });
      }

      const updateData = {};

      // Update basic fields
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (isActive !== undefined) updateData.isActive = isActive;

      // Handle new template upload
      if (req.file) {
        try {
          // Delete old template from Cloudinary if exists
          if (certificate.templatePublicId) {
            await cloudinary.uploader.destroy(certificate.templatePublicId);
          }

          // Upload new template
          const uploadResult = await uploadCertificateTemplate(req.file.buffer, {
            public_id: `cert-${certificate.courseId}-${Date.now()}`
          });

          updateData.templateUrl = uploadResult.secure_url;
          updateData.templatePublicId = uploadResult.public_id;
        } catch (uploadError) {
          console.error('Certificate template upload error:', uploadError);
          return res.status(500).json({
            success: false,
            message: 'Failed to upload new certificate template'
          });
        }
      }

      // Handle settings update
      if (settings) {
        try {
          const currentSettings = certificate.settings ? JSON.parse(certificate.settings) : {};
          const newSettings = typeof settings === 'string' ? JSON.parse(settings) : settings;
          const mergedSettings = { ...currentSettings, ...newSettings };
          updateData.settings = JSON.stringify(mergedSettings);
        } catch (e) {
          return res.status(400).json({
            success: false,
            message: 'Invalid settings format'
          });
        }
      }

      await certificate.update(updateData);

      // Fetch updated certificate with full details
      const updatedCertificate = await Certificate.findOne({
        where: { id },
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'title', 'slug'],
            include: [
              {
                model: User,
                as: 'instructor',
                attributes: ['id', 'firstName', 'lastName']
              }
            ]
          },
          {
            model: User,
            as: 'instructor',
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      });

      res.json({
        success: true,
        message: 'Certificate updated successfully',
        data: { certificate: updatedCertificate }
      });

    } catch (error) {
      console.error('Update certificate error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update certificate'
      });
    }
  }
);

// @route   DELETE /api/admin/certificates/:id
// @desc    Delete certificate template (Admin can delete any certificate)
// @access  Private (Admin only)
router.delete('/:id',
  authenticateToken,
  isAdmin,
  [
    param('id').isUUID().withMessage('Valid certificate ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Find certificate (Admin can access any certificate)
      const certificate = await Certificate.findOne({
        where: { id }
      });

      if (!certificate) {
        return res.status(404).json({
          success: false,
          message: 'Certificate not found'
        });
      }

      // Check if there are issued certificates
      const issuedCount = await StudentCertificate.count({
        where: { certificateId: id }
      });

      if (issuedCount > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot delete certificate. ${issuedCount} certificates have been issued to students.`
        });
      }

      // Delete template from Cloudinary
      if (certificate.templatePublicId) {
        try {
          await cloudinary.uploader.destroy(certificate.templatePublicId);
        } catch (cloudinaryError) {
          console.warn('Failed to delete certificate template from Cloudinary:', cloudinaryError);
          // Continue with database deletion even if Cloudinary deletion fails
        }
      }

      // Delete from database
      await certificate.destroy();

      res.json({
        success: true,
        message: 'Certificate template deleted successfully'
      });

    } catch (error) {
      console.error('Delete certificate error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete certificate'
      });
    }
  }
);

// @route   POST /api/admin/certificates/:id/toggle-status
// @desc    Toggle certificate active status (Admin can toggle any certificate)
// @access  Private (Admin only)
router.post('/:id/toggle-status',
  authenticateToken,
  isAdmin,
  [
    param('id').isUUID().withMessage('Valid certificate ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Find certificate (Admin can access any certificate)
      const certificate = await Certificate.findOne({
        where: { id }
      });

      if (!certificate) {
        return res.status(404).json({
          success: false,
          message: 'Certificate not found'
        });
      }

      // Toggle status
      await certificate.update({
        isActive: !certificate.isActive
      });

      res.json({
        success: true,
        message: `Certificate ${certificate.isActive ? 'activated' : 'deactivated'} successfully`,
        data: {
          id: certificate.id,
          isActive: certificate.isActive
        }
      });

    } catch (error) {
      console.error('Toggle certificate status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to toggle certificate status'
      });
    }
  }
);

// @route   GET /api/admin/certificates/:id/issued-certificates
// @desc    Get all issued certificates for a specific certificate template
// @access  Private (Admin only)
router.get('/:id/issued-certificates',
  authenticateToken,
  isAdmin,
  [
    param('id').isUUID().withMessage('Valid certificate ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const search = req.query.search || '';

      const whereConditions = { certificateId: id };

      if (search) {
        whereConditions[Op.or] = [
          { studentName: { [Op.iLike]: `%${search}%` } },
          { certificateNumber: { [Op.iLike]: `%${search}%` } },
          { courseTitle: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { count, rows: issuedCertificates } = await StudentCertificate.findAndCountAll({
        where: whereConditions,
        include: [
          {
            model: User,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'title', 'slug']
          }
        ],
        order: [['issueDate', 'DESC']],
        limit,
        offset
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        success: true,
        data: {
          issuedCertificates,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: count,
            itemsPerPage: limit,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        }
      });

    } catch (error) {
      console.error('Get issued certificates error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch issued certificates'
      });
    }
  }
);

module.exports = router;