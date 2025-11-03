const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { body, validationResult } = require('express-validator');
const { Course, User, Category, Section, Lesson, Enrollment, Review, Quiz, Specialty, SyllabusDocument, Notification } = require('../models');
const { authenticateToken, isInstructor, optionalAuth } = require('../middleware/auth');
const { Op } = require('sequelize');
const { sequelize } = require('../models');
const { sendEmail } = require('../utils/email');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  fileFilter: (req, file, cb) => {
    const allowedDocs = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (file.fieldname === 'heroImage' || file.fieldname === 'image') {
      if (file.mimetype.startsWith('image/')) cb(null, true);
      else cb(new Error('Thumbnail must be an image'), false);
    } else if (file.fieldname === 'content') {
      // allow PDFs, videos, docs
      if (file.mimetype.startsWith('video/') || allowedDocs.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid content file type'), false);
      }
    } else {
      cb(null, true); // default allow
    }
  }
});

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    // Detect if file is a document or raw file
    const format = options.format?.toLowerCase();
    const isDocument = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(format);
    const isVideo = options.resource_type === 'video';
    const isImage = options.resource_type === 'image';

    // Choose proper resource type
    let resourceType = 'auto';
    if (isDocument) resourceType = 'auto';
    else if (isVideo) resourceType = 'video';
    else if (isImage) resourceType = 'image';

    const uploadOptions = {
      folder: options.folder || 'course-data',
      public_id: options.public_id,
      access_mode: options.access_mode || 'public',
      type: options.type || 'upload',
      resource_type: resourceType,
      format: options.format,
      quality: options.quality,
      fetch_format: options.fetch_format,
      transformation: options.transformation,
    };

    const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });

    uploadStream.end(buffer);
  });
};

// Helper function to delete from Cloudinary
const deleteFromCloudinary = (publicId, options = {}) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, options, (error, result) => {
      if (error) {
        console.error('Cloudinary delete error:', error);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

// Helper function to delete multiple files from Cloudinary
const deleteMultipleFromCloudinary = (publicIds, options = {}) => {
  return new Promise((resolve, reject) => {
    cloudinary.api.delete_resources(publicIds, options, (error, result) => {
      if (error) {
        console.error('Cloudinary delete multiple error:', error);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

// Helper function to extract and delete images from text content
async function deleteTextContentImages(textContent) {
  try {
    // Parse HTML content to extract image URLs
    const imageUrls = extractImageUrlsFromHtml(textContent);
    
    // Extract Cloudinary public IDs from URLs
    const publicIds = imageUrls.map(url => extractPublicIdFromUrl(url)).filter(id => id);
    
    if (publicIds.length > 0) {
      console.log(`#############Deleting ${publicIds.length} images from text content`);
      
      // Delete all images from Cloudinary
      const deleteResults = await deleteMultipleFromCloudinary(publicIds);
      console.log('Cloudinary deletion results:', deleteResults);
    }
  } catch (error) {
    console.warn('Error deleting text content images:', error);
    // Don't throw error - continue with lesson deletion even if image deletion fails
  }
}

// Helper function to extract image URLs from HTML content
function extractImageUrlsFromHtml(htmlContent) {
  const imageUrls = [];
  
  if (!htmlContent) return imageUrls;

  // Simple regex to find img tags
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  let match;
  
  while ((match = imgRegex.exec(htmlContent)) !== null) {
    if (match[1]) {
      imageUrls.push(match[1]);
    }
  }
  
  return imageUrls;
}

// Helper function to extract Cloudinary public ID from URL
function extractPublicIdFromUrl(imageUrl) {
  try {
    // Cloudinary URL pattern: https://res.cloudinary.com/cloudname/image/upload/v123456789/public_id.jpg
    const url = new URL(imageUrl);
    const pathSegments = url.pathname.split('/');
    
    // Find the index of 'upload' and get everything after it
    const uploadIndex = pathSegments.indexOf('upload');
    if (uploadIndex !== -1 && uploadIndex + 1 < pathSegments.length) {
      // Join all segments after 'upload' and remove file extension
      const publicIdWithVersion = pathSegments.slice(uploadIndex + 1).join('/');
      
      // Remove version prefix (v123456789/) if present
      const versionRegex = /^v\d+\//;
      const publicId = publicIdWithVersion.replace(versionRegex, '');
      
      return publicId;
    }
  } catch (error) {
    console.warn('Error extracting public ID from URL:', imageUrl, error);
  }
  
  return null;
}


// Helper function to validate YouTube URL
const validateYouTubeUrl = (url) => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  return youtubeRegex.test(url);
};

// Helper function to validate Vimeo URL
const validateVimeoUrl = (url) => {
  const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com\/)([0-9]+)/;
  return vimeoRegex.test(url);
};

// Helper function to extract video ID from URL
const extractVideoId = (url, type) => {
  if (type === 'youtube') {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  } else if (type === 'vimeo') {
    const match = url.match(/vimeo\.com\/([0-9]+)/);
    return match ? match[1] : null;
  }
  return null;
};


// @route   GET /api/courses
// @desc    Get all courses with filters (optimized response)
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const level = req.query.level || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'DESC';

    const where = { status: 'published' };
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { subtitle: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    if (category) {
      where.categoryId = category;
    }
    
    if (level) {
      where.level = level;
    }

    const { count, rows: courses } = await Course.findAndCountAll({
      where,
      attributes: [
        'id', 'title', 'slug', 'subtitle', 'description', 'heroImageUrl', 'level',
        'pricing', 'averageRating', 'totalReviews', 'totalEnrollments', 'createdAt',
        'accreditedCreditHours', 'accreditedCreditType'
      ],
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'firstName', 'lastName', 'avatar', 'bio']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: Section,
          as: 'sections',
          attributes: ['id'],
          include: [
            {
              model: Lesson,
              as: 'lessons',
              attributes: ['id', 'duration', 'title']
            }
          ]
        }
      ],
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      distinct: true
    });

    // Calculate total duration and lessons for each course
    const coursesWithStats = courses.map(course => {
      const totalLessons = course.sections.reduce((sum, section) => sum + section.lessons.length, 0);
      const totalDuration = course.sections.reduce((sum, section) => 
        sum + section.lessons.reduce((lessonSum, lesson) => lessonSum + (lesson.duration || 0), 0), 0
      );

      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        subtitle: course.subtitle,
        description: course.description,
        heroImageUrl: course.heroImageUrl,
        level: course.level,
        pricing: course.pricing,
        averageRating: course.averageRating,
        totalReviews: course.totalReviews,
        totalEnrollments: course.totalEnrollments,
        accreditedCreditHours: course.accreditedCreditHours,
        accreditedCreditType: course.accreditedCreditType,
        instructor: {
          id: course.instructor.id,
          firstName: course.instructor.firstName,
          lastName: course.instructor.lastName,
          avatar: course.instructor.avatar,
          bio: course.instructor.bio
        },
        category: {
          id: course.category.id,
          name: course.category.name,
          slug: course.category.slug
        },
        stats: {
          totalLessons,
          totalDuration, 
          sectionsCount: course.sections.length
        }
      };
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        courses: coursesWithStats,
        pagination: {
          currentPage: page,
          totalPages,
          totalCourses: count,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get courses'
    });
  }
});

// @route   GET /api/courses/:slug
// @desc    Get course by slug
// @access  Public
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const { slug } = req.params;

    const course = await Course.findOne({
      where: { slug, status: 'published' },
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'firstName', 'lastName', 'avatar', 'bio']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: Section,
          as: 'sections',
          include: [
            {
              model: Lesson,
              as: 'lessons',
            }
          ],
          order: [['sortOrder', 'ASC']]
        },
         {
          model: Quiz,
          as: 'quizzes',
          where: { isActive: true },
          required: false,
          attributes: ['id', 'title', 'description', 'timeLimit', 'passingScore', 'maxAttempts', 'sectionId']
        },
        {
          model: Review,
          as: 'reviews',
          where: { isApproved: true },
          required: false,
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'avatar']
            }
          ],
          limit: 10,
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is enrolled (if authenticated and is a student)
    let isEnrolled = false;
    let userProgress = null;

    if (req.user && req.user.role === 'student') {
      const enrollment = await Enrollment.findOne({
        where: { 
          userId: req.user.id, 
          courseId: course.id,
          isActive: true 
        }
      });

      if (enrollment) {
        isEnrolled = true;
        userProgress = {
          progressPercentage: enrollment.progressPercentage,
          completedAt: enrollment.completedAt,
          lastAccessedAt: enrollment.lastAccessedAt
        };
      }
    }

    // Order sections and lessons
    course.sections.forEach(section => {
      section.lessons.sort((a, b) => a.sortOrder - b.sortOrder);
    });
    course.sections.sort((a, b) => a.sortOrder - b.sortOrder);

    // Calculate course statistics
    const totalLessons = course.sections.reduce((sum, section) => sum + section.lessons.length, 0);
    const totalDuration = course.sections.reduce((sum, section) => 
      sum + section.lessons.reduce((lessonSum, lesson) => lessonSum + (lesson.duration || 0), 0), 0
    );
    const freeLessons = course.sections.reduce((sum, section) => 
      sum + section.lessons.filter(lesson => lesson.isFree).length, 0
    );

    const courseData = {
      ...course.toJSON(),
      isEnrolled,
      userProgress,
      stats: {
        totalLessons,
        totalDuration,
        sectionsCount: course.sections.length,
        freeLessons,
        reviewsCount: course.reviews.length
      }
    };

    res.json({
      success: true,
      data: { course: courseData }
    });

  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get course'
    });
  }
});

// @route   POST /api/courses
// @desc    Create new course (Step 1: Basics)
// @access  Private (Instructor)
//******/
router.post('/', authenticateToken, isInstructor, upload.single('heroImage'), [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Course title is required')
    .isLength({ min: 3, max: 120 })
    .withMessage('Title must be between 3 and 120 characters'),
  body('language')
    .notEmpty()
    .withMessage('Language is required'),
  body('learningObjectives')
    .trim()
    .notEmpty()
    .withMessage('Learning objectives are required')
], async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      title, subtitle, categoryId, specialtyId, level,
      language, duration, learningObjectives, targetAudience,
      conflictOfInterest, promoVideo
    } = req.body;

    // Generate unique slug
    let slug = title.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    const existingCourse = await Course.findOne({ where: { slug } });
    if (existingCourse) {
      slug = `${slug}-${Date.now()}`;
    }
    

    // Handle hero image upload
    let heroImageData = null;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, {
        folder: 'heroImage',
        public_id: `course-hero-${Date.now()}`,
        transformation: [{ width: 1200, height: 675, crop: "fill", quality: "auto:good" }]
      });
      
      heroImageData = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    }

    const course = await Course.create({
      title,
      slug,
      subtitle: subtitle || null,
      categoryId,
      specialtyId: specialtyId || null,
      level: level || 'beginner',
      language,
      duration: parseInt(duration) || 0,
      learningObjectives,
      targetAudience: typeof targetAudience === 'string' ? JSON.parse(targetAudience) : (targetAudience || []),
      conflictOfInterest: typeof conflictOfInterest === 'string' ? JSON.parse(conflictOfInterest) : conflictOfInterest,
      heroImageUrl: heroImageData?.url || null,
      heroImagePublicId: heroImageData?.publicId || null,
      promoVideo: promoVideo || null,
      status: 'draft',
      instructorId: req.user.id,
      pricing: {
        price: 0,
        currency: 'USD',
        accessType: 'one-time-purchase',
        visibility: 'public',
        certificatePice: 0
      },
      seoSettings: {
        metaTitle: title,
        metaDescription: subtitle || '',
        keywords: []
      }
    });

    const newCourse = await Course.findByPk(course.id, {
      include: [
        { model: User, as: 'instructor', attributes: ['id', 'firstName', 'lastName', 'avatar'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: { course: newCourse }
    });

  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create course'
    });
  }
});

// @route   PUT /api/courses/:courseId/basics
// @desc    Update course basics
// @access  Private (Instructor)
//******/
router.put('/:courseId/basics', authenticateToken, isInstructor, upload.single('heroImage'), async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findOne({
      where: { id: courseId, instructorId: req.user.id }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or unauthorized'
      });
    }

    if (course.status === 'submitted') {
      return res.status(400).json({
        success: false,
        message: 'Cannot edit course while under review'
      });
    }

    const {
      title, subtitle, categoryId, specialtyId, level,
      language, duration, learningObjectives, targetAudience,
      conflictOfInterest, promoVideo
    } = req.body;

    const updateData = {
      title,
      subtitle: subtitle || null,
      categoryId,
      specialtyId: specialtyId || null,
      level: level || 'beginner',
      language,
      duration: parseInt(duration) || 0,
      learningObjectives,
      targetAudience: typeof targetAudience === 'string' ? JSON.parse(targetAudience) : (targetAudience || []),
      conflictOfInterest: typeof conflictOfInterest === 'string' ? JSON.parse(conflictOfInterest) : conflictOfInterest,
      promoVideo: promoVideo || null
    };

    // Handle new hero image upload
    if (req.file) {
      // Delete old image if exists
      if (course.heroImagePublicId) {
        try {
          await deleteFromCloudinary(course.heroImagePublicId);
        } catch (deleteError) {
          console.warn('Failed to delete old hero image:', deleteError);
          // Continue with upload even if delete fails
        }
      }
      
      const uploadResult = await uploadToCloudinary(req.file.buffer, {
        folder: 'heroImage',
        public_id: `course-hero-updated-${courseId}-${Date.now()}`,
        transformation: [{ width: 1200, height: 675, crop: "fill", quality: "auto:good" }]
      });
      
      updateData.heroImageUrl = uploadResult.secure_url;
      updateData.heroImagePublicId = uploadResult.public_id;
    }

    await course.update(updateData);

    const updatedCourse = await Course.findByPk(course.id, {
      include: [
        { model: User, as: 'instructor', attributes: ['id', 'firstName', 'lastName', 'avatar'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }
      ]
    });

    res.json({
      success: true,
      message: 'Course basics updated successfully',
      data: { course: updatedCourse }
    });

  } catch (error) {
    console.error('Update course basics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update course basics'
    });
  }
});

// @route   GET /api/courses/:courseId/syllabus
// @desc    Get course syllabus with sections and lessons
// @access  Private (Instructor)
//******/
router.get('/:courseId/syllabus', authenticateToken, isInstructor, async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findOne({
      where: { id: courseId, instructorId: req.user.id },
      include: [{
        model: Section,
        as: 'sections',
        include: [{
          model: Lesson,
          as: 'lessons',
          order: [['sortOrder', 'ASC']]
        }],
        order: [['sortOrder', 'ASC']]
      }]
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or unauthorized'
      });
    }

    res.json({
      success: true,
      data: { 
        courseId: course.id,
        sections: course.sections,
        reviewFeedback: course.reviewFeedback,
        status: course.status
      }
    });

  } catch (error) {
    console.error('Get syllabus error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get course syllabus'
    });
  }
});

// @route   PUT /api/courses/:courseId/syllabus
// @desc    Update course syllabus structure
// @access  Private (Instructor)
//******/
router.put('/:courseId/syllabus', authenticateToken, isInstructor, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { sections } = req.body;

    const course = await Course.findOne({
      where: { id: courseId, instructorId: req.user.id }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or unauthorized'
      });
    }

    if (course.status === 'submitted') {
      return res.status(400).json({
        success: false,
        message: 'Cannot edit course while under review'
      });
    }

    // Update sections order and basic info
    for (const sectionData of sections) {
      if (sectionData.id) {
        await Section.update(
          { 
            title: sectionData.title,
            sortOrder: sectionData.sortOrder 
          },
          { where: { id: sectionData.id, courseId } }
        );
      }
    }

    res.json({
      success: true,
      message: 'Syllabus updated successfully'
    });

  } catch (error) {
    console.error('Update syllabus error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update syllabus'
    });
  }
});

// @route   POST /api/courses/:courseId/upload-syllabus
// @desc    Upload and parse syllabus document
// @access  Private (Instructor)
//******/
router.post('/:courseId/upload-syllabus', 
  authenticateToken, 
  isInstructor, 
  upload.single('syllabusDocument'), 
  async (req, res) => {
    try {
      const { courseId } = req.params;
      
      // Verify course ownership
      const course = await Course.findOne({
        where: { id: courseId, instructorId: req.user.id }
      });

      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found or unauthorized'
        });
      }

      if (course.status === 'submitted' || course.status === 'approved' || course.status === 'published') {
        return res.status(400).json({
          success: false,
          message: 'Cannot upload document while course is under review or published'
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No document uploaded'
        });
      }

      console.log('Received file:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid file type. Only PDF, DOC, and DOCX are allowed.'
        });
      }
      // Detect extension and MIME
      const originalExtension = req.file.originalname.split('.').pop().toLowerCase();

      // Upload document to Cloudinary
      const uploadResult = await uploadToCloudinary(req.file.buffer, {
        resource_type: 'raw',
        folder: `syllabus-documents/${courseId}`,
        public_id: `syllabus-${courseId}-${Date.now()}`,
        access_mode: 'public',
        type: 'upload',
        format: originalExtension, // Keep the file’s true extension
      });

      console.log('Cloudinary upload result:', {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        resourceType: uploadResult.resource_type
      });

      const syllabusDoc = await SyllabusDocument.create({
        courseId: courseId,
        instructorId: req.user.id,
        originalFileName: req.file.originalname,
        fileUrl: uploadResult.secure_url,
        filePublicId: uploadResult.public_id,
        fileSize: req.file.size,
        fileType: originalExtension,
        mimeType: req.file.mimetype,
        processingStatus: 'processing'
      });

      console.log('SyllabusDocument created:', syllabusDoc.id);

      // TODO: Implement actual document parsing logic
      // For now, we'll create a basic structure based on file analysis
      // You can integrate PDF parsing libraries like pdf-parse or mammoth (for DOCX) here
      
      let extractedStructure = null;
      let parsedSections = [];

      try {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Basic structure extraction (placeholder)
        extractedStructure = {
          totalPages: 1,
          sections: [
            {
              title: `Section from ${req.file.originalname}`,
              pageNumber: 1,
              content: 'Extracted content will appear here',
              lessons: []
            }
          ]
        };

        // Create sections structure for frontend
        parsedSections = extractedStructure.sections.map((section, index) => ({
          id: null, // Will be created when saved
          title: section.title,
          description: section.content?.substring(0, 200) || '',
          orderIndex: index,
          lectures: section.lessons?.map((lesson, lIndex) => ({
            id: null,
            title: lesson.title || `Lesson ${lIndex + 1}`,
            type: 'text',
            content: lesson.content || '',
            duration: lesson.duration || 0,
            isFreePreview: false,
            orderIndex: lIndex
          })) || []
        }));

        // Update document with extracted data
        await syllabusDoc.update({
          processingStatus: 'completed',
          processedAt: new Date(),
          extractedStructure: extractedStructure,
          documentMetadata: {
            pageCount: extractedStructure.totalPages,
            wordCount: 0,
            language: 'en'
          }
        });

        console.log('Document processing completed');

      } catch (parseError) {
        console.error('Document parsing error:', parseError);
        
        await syllabusDoc.update({
          processingStatus: 'failed',
          processingError: parseError.message
        });

        return res.status(500).json({
          success: false,
          message: 'Failed to parse document',
          error: parseError.message
        });
      }

      res.json({
        success: true,
        message: 'Document processed successfully',
        data: {
          documentId: syllabusDoc.id,
          sections: parsedSections,
          metadata: {
            fileName: req.file.originalname,
            fileSize: req.file.size,
            fileType: req.file.mimetype,
            uploadedAt: syllabusDoc.createdAt
          }
        }
      });

    } catch (error) {
      console.error('Upload syllabus error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process document',
        error: error.message
      });
    }
});

// @route   GET /api/courses/:courseId/syllabus-documents
// @desc    Get all uploaded syllabus documents for a course
// @access  Private (Instructor)
//******/
router.get('/:courseId/syllabus-documents',
  authenticateToken,
  isInstructor,
  async (req, res) => {
    try {
      const { courseId } = req.params;

      const course = await Course.findOne({
        where: { id: courseId, instructorId: req.user.id }
      });

      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found or unauthorized'
        });
      }

      const documents = await SyllabusDocument.findAll({
        where: { courseId },
        order: [['createdAt', 'DESC']],
        attributes: [
          'id', 'originalFileName', 'fileUrl', 'fileSize', 
          'fileType', 'processingStatus', 'isAppliedToCourse',
          'createdAt', 'processedAt'
        ]
      });

      res.json({
        success: true,
        data: { documents }
      });

    } catch (error) {
      console.error('Get syllabus documents error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get syllabus documents'
      });
    }
});

// @route   POST /api/courses/media
// @desc    Upload image for Syncfusion Rich Text Editor
// @access  Private (Instructor)
//******/
router.post('/media', 
  authenticateToken, 
  isInstructor,
  upload.single('image'), // Syncfusion uses 'upload' as field name
  async (req, res) => {
    try {
      console.log('Upload request received:', {
        file: req.file ? {
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size
        } : 'No file',
        body: req.body,
        headers: req.headers
      });

      if (!req.file) {
        return res.status(400).json({
          error: {
            message: 'No file uploaded'
          }
        });
      }

      // Validate file type
      if (!req.file.mimetype.startsWith('image/')) {
        return res.status(400).json({
          error: { message: 'Invalid file type. Only images are allowed.' }
        });
      }

      // Upload to Cloudinary
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const publicId = `course-content/images/lecture-${timestamp}-${randomString}`;

      const uploadResult = await uploadToCloudinary(req.file.buffer, {
        public_id: publicId,
        folder: 'text-content/images',
        resource_type: 'image',
        quality: 'auto:good'
      });

      // Syncfusion expects this specific response format
      const responseData = {
        // Syncfusion required fields
        message: 'File uploaded successfully',
        file: {
          url: uploadResult.secure_url,
          name: req.file.originalname,
          size: req.file.size,
          type: req.file.mimetype
        },
        // Your custom fields
        success: true,
        data: {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id
        }
      };

      console.log('Sending response:', responseData);
      res.json(responseData);

    } catch (error) {
      console.error('Image upload error:', error);
      res.status(500).json({
        error: {
          message: 'Failed to upload image'
        }
      });
    }
  }
);

// @route   DELETE /api/courses/:courseId/syllabus-documents/:documentId
// @desc    Delete a syllabus document
// @access  Private (Instructor)
//******/
router.delete('/:courseId/syllabus-documents/:documentId', authenticateToken, isInstructor, async (req, res) => {
  try {
    const { courseId, documentId } = req.params;
    // Verify the instructor owns the course
    const course = await Course.findOne({
      where: { id: courseId, instructorId: req.user.id }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or unauthorized'
      });
    }
    // Find the document
    const document = await SyllabusDocument.findOne({
      where: { id: documentId, courseId }
    });
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    // Delete from Cloudinary if publicId exists
    if (document.filePublicId) {
      try {
        await deleteFromCloudinary(document.filePublicId);
      } catch (cloudinaryError) {
        console.warn('Failed to delete from Cloudinary:', cloudinaryError);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }
    // Delete from database
    await document.destroy();

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Delete syllabus document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete document'
    });
  }
});

// @route   POST /api/courses/sections
// @desc    Create new section
// @access  Private (Instructor)
//******/
router.post('/sections', authenticateToken, isInstructor, [
  body('courseId').isUUID().withMessage('Valid course ID is required'),
  body('title').trim().notEmpty().withMessage('Section title is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { courseId, title, description } = req.body;

    // Verify course ownership
    const course = await Course.findOne({
      where: { id: courseId, instructorId: req.user.id }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or unauthorized'
      });
    }

    // Get next sort order
    const maxOrder = await Section.max('sortOrder', { 
      where: { courseId } 
    });

    const section = await Section.create({
      courseId,
      title,
      description: description || null,
      sortOrder: (maxOrder || 0) + 1
    });

    res.status(201).json({
      success: true,
      message: 'Section created successfully',
      data: { section }
    });

  } catch (error) {
    console.error('Create section error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create section'
    });
  }
});

// @route   PUT /api/courses/sections/:sectionId
// @desc    Update section
// @access  Private (Instructor)
//******/
router.put('/sections/:sectionId', authenticateToken, isInstructor, async (req, res) => {
  try {
    const { sectionId } = req.params;
    const updateData = req.body;

    const section = await Section.findOne({
      where: { id: sectionId },
      include: [{
        model: Course,
        as: 'course',
        where: { instructorId: req.user.id }
      }]
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found or unauthorized'
      });
    }

    await section.update(updateData);

    res.json({
      success: true,
      message: 'Section updated successfully',
      data: { section }
    });

  } catch (error) {
    console.error('Update section error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update section'
    });
  }
});

// @route   DELETE /api/courses/sections/:sectionId
// @desc    Delete section and its lessons
// @access  Private (Instructor)
//******/
router.delete('/sections/:sectionId', authenticateToken, isInstructor, async (req, res) => {
  try {
    const { sectionId } = req.params;

    const section = await Section.findOne({
      where: { id: sectionId },
      include: [{
        model: Course,
        as: 'course',
        where: { instructorId: req.user.id }
      }]
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found or unauthorized'
      });
    }

    // Delete associated lessons first
    await Lesson.destroy({ where: { sectionId } });
    await section.destroy();

    res.json({
      success: true,
      message: 'Section deleted successfully'
    });

  } catch (error) {
    console.error('Delete section error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete section'
    });
  }
});

// @route   POST /api/courses/lessons
// @desc    Create new lesson
// @access  Private (Instructor)
//******/
router.post('/lessons', authenticateToken, isInstructor, upload.single('contentFile'), [
  body('sectionId').isUUID().withMessage('Valid section ID is required'),
  body('title').trim().notEmpty().withMessage('Lesson title is required'),
  body('type').isIn(['video', 'pdf', 'text', 'link']).withMessage('Valid lesson type is required') // Added 'text' type
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { sectionId, title, description, type, duration, freePreview, contentUrl, textContent } = req.body;

    // Verify section ownership through course
    const section = await Section.findOne({
      where: { id: sectionId },
      include: [{
        model: Course,
        as: 'course',
        where: { instructorId: req.user.id }
      }]
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found or unauthorized'
      });
    }

    let contentData = null;

    if (req.file && ["video", "pdf"].includes(type)) {
      const isVideo = type === "video";

      // Validate MIME type
      const allowedVideoTypes = ["video/mp4", "video/quicktime", "video/mpeg", "video/webm"];
      const allowedPdfTypes = ["application/pdf"];

      if (
        (isVideo && !allowedVideoTypes.includes(req.file.mimetype)) ||
        (!isVideo && !allowedPdfTypes.includes(req.file.mimetype))
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid file type for ${type}.`,
        });
      }

      // Upload to Cloudinary
      const uploadResult = await uploadToCloudinary(req.file.buffer, {
        public_id: `lesson-${type}-${Date.now()}`,
        resource_type: isVideo ? "video" : "auto",
        folder: `lesson-content-for/${sectionId}`,
        format: isVideo ? undefined : "pdf",
      });

      contentData = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        duration: isVideo
          ? Math.round((uploadResult.duration || duration || 0) / 60) 
          : 0,
        type: isVideo ? "video" : "pdf",
      };
    }

    // Get next sort order
    const maxOrder = await Lesson.max('sortOrder', { 
      where: { sectionId } 
    });

    // FIX 2: Include textContent in lesson creation
    const lessonData = {
      sectionId,
      title,
      description: description || null,
      type,
      duration: contentData?.duration || parseInt(duration) || 0,
      freePreview: freePreview === 'true' || freePreview === true,
      contentUrl: contentData?.url || contentUrl || null,
      contentPublicId: contentData?.publicId || null,
      textContent: type === 'text' ? textContent : null, // FIX 2: Add textContent
      sortOrder: (maxOrder || 0) + 1
    };

    const lesson = await Lesson.create(lessonData);

    // Update section statistics after lesson creation
    await updateSectionStatistics(sectionId);

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: { 
        lesson,
        // FIX 1: Return the actual content URL that was saved
        contentUrl: lesson.contentUrl 
      }
    });

  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create lesson'
    });
  }
});

// @route   PUT /api/courses/lessons/:id
// @desc    Update lesson
// @access  Private (Instructor)
//******/
router.put('/lessons/:id', authenticateToken, isInstructor, upload.single('contentFile'), [
  body('title').optional().trim().notEmpty().withMessage('Lesson title cannot be empty'),
  body('type').optional().isIn(['video', 'pdf', 'text', 'link']).withMessage('Valid lesson type is required')
], async (req, res) => {
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
    const { title, description, type, duration, freePreview, contentUrl, textContent } = req.body;

    // Find lesson and verify ownership
    const lesson = await Lesson.findOne({
      include: [{
        model: Section,
        as: 'section',
        include: [{
          model: Course,
          as: 'course',
          where: { instructorId: req.user.id }
        }]
      }],
      where: { id }
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found or unauthorized'
      });
    }

    let contentData = null;
    let oldTextContent = null;

    // Store old text content for image cleanup if type is changing from text
    if (lesson.type === 'text' && type !== 'text') {
      oldTextContent = lesson.textContent;
    }

    if (req.file && ["video", "pdf"].includes(type)) {
      const isVideo = type === "video";

      // Validate MIME type
      const allowedVideoTypes = ["video/mp4", "video/quicktime", "video/mpeg", "video/webm"];
      const allowedPdfTypes = ["application/pdf"];

      if (
        (isVideo && !allowedVideoTypes.includes(req.file.mimetype)) ||
        (!isVideo && !allowedPdfTypes.includes(req.file.mimetype))
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid file type for ${type}.`,
        });
      }

      // Delete old file if exists
      if (lesson.contentPublicId) {
        try {
          await deleteFromCloudinary(lesson.contentPublicId);
        } catch (cloudinaryError) {
          console.warn('Failed to delete old file from Cloudinary:', cloudinaryError);
        }
      }

      // Upload to Cloudinary
      const uploadResult = await uploadToCloudinary(req.file.buffer, {
        public_id: `lesson-${type}-${Date.now()}`,
        resource_type: isVideo ? "video" : "auto",
        folder: `lesson-content-for/${id}`,
        format: isVideo ? undefined : "pdf",
      });

      contentData = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        duration: isVideo
          ? Math.round((uploadResult.duration || duration || 0) / 60) 
          : 0,
        type: isVideo ? "video" : "pdf",
      };
    }

    // Prepare update data
    const updateData = {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(type && { type }),
      ...(duration !== undefined && { duration: parseInt(duration) || 0 }),
      ...(freePreview !== undefined && { freePreview: freePreview === 'true' || freePreview === true }),
      ...(contentData && { 
        contentUrl: contentData.url,
        contentPublicId: contentData.publicId
      }),
      ...(!contentData && contentUrl && { 
        contentUrl: contentUrl,
        contentPublicId: null // Reset publicId if using external URL
      }),
      textContent: type === 'text' ? textContent : (lesson.type === 'text' ? null : lesson.textContent)
    };

    // If changing from text to another type, delete old text content images
    if (oldTextContent) {
      await deleteTextContentImages(oldTextContent);
    }

    await lesson.update(updateData);
    await updateSectionStatistics(lesson.sectionId);

    res.json({
      success: true,
      message: 'Lesson updated successfully',
      data: { 
        lesson,
        contentUrl: lesson.contentUrl 
      }
    });

  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update lesson'
    });
  }
});

// @route   DELETE /api/courses/lessons/:lessonId
// @desc    Delete lesson
// @access  Private (Instructor)
//******/
router.delete('/lessons/:lessonId', authenticateToken, isInstructor, async (req, res) => {
  try {
    const { lessonId } = req.params;

    const lesson = await Lesson.findOne({
      where: { id: lessonId },
      include: [{
        model: Section,
        as: 'section',
        include: [{
          model: Course,
          as: 'course',
          where: { instructorId: req.user.id }
        }]
      }]
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found or unauthorized'
      });
    }

    const sectionId = lesson.section.id;

    // Delete Cloudinary files based on lesson type
    if (lesson.type === 'video' || lesson.type === 'pdf') {
      // Delete uploaded video/PDF file
      if (lesson.contentPublicId) {
        try {
          await deleteFromCloudinary(lesson.contentPublicId);
          console.log(`Deleted ${lesson.type} file: ${lesson.contentPublicId}`);
        } catch (cloudinaryError) {
          console.warn(`Failed to delete ${lesson.type} file from Cloudinary:`, cloudinaryError);
        }
      }
    } else if (lesson.type === 'text' && lesson.textContent) {
      // Parse text content and delete embedded images
      await deleteTextContentImages(lesson.textContent);
    }

    await lesson.destroy();
    await updateSectionStatistics(sectionId);

    res.json({
      success: true,
      message: 'Lesson deleted successfully'
    });

  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete lesson'
    });
  }
});

// @route   PUT /api/courses/:courseId/accreditation
// @desc    Update accreditation request (Step 3)
// @access  Private (Instructor/Admin)
//******/
router.put('/:courseId/accreditation', authenticateToken, isInstructor, upload.array('supportingDocuments', 5), async (req, res) => {
  try {
    const { courseId } = req.params;
    const { accreditedCreditType, accreditedCreditHours, accreditationBody, reviewerNotes, existingDocuments } = req.body;

    const course = await Course.findOne({
      where: { id: courseId, instructorId: req.user.id }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or unauthorized'
      });
    }

    // Parse existing documents from request
    let existingDocs = [];
    try {
      existingDocs = existingDocuments ? JSON.parse(existingDocuments) : [];
    } catch (e) {
      existingDocs = [];
    }

    // Get the current documents to identify which ones were removed
    const currentAccreditationRequest = course.accreditationRequest || {};
    const currentDocuments = currentAccreditationRequest.supportingDocuments || [];

    // Identify documents that were removed (exist in current but not in existingDocs)
    const removedDocuments = currentDocuments.filter(currentDoc => 
      !existingDocs.some(existingDoc => existingDoc.publicId === currentDoc.publicId)
    );

    // Delete removed documents from Cloudinary
    if (removedDocuments.length > 0) {
      for (const doc of removedDocuments) {
        if (doc.publicId) {
          try {
            await deleteFromCloudinary(doc.publicId, { resource_type: 'raw' });
            console.log(`Deleted accreditation document from Cloudinary: ${doc.publicId}`);
          } catch (cloudinaryError) {
            console.warn(`Failed to delete document from Cloudinary: ${doc.publicId}`, cloudinaryError);
            // Continue with update even if deletion fails
          }
        }
      }
    }

    // Handle new supporting documents upload
    let newDocs = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await uploadToCloudinary(file.buffer, {
          folder: `accreditation/${courseId}`,
          public_id: `accreditation-doc-${courseId}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          resource_type: 'raw'
        });
        
        newDocs.push({
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          originalName: file.originalname
        });
      }
    }

    // Combine existing documents with new uploads
    const allDocs = [...existingDocs, ...newDocs];

    const accreditationRequest = {
      creditType: accreditedCreditType || null,
      creditHours: parseFloat(accreditedCreditHours) || 0,
      accreditationBody: accreditationBody || null,
      reviewerNotes: reviewerNotes || null,
      supportingDocuments: allDocs,
      submittedAt: new Date()
    };

    await course.update({ 
      accreditedCreditType: accreditedCreditType,
      accreditedCreditHours: parseFloat(accreditedCreditHours) || 0,
      accreditationRequest 
    });

    res.json({
      success: true,
      message: 'Accreditation request updated successfully',
      data: { 
        accreditationRequest,
        deletedCount: removedDocuments.length,
        uploadedCount: newDocs.length
      }
    });

  } catch (error) {
    console.error('Update accreditation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update accreditation request'
    });
  }
});

// @route   GET /api/courses/:courseId/pricing
// @desc    Get course pricing data
// @access  Private (Instructor)
//******/
router.get('/:courseId/pricing', authenticateToken, isInstructor, async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findOne({
      where: { id: courseId, instructorId: req.user.id },
      attributes: ['id', 'pricing', 'status', 'reviewFeedback']
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or unauthorized'
      });
    }

    const pricingData = course.pricing || {
      price: 0,
      currency: 'USD',
      accessType: 'one-time',
      visibility: 'public',
      certPrice: 0
    };

    res.json({
      success: true,
      data: {
        ...pricingData,
        status: course.status,
        reviewFeedback: course.reviewFeedback
      }
    });

  } catch (error) {
    console.error('Get pricing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pricing data'
    });
  }
});

// @route   PUT /api/courses/:courseId/pricing
// @desc    Update course pricing (Step 4)
// @access  Private (Instructor)
//******/
router.put('/:courseId/pricing', authenticateToken, isInstructor, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { price, currency, accessType, visibility, certPrice } = req.body;

    const course = await Course.findOne({
      where: { id: courseId, instructorId: req.user.id }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or unauthorized'
      });
    }

    const pricing = {
      price: parseFloat(price) || 0,
      certPrice: parseFloat(certPrice) || 0,
      currency: currency || 'USD',
      accessType: accessType || 'one-time-purchase',
      visibility: visibility || 'public'
    };

    await course.update({ pricing });

    res.json({
      success: true,
      message: 'Pricing updated successfully',
      data: { pricing }
    });

  } catch (error) {
    console.error('Update pricing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update pricing'
    });
  }
});

// @route   PUT /api/courses/:courseId/seo
// @desc    Update SEO settings (Step 5)
// @access  Private (Instructor)
//******/
router.put('/:courseId/seo', authenticateToken, isInstructor, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { metaTitle, metaDescription, keywords, termsAcknowledged } = req.body;

    const course = await Course.findOne({
      where: { id: courseId, instructorId: req.user.id }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or unauthorized'
      });
    }

    const seoSettings = {
      metaTitle: metaTitle || course.title,
      metaDescription: metaDescription || course.subtitle || '',
      keywords: typeof keywords === 'string' ? keywords.split(',').map(k => k.trim()) : (keywords || []),
      termsAccepted: termsAcknowledged === true || termsAcknowledged === 'true'
    };

    await course.update({ seoSettings });

    res.json({
      success: true,
      message: 'SEO settings updated successfully',
      data: { seoSettings }
    });

  } catch (error) {
    console.error('Update SEO error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update SEO settings'
    });
  }
});

// @route   POST /api/courses/:courseId/submit-review
// @desc    Submit course for review (Step 6)
// @access  Private (Instructor)
//******/
router.post('/:courseId/submit-review', authenticateToken, isInstructor, async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findOne({
      where: { id: courseId, instructorId: req.user.id },
      include: [{
        model: Section,
        as: 'sections',
        include: [{
          model: Lesson,
          as: 'lessons'
        }]
      }]
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or unauthorized'
      });
    }

    // Validation checks
    const validationErrors = [];

    if (!course.title || !course.categoryId || !course.learningObjectives) {
      validationErrors.push('Basic course information is incomplete');
    }

    if (!course.pricing || course.pricing.price === undefined) {
      validationErrors.push('Pricing information is required');
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Course validation failed',
        errors: validationErrors
      });
    }

    // Update course status and create notification in a transaction
    await sequelize.transaction(async (t) => {
      // Update course status
      await course.update({
        status: 'submitted',
        submittedAt: new Date()
      }, { transaction: t });

      // Create notification for instructor (confirmation)
      await Notification.create({
        userId: req.user.id,
        type: 'system',
        title: 'Course Submitted for Review',
        message: `Your course "${course.title}" has been submitted for review. We'll notify you once the review is complete.`,
        link: `/instructor/instructor-course`,
        metadata: {
          courseId: course.id,
          courseTitle: course.title,
          action: 'submitted'
        },
        priority: 'normal'
      }, { transaction: t });

      // Get all admin users to notify them
      const admins = await User.findAll({
        where: { role: 'admin', isActive: true },
        attributes: ['id', 'email', 'firstName', 'lastName'],
        transaction: t
      });

      // Create notifications for all admins
      const adminNotifications = admins.map(admin => ({
        userId: admin.id,
        type: 'system',
        title: 'New Course Submission for Review',
        message: `${req.user.firstName} ${req.user.lastName} has submitted "${course.title}" for review.`,
        link: `/admin/instructor-requests`,
        metadata: {
          courseId: course.id,
          courseTitle: course.title,
          instructorId: req.user.id,
          instructorName: `${req.user.firstName} ${req.user.lastName}`,
          action: 'new_submission'
        },
        priority: 'high'
      }));

      await Notification.bulkCreate(adminNotifications, { transaction: t });
    });

    // Send confirmation email to instructor (async, don't wait)
    sendEmail({
      to: req.user.email,
      template: 'course-submitted',
      data: {
        instructorName: `${req.user.firstName} ${req.user.lastName}`,
        courseTitle: course.title,
        courseId: course.id
      }
    }).catch(error => {
      console.error('Failed to send submission confirmation email:', error);
    });

    // Send notification emails to admins (async, don't wait)
    const admins = await User.findAll({
      where: { role: 'admin', isActive: true },
      attributes: ['email', 'firstName', 'lastName']
    });

    admins.forEach(admin => {
      sendEmail({
        to: admin.email,
        template: 'admin-course-submission',
        data: {
          adminName: `${admin.firstName} ${admin.lastName}`,
          instructorName: `${req.user.firstName} ${req.user.lastName}`,
          courseTitle: course.title,
          courseId: course.id
        }
      }).catch(error => {
        console.error(`Failed to send admin notification email to ${admin.email}:`, error);
      });
    });

    res.json({
      success: true,
      message: 'Course submitted for review successfully',
      data: { 
        courseId: course.id,
        status: course.status,
        submittedAt: course.submittedAt
      }
    });

  } catch (error) {
    console.error('Submit for review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit course for review'
    });
  }
});

// @route   POST /api/courses/:courseId/resubmit-review
// @desc    Resubmit course for review after changes requested
// @access  Private (Instructor)
//******/
router.post('/:courseId/resubmit-review', authenticateToken, isInstructor, async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findOne({
      where: { id: courseId, instructorId: req.user.id },
      include: [{
        model: Section,
        as: 'sections',
        include: [{
          model: Lesson,
          as: 'lessons'
        }]
      }]
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or unauthorized'
      });
    }

    // Check if course is in changes_requested state
    if (course.status !== 'changes_requested') {
      return res.status(400).json({
        success: false,
        message: `Course cannot be resubmitted. Current status: ${course.status}`
      });
    }

    // Validation checks (same as submit)
    const validationErrors = [];

    if (!course.title || !course.categoryId || !course.learningObjectives) {
      validationErrors.push('Basic course information is incomplete');
    }

    if (!course.pricing || course.pricing.price === undefined) {
      validationErrors.push('Pricing information is required');
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Course validation failed',
        errors: validationErrors
      });
    }

    // Store previous feedback before clearing
    const previousFeedback = course.reviewFeedback;

    // Update course status and create notifications in a transaction
    await sequelize.transaction(async (t) => {
      // Update course status and clear reviewer comments
      await course.update({
        status: 'submitted',
        submittedAt: new Date(),
        reviewFeedback: null // Clear previous comments
      }, { transaction: t });

      // Create notification for instructor (confirmation)
      await Notification.create({
        userId: req.user.id,
        type: 'system',
        title: 'Course Resubmitted for Review',
        message: `Your course "${course.title}" has been resubmitted for review. Thank you for making the requested changes.`,
        link: `/instructor/instructor-course`,
        metadata: {
          courseId: course.id,
          courseTitle: course.title,
          action: 'resubmitted',
          previousFeedback: previousFeedback
        },
        priority: 'normal'
      }, { transaction: t });

      // Get all admin users to notify them about resubmission
      const admins = await User.findAll({
        where: { role: 'admin', isActive: true },
        attributes: ['id', 'email', 'firstName', 'lastName'],
        transaction: t
      });

      // Create notifications for all admins
      const adminNotifications = admins.map(admin => ({
        userId: admin.id,
        type: 'system',
        title: 'Course Resubmitted for Review',
        message: `${req.user.firstName} ${req.user.lastName} has resubmitted "${course.title}" after making requested changes.`,
        link: `/admin/instructor-requests`,
        metadata: {
          courseId: course.id,
          courseTitle: course.title,
          instructorId: req.user.id,
          instructorName: `${req.user.firstName} ${req.user.lastName}`,
          action: 'resubmission',
          previousFeedback: previousFeedback
        },
        priority: 'high'
      }));

      await Notification.bulkCreate(adminNotifications, { transaction: t });
    });

    // Send confirmation email to instructor (async, don't wait)
    sendEmail({
      to: req.user.email,
      template: 'course-resubmitted',
      data: {
        instructorName: `${req.user.firstName} ${req.user.lastName}`,
        courseTitle: course.title,
        courseId: course.id
      }
    }).catch(error => {
      console.error('Failed to send resubmission confirmation email:', error);
    });

    // Send notification emails to admins (async, don't wait)
    const admins = await User.findAll({
      where: { role: 'admin', isActive: true },
      attributes: ['email', 'firstName', 'lastName']
    });

    admins.forEach(admin => {
      sendEmail({
        to: admin.email,
        template: 'admin-course-resubmission',
        data: {
          adminName: `${admin.firstName} ${admin.lastName}`,
          instructorName: `${req.user.firstName} ${req.user.lastName}`,
          courseTitle: course.title,
          courseId: course.id
        }
      }).catch(error => {
        console.error(`Failed to send admin resubmission email to ${admin.email}:`, error);
      });
    });

    res.json({
      success: true,
      message: 'Course resubmitted for review successfully',
      data: { 
        courseId: course.id,
        status: course.status,
        submittedAt: course.submittedAt
      }
    });

  } catch (error) {
    console.error('Resubmit for review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resubmit course for review'
    });
  }
});

// @route   GET /api/courses/in/:courseId
// @desc    Get course by ID with full details
// @access  Private (Instructor)
//******/
router.get('/in/:courseId', authenticateToken, isInstructor, async (req, res) => {
  
  try {
    const { courseId } = req.params;

    const course = await Course.findOne({
      where: { id: courseId, instructorId: req.user.id },
      include: [
        { model: User, as: 'instructor', attributes: ['id', 'firstName', 'lastName', 'avatar'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: SyllabusDocument, as: 'syllabusDocuments', attributes: ['id', 'fileUrl', 'processingStatus'] },
        { model: Specialty, as: 'specialty', attributes: ['id', 'name', 'slug'] },
        {
          model: Section,
          as: 'sections',
          order: [['sortOrder', 'ASC']]
        }
      ]
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or unauthorized'
      });
    }

    res.json({
      success: true,
      data: { course }
    });

  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get course'
    });
  }
});

// @route   GET /api/courses/:courseId/status
// @desc    Get course status and review information
// @access  Private (Instructor)
//******/
router.get('/:courseId/status', authenticateToken, isInstructor, async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findOne({
      where: { id: courseId, instructorId: req.user.id },
      attributes: ['id', 'title', 'status', 'submittedAt', 'reviewFeedback', 'approvedAt', 'publishedAt']
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or unauthorized'
      });
    }

    res.json({
      success: true,
      data: { 
        courseId: course.id,
        title: course.title,
        status: course.status,
        submittedAt: course.submittedAt,
        reviewFeedback: course.reviewFeedback,
        approvedAt: course.approvedAt,
        publishedAt: course.publishedAt
      }
    });

  } catch (error) {
    console.error('Get course status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get course status'
    });
  }
});


// @route   DELETE /api/courses/:courseId
// @desc    Delete course (Instructor only)
// @access  Private (Instructor)
router.delete('/:courseId', authenticateToken, isInstructor, async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findOne({
      where: { 
        id: courseId, 
        instructorId: req.user.id 
      }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or access denied'
      });
    }

    // Delete thumbnail from Cloudinary if exists
    if (course.heroImagePublicId) {
      try {
        await cloudinary.uploader.destroy(course.heroImagePublicId);
      } catch (cloudinaryError) {
        console.error('Failed to delete thumbnail from Cloudinary:', cloudinaryError);
      }
    }

    // Delete the course (cascade will handle sections and lessons)
    await course.destroy();

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });

  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete course'
    });
  }
});

// @route   GET /api/courses/instructor/mycourses
// @desc    Get all courses of the logged-in instructor
// @access  Private (Instructor only)
router.get('/instructor/mycourses', authenticateToken, isInstructor, async (req, res) => {
  try {
    const instructorId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const status = req.query.status || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'DESC';

    // Filter only instructor's courses
    const where = { instructorId };

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { tags: { [Op.contains]: [search] } }
      ];
    }

    if (category) {
      where.categoryId = category;
    }

    if (status) {
      where.status = status;
    }

    const { count, rows: courses } = await Course.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: Section,
          as: 'sections',
          attributes: ['id', 'title', 'sortOrder'],
          include: [
            {
              model: Lesson,
              as: 'lessons',
              attributes: ['id', 'duration']
            }
          ],
          order: [['sortOrder', 'ASC']] // optional: order sections
        }
      ],
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      distinct: true
    });

    // Calculate total lessons and total duration
    const coursesWithStats = courses.map(course => {
      const totalLessons = course.sections.reduce((sum, section) => sum + section.lessons.length, 0);
      const totalDuration = course.sections.reduce(
        (sum, section) =>
          sum + section.lessons.reduce((lessonSum, lesson) => lessonSum + (lesson.duration || 0), 0),
        0
      );

      return {
        ...course.toJSON(),
        stats: {
          totalLessons,
          totalDuration,
          sectionsCount: course.sections.length
        }
      };
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        courses: coursesWithStats,
        pagination: {
          currentPage: page,
          totalPages,
          totalCourses: count,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get instructor courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get instructor courses'
    });
  }
});

// @route   GET /api/courses/instructor/mycourses/:slug
// @desc    Get course by slug for Instructor
// @access  Private (Instructor only)
router.get('/instructor/mycourses/:slug', authenticateToken, isInstructor, async (req, res) => {
  try {
    const { slug } = req.params;

    const course = await Course.findOne({
      where: { slug },
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'firstName', 'lastName', 'avatar', 'bio']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: Section,
          as: 'sections',
          include: [
            {
              model: Lesson,
              as: 'lessons',
            }
          ],
          order: [['sortOrder', 'ASC']]
        },
         {
          model: Quiz,
          as: 'quizzes',
          where: { isActive: true },
          required: false,
          attributes: ['id', 'title', 'description', 'timeLimit', 'passingScore', 'maxAttempts']
        },
        {
          model: Review,
          as: 'reviews',
          where: { isApproved: true },
          required: false,
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'avatar']
            }
          ],
          limit: 10,
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is enrolled (if authenticated and is a student)
    let isEnrolled = false;
    let userProgress = null;

    if (req.user && req.user.role === 'student') {
      const enrollment = await Enrollment.findOne({
        where: { 
          userId: req.user.id, 
          courseId: course.id,
          isActive: true 
        }
      });

      if (enrollment) {
        isEnrolled = true;
        userProgress = {
          progressPercentage: enrollment.progressPercentage,
          completedAt: enrollment.completedAt,
          lastAccessedAt: enrollment.lastAccessedAt
        };
      }
    }

    // Order sections and lessons
    course.sections.forEach(section => {
      section.lessons.sort((a, b) => a.sortOrder - b.sortOrder);
    });
    course.sections.sort((a, b) => a.sortOrder - b.sortOrder);

    // Calculate course statistics
    const totalLessons = course.sections.reduce((sum, section) => sum + section.lessons.length, 0);
    const totalDuration = course.sections.reduce((sum, section) => 
      sum + section.lessons.reduce((lessonSum, lesson) => lessonSum + (lesson.duration || 0), 0), 0
    );
    const freeLessons = course.sections.reduce((sum, section) => 
      sum + section.lessons.filter(lesson => lesson.isFree).length, 0
    );

    const courseData = {
      ...course.toJSON(),
      isEnrolled,
      userProgress,
      stats: {
        totalLessons,
        totalDuration,
        sectionsCount: course.sections.length,
        freeLessons,
        reviewsCount: course.reviews.length
      }
    };

    res.json({
      success: true,
      data: { course: courseData }
    });

  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get course'
    });
  }
});

// @route   GET /api/courses/instructor/students-list
// @desc    Get all students enrolled in instructor's courses
// @access  Private (Instructor only)
router.get('/instructor/students-list', authenticateToken, isInstructor, async (req, res) => {
  try {
    const instructorId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const courseId = req.query.courseId || ''; // Filter by specific course
    const sortBy = req.query.sortBy || 'enrolledAt';
    const sortOrder = req.query.sortOrder || 'DESC';

    // Build where clause for courses (only instructor's courses)
    const courseWhere = { instructorId };
    if (courseId) {
      courseWhere.id = courseId;
    }

    // Build where clause for users (search functionality)
    const userWhere = {};
    if (search) {
      userWhere[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Get all enrollments for instructor's courses with student details
    const { count, rows: enrollments } = await Enrollment.findAndCountAll({
      where: { isActive: true },
      include: [
        {
          model: User,
          as: 'user',
          where: userWhere,
          attributes: ['id', 'firstName', 'lastName', 'email', 'avatar', 'createdAt']
        },
        {
          model: Course,
          as: 'course',
          where: courseWhere,
          attributes: ['id', 'title', 'slug', 'heroImageUrl']
        }
      ],
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      distinct: true
    });

    // Group enrollments by student and calculate stats
    const studentMap = new Map();

    for (const enrollment of enrollments) {
      const studentId = enrollment.user.id;
      
      if (!studentMap.has(studentId)) {
        // Get all enrollments for this student in instructor's courses
        const allStudentEnrollments = await Enrollment.findAll({
          where: { userId: studentId, isActive: true },
          include: [
            {
              model: Course,
              as: 'course',
              where: { instructorId },
              attributes: ['id', 'title']
            }
          ]
        });

        // Calculate certificate count for this student
        const certificateCount = allStudentEnrollments.filter(e => e.certificateIssued).length;
        
        // Get the earliest enrollment date
        const enrollmentDates = allStudentEnrollments.map(e => new Date(e.enrolledAt));
        const earliestEnrollment = new Date(Math.min(...enrollmentDates));

        // Calculate average progress
        const totalProgress = allStudentEnrollments.reduce((sum, e) => sum + parseFloat(e.progressPercentage), 0);
        const averageProgress = allStudentEnrollments.length > 0 ? totalProgress / allStudentEnrollments.length : 0;

        studentMap.set(studentId, {
          studentId: studentId,
          fullName: `${enrollment.user.firstName} ${enrollment.user.lastName}`,
          avatar: enrollment.user.avatar,
          enrollDate: earliestEnrollment,
          progressPercentage: parseFloat(averageProgress.toFixed(2)),
          courseCount: allStudentEnrollments.length,
          certificateCount: certificateCount,
          courses: allStudentEnrollments.map(e => ({
            id: e.course.id,
            title: e.course.title,
            progress: parseFloat(e.progressPercentage),
            enrolledAt: e.enrolledAt,
            certificateIssued: e.certificateIssued
          }))
        });
      }
    }

    // Convert map to array and get unique students
    const uniqueStudents = Array.from(studentMap.values());
    
    // Get total unique students count for instructor's courses
    const totalUniqueStudents = await Enrollment.count({
      where: { isActive: true },
      include: [
        {
          model: Course,
          as: 'course',
          where: { instructorId }
        }
      ],
      distinct: true,
      col: 'userId'
    });

    // Calculate summary statistics
    const stats = {
      totalStudents: totalUniqueStudents,
      activeStudents: uniqueStudents.filter(s => s.progressPercentage > 0 && s.progressPercentage < 100).length,
      completedStudents: uniqueStudents.filter(s => s.progressPercentage === 100).length,
      newStudents: uniqueStudents.filter(s => {
        const enrollDate = new Date(s.enrollDate);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return enrollDate > thirtyDaysAgo;
      }).length,
      totalCertificatesIssued: uniqueStudents.reduce((sum, s) => sum + s.certificateCount, 0)
    };

    const totalPages = Math.ceil(totalUniqueStudents / limit);

    res.json({
      success: true,
      data: {
        studentListData: uniqueStudents,
        stats,
        pagination: {
          currentPage: page,
          totalPages,
          totalStudents: totalUniqueStudents,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get instructor students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get instructor students'
    });
  }
});

// @route   GET /api/courses/instructor/student-details/:studentId
// @desc    Get detailed information about a specific student's progress in instructor's courses
// @access  Private (Instructor only)
router.get('/instructor/student-details/:studentId', authenticateToken, isInstructor, async (req, res) => {
  try {
    const instructorId = req.user.id;
    const studentId = req.params.studentId;

    // Get student basic info
    const student = await User.findByPk(studentId, {
      attributes: ['id', 'firstName', 'lastName', 'email', 'avatar', 'createdAt']
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get all enrollments for this student in instructor's courses
    const enrollments = await Enrollment.findAll({
      where: { 
        userId: studentId,
        isActive: true 
      },
      include: [
        {
          model: Course,
          as: 'course',
          where: { instructorId },
          include: [
            {
              model: Category,
              as: 'category',
              attributes: ['name']
            }
          ]
        }
      ],
      order: [['enrolledAt', 'DESC']]
    });

    if (enrollments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not enrolled in any of your courses'
      });
    }

    // Calculate detailed statistics
    const totalProgress = enrollments.reduce((sum, e) => sum + parseFloat(e.progressPercentage), 0);
    const averageProgress = totalProgress / enrollments.length;
    const completedCourses = enrollments.filter(e => parseFloat(e.progressPercentage) === 100).length;
    const certificatesEarned = enrollments.filter(e => e.certificateIssued).length;

    const studentDetails = {
      student: {
        id: student.id,
        fullName: `${student.firstName} ${student.lastName}`,
        email: student.email,
        avatar: student.avatar,
        joinedDate: student.createdAt
      },
      stats: {
        totalCourses: enrollments.length,
        completedCourses,
        averageProgress: parseFloat(averageProgress.toFixed(2)),
        certificatesEarned,
        firstEnrollment: enrollments[enrollments.length - 1].enrolledAt,
        lastActivity: Math.max(...enrollments.map(e => new Date(e.lastAccessedAt)))
      },
      courses: enrollments.map(enrollment => ({
        id: enrollment.course.id,
        title: enrollment.course.title,
        slug: enrollment.course.slug,
        heroImageUrl: enrollment.course.heroImageUrl,
        category: enrollment.course.category.name,
        enrolledAt: enrollment.enrolledAt,
        lastAccessedAt: enrollment.lastAccessedAt,
        progressPercentage: parseFloat(enrollment.progressPercentage),
        completedAt: enrollment.completedAt,
        certificateIssued: enrollment.certificateIssued,
        certificateUrl: enrollment.certificateUrl
      }))
    };

    res.json({
      success: true,
      data: studentDetails
    });
  } catch (error) {
    console.error('Get student details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get student details'
    });
  }
});

// @route   GET /api/courses/student/enrolled-courses
// @desc    Get all enrolled courses of the logged-in student
// @access  Private (Student only)
router.get('/student/enrolled-courses', authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const status = req.query.status || ''; // 'completed', 'in-progress', 'not-started'
    const sortBy = req.query.sortBy || 'enrolledAt';
    const sortOrder = req.query.sortOrder || 'DESC';

    // Build where clause for enrollments
    const enrollmentWhere = { 
      userId: studentId,
      isActive: true
    };

    // Build where clause for courses
    const courseWhere = {};

    if (search) {
      courseWhere[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { tags: { [Op.contains]: [search] } }
      ];
    }

    if (category) {
      courseWhere.categoryId = category;
    }

    // Filter by completion status
    if (status) {
      switch (status) {
        case 'completed':
          enrollmentWhere.progressPercentage = 100;
          break;
        case 'in-progress':
          enrollmentWhere.progressPercentage = { [Op.gt]: 0, [Op.lt]: 100 };
          break;
        case 'not-started':
          enrollmentWhere.progressPercentage = 0;
          break;
      }
    }

    const { count, rows: enrollments } = await Enrollment.findAndCountAll({
      where: enrollmentWhere,
      include: [
        {
          model: Course,
          as: 'course',
          where: courseWhere,
          include: [
            {
              model: Category,
              as: 'category',
              attributes: ['id', 'name', 'slug']
            },
            {
              model: User,
              as: 'instructor',
              attributes: ['id', 'firstName', 'lastName', 'avatar']
            },
            {
              model: Section,
              as: 'sections',
              attributes: ['id', 'title', 'sortOrder'],
              include: [
                {
                  model: Lesson,
                  as: 'lessons',
                  attributes: ['id', 'duration']
                }
              ],
              order: [['sortOrder', 'ASC']]
            }
          ]
        }
      ],
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      distinct: true
    });

    // Transform data and calculate stats
    const enrolledCoursesWithStats = enrollments.map(enrollment => {
      const course = enrollment.course;
      const totalLessons = course.sections.reduce((sum, section) => sum + section.lessons.length, 0);
      const totalDuration = course.sections.reduce(
        (sum, section) =>
          sum + section.lessons.reduce((lessonSum, lesson) => lessonSum + (lesson.duration || 0), 0),
        0
      );

      return {
        enrollmentId: enrollment.id,
        enrolledAt: enrollment.enrolledAt,
        completedAt: enrollment.completedAt,
        progressPercentage: parseFloat(enrollment.progressPercentage),
        lastAccessedAt: enrollment.lastAccessedAt,
        certificateIssued: enrollment.certificateIssued,
        certificateUrl: enrollment.certificateUrl,
        course: {
          ...course.toJSON(),
          stats: {
            totalLessons,
            totalDuration,
            sectionsCount: course.sections.length
          }
        }
      };
    });

    // Calculate summary stats
    const stats = {
      total: count,
      completed: enrollments.filter(e => parseFloat(e.progressPercentage) === 100).length,
      inProgress: enrollments.filter(e => parseFloat(e.progressPercentage) > 0 && parseFloat(e.progressPercentage) < 100).length,
      notStarted: enrollments.filter(e => parseFloat(e.progressPercentage) === 0).length,
      certificatesEarned: enrollments.filter(e => e.certificateIssued).length
    };

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        enrollments: enrolledCoursesWithStats,
        stats,
        pagination: {
          currentPage: page,
          totalPages,
          totalCourses: count,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get enrolled courses'
    });
  }
});

// @route   GET /api/courses/student/enrollment-stats
// @desc    Get enrollment statistics for the logged-in student
// @access  Private (Student only)
router.get('/student/enrollment-stats', authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.id;

    const enrollments = await Enrollment.findAll({
      where: { 
        userId: studentId,
        isActive: true
      },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'pricing']
        }
      ]
    });

    const stats = {
      totalEnrolled: enrollments.length,
      completed: enrollments.filter(e => parseFloat(e.progressPercentage) === 100).length,
      inProgress: enrollments.filter(e => parseFloat(e.progressPercentage) > 0 && parseFloat(e.progressPercentage) < 100).length,
      notStarted: enrollments.filter(e => parseFloat(e.progressPercentage) === 0).length,
      certificatesEarned: enrollments.filter(e => e.certificateIssued).length,
      totalValueEnrolled: enrollments.reduce((sum, e) => sum + parseFloat(e.course.pricing.price || 0), 0),
      averageProgress: enrollments.length > 0 
        ? enrollments.reduce((sum, e) => sum + parseFloat(e.progressPercentage), 0) / enrollments.length 
        : 0
    };

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Get enrollment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get enrollment statistics'
    });
  }
});

// ADD THIS: Helper function to update section statistics
async function updateSectionStatistics(sectionId) {
  const section = await Section.findByPk(sectionId);
  if (!section) return;

  const lessons = await Lesson.findAll({
    where: { sectionId },
    attributes: ['duration', 'type']
  });

  const totalLessons = lessons.length;
  const totalDuration = lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0);
  const hasQuiz = lessons.some(lesson => lesson.type === 'quiz');

  await section.update({
    totalLessons,
    totalDuration,
    hasQuiz
  });

  // Also update course statistics
  await updateCourseStatistics(section.courseId);
}

// ADD THIS: Helper function to update course statistics
async function updateCourseStatistics(courseId) {
  const sections = await Section.findAll({
    where: { courseId }
  });

  const totalSections = sections.length;
  const totalLessons = sections.reduce((sum, section) => sum + section.totalLessons, 0);
  const totalDuration = sections.reduce((sum, section) => sum + section.totalDuration, 0);

  await Course.update({
    totalSections,
    totalLessons,
    duration: totalDuration
  }, {
    where: { id: courseId }
  });
}

module.exports = router;