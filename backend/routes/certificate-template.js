const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { body, param, validationResult } = require('express-validator');
const { CertificateTemplate, Course, User, StudentCertificate } = require('../models'); 
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { Op } = require('sequelize');
const { sequelize } = require('../models');

const router = express.Router();

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer, folder, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: 'image',
      folder: folder,
      quality: 'auto:best',
      ...options
    };

    cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
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

async function validateTemplateForPublishing(template) {
  const errors = [];
  const warnings = [];

  // Check required dynamic fields
  const dynamicFields = template.dynamicFields || {};
  const designElements = template.designConfig?.elements || [];

  if (dynamicFields.studentName && dynamicFields.studentName.required) {
    const hasStudentNameField = designElements.some(el => 
      el.fieldType === 'studentName'
    );
    if (!hasStudentNameField) {
      errors.push('Student name field is required but not placed on template');
    }
  }

  if (dynamicFields.courseTitle && dynamicFields.courseTitle.required) {
    const hasCourseTitleField = designElements.some(el => 
      el.fieldType === 'courseTitle'
    );
    if (!hasCourseTitleField) {
      errors.push('Course title field is required but not placed on template');
    }
  }

  if (dynamicFields.certificateNumber && dynamicFields.certificateNumber.required) {
    const hasCertificateNumberField = designElements.some(el => 
      el.fieldType === 'certificateNumber'
    );
    if (!hasCertificateNumberField) {
      errors.push('Certificate number field is required but not placed on template');
    }
  }

  // Check for background image
  if (!template.backgroundImageUrl) {
    warnings.push('No background image set for template');
  }

  // Check if template has elements
  if (designElements.length === 0) {
    warnings.push('Template has no elements placed');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    template: {
      id: template.id,
      name: template.name,
      status: template.status
    }
  };
}

// @route   POST /api/admin/certificate-templates
// @desc    Create new certificate template
// @access  Private (Admin only)
router.post('/', authenticateToken, isAdmin,
  upload.single('backgroundImage'),
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Template name is required')
      .isLength({ min: 3, max: 255 })
      .withMessage('Name must be between 3 and 255 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must not exceed 1000 characters'),
    body('courseId')
      .optional()
      .isUUID()
      .withMessage('Valid course ID is required'),
    body('certificatePrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Certificate price must be a positive number'),
    body('designConfig')
      .optional()
      .custom((value) => {
        try {
          const config = typeof value === 'string' ? JSON.parse(value) : value;
          if (!config.canvas || !config.canvas.width || !config.canvas.height) {
            throw new Error('Canvas configuration is required');
          }
          return true;
        } catch (error) {
          throw new Error('Invalid design configuration');
        }
      }),
    body('dynamicFields')
      .optional()
      .custom((value) => {
        try {
          const fields = typeof value === 'string' ? JSON.parse(value) : value;
          if (!fields.studentName || !fields.courseTitle) {
            throw new Error('Student name and course title fields are required');
          }
          return true;
        } catch (error) {
          throw new Error('Invalid dynamic fields configuration');
        }
      })
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const {
        name,
        description,
        courseId,
        certificatePrice,
        designConfig,
        dynamicFields,
        isGlobal = false
      } = req.body;

      // Validate course if provided
      if (courseId && courseId !== '') {
        const course = await Course.findOne({ where: { id: courseId } });
        if (!course) {
          return res.status(404).json({
            success: false,
            message: 'Course not found'
          });
        }

        // Check if course already has an active template
        const existingTemplate = await CertificateTemplate.findOne({
          where: {
            courseId,
            status: 'active'
          }
        });

        if (existingTemplate) {
          return res.status(400).json({
            success: false,
            message: 'Course already has an active certificate template'
          });
        }
      }

      // Handle background image upload
      let backgroundImageUrl = null;
      let backgroundImagePublicId = null;

      if (req.file) {
        try {
          const uploadResult = await uploadToCloudinary(
            req.file.buffer, 
            'certificate-templates/backgrounds',
            {
              transformation: [
                { width: 1200, height: 850, crop: 'limit' },
                { quality: 'auto:best' }
              ]
            }
          );
          backgroundImageUrl = uploadResult.secure_url;
          backgroundImagePublicId = uploadResult.public_id;
        } catch (uploadError) {
          console.error('Background image upload error:', uploadError);
          return res.status(500).json({
            success: false,
            message: 'Failed to upload background image'
          });
        }
      }

      // Parse configurations
      const parsedDesignConfig = designConfig ? 
        (typeof designConfig === 'string' ? JSON.parse(designConfig) : designConfig) 
        : {
          canvas: {
            width: 1200,
            height: 850,
            backgroundColor: '#FFFFFF',
            backgroundImage: backgroundImageUrl
          },
          elements: []
        };

      const parsedDynamicFields = dynamicFields ?
        (typeof dynamicFields === 'string' ? JSON.parse(dynamicFields) : dynamicFields)
        : {
          studentName: { enabled: true, required: true, label: 'Student Name' },
          courseTitle: { enabled: true, required: true, label: 'Course Title' },
          completionDate: { enabled: true, required: true, label: 'Completion Date' },
          certificateNumber: { enabled: true, required: true, label: 'Certificate Number' },
          instructorName: { enabled: false, required: false, label: 'Instructor Name' },
          creditHours: { enabled: false, required: false, label: 'Credit Hours' },
          creditType: { enabled: false, required: false, label: 'Credit Type' },
          accreditationBody: { enabled: false, required: false, label: 'Accreditation Body' },
          issueDate: { enabled: false, required: false, label: 'Issue Date' },
          customFields: []
        };

      // Create template
      const template = await CertificateTemplate.create({
        name,
        description: description || '',
        courseId: courseId || null,
        certificatePrice: certificatePrice || 250.00,
        designConfig: parsedDesignConfig,
        dynamicFields: parsedDynamicFields,
        backgroundImageUrl,
        backgroundImagePublicId,
        isGlobal: !!isGlobal,
        status: 'draft',
        createdBy: req.user.id
      });

      // Generate preview
      if (backgroundImageUrl) {
        template.previewImageUrl = backgroundImageUrl;
        await template.save();
      }

      // Fetch created template with associations
      const createdTemplate = await CertificateTemplate.findOne({
        where: { id: template.id },
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'title', 'slug']
          },
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Certificate template created successfully',
        data: { template: createdTemplate }
      });

    } catch (error) {
      console.error('Create certificate template error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create certificate template'
      });
    }
  }
);

// @route   PUT /api/admin/certificate-templates/:id
// @desc    Update certificate template
// @access  Private (Admin only)
router.put('/:id',
  authenticateToken,
  isAdmin,
  upload.single('backgroundImage'),
  [
    param('id').isUUID().withMessage('Valid certificate template ID is required'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage('Name must be between 3 and 255 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must not exceed 1000 characters'),
    body('courseId')
      .optional()
      .isUUID()
      .withMessage('Valid course ID is required'),
    body('certificatePrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Certificate price must be a positive number'),
    body('isGlobal')
      .optional()
      .isBoolean()
      .withMessage('isGlobal must be a boolean value'),
    body('designConfig')
      .optional()
      .custom((value) => {
        try {
          const config = typeof value === 'string' ? JSON.parse(value) : value;
          if (!config.canvas || !config.canvas.width || !config.canvas.height) {
            throw new Error('Canvas configuration is required');
          }
          return true;
        } catch (error) {
          throw new Error('Invalid design configuration');
        }
      })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const {
        name,
        description,
        courseId,
        certificatePrice,
        isGlobal,
        designConfig,
        dynamicFields
      } = req.body;

      // Find the template
      const template = await CertificateTemplate.findOne({
        where: { id }
      });

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Certificate template not found'
        });
      }

      const updateData = {};

      // Update basic fields
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (certificatePrice !== undefined) updateData.certificatePrice = certificatePrice;
      if (isGlobal !== undefined) updateData.isGlobal = isGlobal;

      // Handle course assignment
      if (courseId !== undefined) {
        if (courseId === '') {
          updateData.courseId = null;
        } else {
          const course = await Course.findOne({ where: { id: courseId } });
          if (!course) {
            return res.status(404).json({
              success: false,
              message: 'Course not found'
            });
          }
          updateData.courseId = courseId;
        }
      }

      // Handle background image upload
      if (req.file) {
        try {
          if (template.backgroundImagePublicId) {
            await cloudinary.uploader.destroy(template.backgroundImagePublicId);
          }

          const uploadResult = await uploadToCloudinary(
            req.file.buffer, 
            'certificate-templates/backgrounds',
            {
              transformation: [
                { width: 1200, height: 850, crop: 'limit' },
                { quality: 'auto:best' }
              ]
            }
          );

          updateData.backgroundImageUrl = uploadResult.secure_url;
          updateData.backgroundImagePublicId = uploadResult.public_id;
          updateData.previewImageUrl = uploadResult.secure_url;
        } catch (uploadError) {
          console.error('Background image upload error:', uploadError);
          return res.status(500).json({
            success: false,
            message: 'Failed to upload background image'
          });
        }
      }

      // Handle design config update
      if (designConfig) {
        try {
          const currentDesignConfig = template.designConfig || {};
          const newDesignConfig = typeof designConfig === 'string' ? JSON.parse(designConfig) : designConfig;
          
          const mergedConfig = {
            ...currentDesignConfig,
            ...newDesignConfig,
            canvas: {
              ...currentDesignConfig.canvas,
              ...newDesignConfig.canvas,
              backgroundImage: newDesignConfig.canvas?.backgroundImage || currentDesignConfig.canvas?.backgroundImage
            }
          };

          updateData.designConfig = mergedConfig;
        } catch (e) {
          return res.status(400).json({
            success: false,
            message: 'Invalid design configuration format'
          });
        }
      }

      // Handle dynamic fields update
      if (dynamicFields) {
        try {
          const currentDynamicFields = template.dynamicFields || {};
          const newDynamicFields = typeof dynamicFields === 'string' ? JSON.parse(dynamicFields) : dynamicFields;
          const mergedDynamicFields = { ...currentDynamicFields, ...newDynamicFields };
          updateData.dynamicFields = mergedDynamicFields;
        } catch (e) {
          return res.status(400).json({
            success: false,
            message: 'Invalid dynamic fields format'
          });
        }
      }

      // Update the template
      await template.update(updateData);

      // Fetch updated template with associations
      const updatedTemplate = await CertificateTemplate.findOne({
        where: { id },
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'title', 'slug']
          },
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      });

      res.json({
        success: true,
        message: 'Certificate template updated successfully',
        data: { template: updatedTemplate }
      });

    } catch (error) {
      console.error('Update certificate template error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update certificate template'
      });
    }
  }
);

// @route   GET /api/admin/certificate-templates/:id
// @desc    Get single certificate template by ID with full details
// @access  Private (Admin only)
router.get('/:id', authenticateToken, isAdmin,
  [
    param('id').isUUID().withMessage('Valid certificate template ID is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;

      const template = await CertificateTemplate.findOne({
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
            as: 'creator',
            attributes: ['id', 'firstName', 'lastName']
          },
          {
            model: StudentCertificate,
            as: 'issuedCertificates',
            attributes: ['id', 'studentName', 'issuedAt', 'certificateNumber', 'status'],
            limit: 5,
            order: [['issuedAt', 'DESC']]
          }
        ]
      });

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Certificate template not found'
        });
      }

      // UPDATED: Get issued certificates count from StudentCertificate
      const issuedCount = await StudentCertificate.count({
        where: { templateId: id }
      });

      // Get template statistics using the new method
      const templateStats = await template.getStats();

      const templateWithStats = {
        ...template.toJSON(),
        issuedCount,
        stats: templateStats
      };

      res.json({
        success: true,
        data: { template: templateWithStats }
      });

    } catch (error) {
      console.error('Get certificate template error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch certificate template'
      });
    }
  }
);

// @route   GET /api/admin/certificate-templates
// @desc    Get all certificate templates with filters and pagination
// @access  Private (Admin only)
router.get('/', authenticateToken, isAdmin,
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const offset = (page - 1) * limit;
      const search = req.query.search || '';
      const courseId = req.query.courseId || '';
      const status = req.query.status || '';
      const isGlobal = req.query.isGlobal;

      const whereConditions = {};
      
      // Search functionality
      if (search) {
        whereConditions[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      // Filter by course
      if (courseId) {
        whereConditions.courseId = courseId;
      }

      // Filter by status
      if (status) {
        whereConditions.status = status;
      }

      // Filter by global templates
      if (isGlobal !== undefined) {
        whereConditions.isGlobal = isGlobal === 'true';
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
              attributes: ['id', 'firstName', 'lastName']
            }
          ]
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName']
        }
      ];

      const { count, rows: templates } = await CertificateTemplate.findAndCountAll({
        where: whereConditions,
        include: includeOptions,
        order: [['createdAt', 'DESC']],
        limit,
        offset,
        distinct: true
      });

      // UPDATED: Get issued certificate counts from StudentCertificate
      const templatesWithStats = await Promise.all(
        templates.map(async (template) => {
          const issuedCount = await StudentCertificate.count({
            where: { templateId: template.id }
          });

          const templateStats = await template.getStats();

          return {
            ...template.toJSON(),
            issuedCount,
            stats: templateStats
          };
        })
      );

      const totalPages = Math.ceil(count / limit);

      // Calculate comprehensive statistics
      const totalTemplates = await CertificateTemplate.count();
      const activeTemplates = await CertificateTemplate.count({ 
        where: { status: 'active' } 
      });
      const draftTemplates = await CertificateTemplate.count({ 
        where: { status: 'draft' } 
      });
      const archivedTemplates = await CertificateTemplate.count({ 
        where: { status: 'archived' } 
      });
      
      // UPDATED: Count templates with issued certificates from StudentCertificate
      const templatesWithIssued = await CertificateTemplate.count({
        include: [{
          model: StudentCertificate,
          as: 'issuedCertificates',
          required: true
        }]
      });

      const templatesWithoutIssued = totalTemplates - templatesWithIssued;

      const stats = {
        totalCertificates: totalTemplates,
        activeCertificates: activeTemplates,
        draftCertificates: draftTemplates,
        archivedCertificates: archivedTemplates,
        certificatesWithIssued: templatesWithIssued,
        certificatesWithoutIssued: templatesWithoutIssued
      };

      res.json({
        success: true,
        data: {
          templates: templatesWithStats,
          stats: stats,
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
      console.error('Get certificate templates error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch certificate templates'
      });
    }
  }
);

// @route   PUT /api/admin/certificate-templates/:id/design
// @desc    Update template design (elements, positions, etc.)
// @access  Private (Admin only)
router.put('/:id/design', authenticateToken, isAdmin,
  [
    param('id').isUUID().withMessage('Valid template ID is required'),
    body('elements')
      .isArray()
      .withMessage('Elements must be an array'),
    body('canvas')
      .optional()
      .isObject()
      .withMessage('Canvas must be an object')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { elements, canvas } = req.body;

      const template = await CertificateTemplate.findOne({
        where: { id, createdBy: req.user.id }
      });

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found or access denied'
        });
      }

      const designConfig = template.designConfig || {};
      
      if (elements) designConfig.elements = elements;
      if (canvas) designConfig.canvas = { ...designConfig.canvas, ...canvas };

      await template.update({
        designConfig,
        version: template.version + 1
      });

      res.json({
        success: true,
        message: 'Template design updated successfully',
        data: { template }
      });

    } catch (error) {
      console.error('Update template design error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update template design'
      });
    }
  }
);

// @route   POST /api/admin/certificate-templates/:id/elements
// @desc    Add new element to template
// @access  Private (Admin only)
router.post('/:id/elements', authenticateToken, isAdmin,
  [
    param('id').isUUID().withMessage('Valid template ID is required'),
    body('type')
      .isIn(['text', 'image', 'shape', 'dynamic-field'])
      .withMessage('Element type must be text, image, shape, or dynamic-field'),
    body('position')
      .isObject()
      .withMessage('Position is required'),
    body('position.x').isFloat({ min: 0, max: 100 }).withMessage('X position must be between 0-100'),
    body('position.y').isFloat({ min: 0, max: 100 }).withMessage('Y position must be between 0-100')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const elementData = req.body;

      const template = await CertificateTemplate.findOne({
        where: { id, createdBy: req.user.id }
      });

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found or access denied'
        });
      }

      const newElement = {
        id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: elementData.type,
        position: elementData.position,
        style: elementData.style || {},
        content: elementData.content || '',
        fieldType: elementData.fieldType,
        ...elementData
      };

      await template.addElement(newElement);

      res.json({
        success: true,
        message: 'Element added successfully',
        data: { element: newElement, template }
      });

    } catch (error) {
      console.error('Add element error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add element'
      });
    }
  }
);

// @route   PUT /api/admin/certificate-templates/:id/elements/:elementId
// @desc    Update specific element
// @access  Private (Admin only)
router.put('/:id/elements/:elementId', authenticateToken, isAdmin,
  [
    param('id').isUUID().withMessage('Valid template ID is required'),
    param('elementId').notEmpty().withMessage('Element ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id, elementId } = req.params;
      const updates = req.body;

      const template = await CertificateTemplate.findOne({
        where: { id, createdBy: req.user.id }
      });

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found or access denied'
        });
      }

      await template.updateElement(elementId, updates);

      res.json({
        success: true,
        message: 'Element updated successfully',
        data: { template }
      });

    } catch (error) {
      console.error('Update element error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update element'
      });
    }
  }
);

// @route   DELETE /api/admin/certificate-templates/:id/elements/:elementId
// @desc    Remove element from template
// @access  Private (Admin only)
router.delete('/:id/elements/:elementId', authenticateToken, isAdmin,
  [
    param('id').isUUID().withMessage('Valid template ID is required'),
    param('elementId').notEmpty().withMessage('Element ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id, elementId } = req.params;

      const template = await CertificateTemplate.findOne({
        where: { id, createdBy: req.user.id }
      });

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found or access denied'
        });
      }

      await template.removeElement(elementId);

      res.json({
        success: true,
        message: 'Element removed successfully',
        data: { template }
      });

    } catch (error) {
      console.error('Remove element error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to remove element'
      });
    }
  }
);

// @route   POST /api/admin/certificate-templates/:id/preview
// @desc    Generate preview with sample data
// @access  Private (Admin only)
router.post('/:id/preview', authenticateToken, isAdmin,
  [
    param('id').isUUID().withMessage('Valid template ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { sampleData } = req.body;

      const template = await CertificateTemplate.findOne({
        where: { id }
      });

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      // Sample data for preview
      const defaultSampleData = {
        studentName: "John Michael Smith",
        courseTitle: "Advanced Medical Certification Course",
        completionDate: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        certificateNumber: "CERT-2024-ABC123XYZ",
        instructorName: "Dr. Sarah Johnson, MD",
        creditHours: "8.5",
        creditType: "CME",
        accreditationBody: "American Medical Association",
        issueDate: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      };

      const finalSampleData = { ...defaultSampleData, ...sampleData };

      const previewData = {
        template: template.toJSON(),
        sampleData: finalSampleData,
        previewUrl: template.previewImageUrl || template.backgroundImageUrl
      };

      res.json({
        success: true,
        message: 'Preview generated successfully',
        data: previewData
      });

    } catch (error) {
      console.error('Generate preview error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate preview'
      });
    }
  }
);

// @route   POST /api/admin/certificate-templates/:id/publish
// @desc    Publish template (make it active)
// @access  Private (Admin only)
router.post('/:id/publish', authenticateToken, isAdmin,
  [
    param('id').isUUID().withMessage('Valid template ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      const template = await CertificateTemplate.findOne({
        where: { id, createdBy: req.user.id }
      });

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found or access denied'
        });
      }

      // Use the enhanced validation method from the model
      const validation = template.validateForPublishing();
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Template validation failed',
          errors: validation.errors,
          warnings: validation.warnings
        });
      }

      await template.activate();

      res.json({
        success: true,
        message: 'Template published successfully',
        data: { template }
      });

    } catch (error) {
      console.error('Publish template error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to publish template'
      });
    }
  }
);

// @route   POST /api/admin/certificate-templates/:id/archive
// @desc    Archive template
// @access  Private (Admin only)
router.post('/:id/archive', authenticateToken, isAdmin,
  [
    param('id').isUUID().withMessage('Valid template ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      const template = await CertificateTemplate.findOne({
        where: { id, createdBy: req.user.id }
      });

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found or access denied'
        });
      }

      await template.archive();

      res.json({
        success: true,
        message: 'Template archived successfully',
        data: { template }
      });

    } catch (error) {
      console.error('Archive template error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to archive template'
      });
    }
  }
);

// @route   GET /api/admin/certificate-templates/:id/validation
// @desc    Validate template before publishing
// @access  Private (Admin only)
router.get('/:id/validation', authenticateToken, isAdmin,
  [
    param('id').isUUID().withMessage('Valid template ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      const template = await CertificateTemplate.findOne({
        where: { id }
      });

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      const validation = template.validateForPublishing();

      res.json({
        success: true,
        data: validation
      });

    } catch (error) {
      console.error('Template validation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to validate template'
      });
    }
  }
);

// @route   GET /api/admin/certificate-templates/:id/stats
// @desc    Get template statistics
// @access  Private (Admin only)
router.get('/:id/stats', authenticateToken, isAdmin,
  [
    param('id').isUUID().withMessage('Valid template ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      const template = await CertificateTemplate.findOne({
        where: { id }
      });

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      const stats = await template.getStats();

      res.json({
        success: true,
        data: { stats }
      });

    } catch (error) {
      console.error('Get template stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch template statistics'
      });
    }
  }
);

module.exports = router;