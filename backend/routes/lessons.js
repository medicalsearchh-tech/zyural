const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { body, validationResult } = require('express-validator');
const { Course, Section, Lesson } = require('../models');
const { authenticateToken, isInstructor, optionalAuth } = require('../middleware/auth');
const { Op } = require('sequelize');

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
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files for thumbnails
    if (file.fieldname === 'thumbnail') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Thumbnail must be an image file'), false);
      }
    } else {
      cb(null, true);
    }
  }
});

// Helper function to upload image to Cloudinary
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: 'auto',
      folder: 'course-thumbnails',
      quality: 'auto:good',
      fetch_format: 'auto',
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

// LESSON ROUTES

// @route   POST /api/courses/lessons
// @desc    Create new lesson
// @access  Private (Instructor)
router.post('/', authenticateToken, isInstructor, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Lesson title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('sectionId')
    .isUUID()
    .withMessage('Valid section ID is required'),
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
      title,
      subtitle,
      text,
      videoUrl, 
      duration, 
      isFree, 
      sectionId 
    } = req.body;

    // Verify section belongs to instructor's course
    const section = await Section.findByPk(sectionId, {
      include: [{
        model: Course,
        as: 'course',
        attributes: ['id', 'instructorId'],
        where: { instructorId: req.user.id }
      }]
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found or access denied'
      });
    }

    // Handle image upload if provided
    let imageUrl = null;
    if (req.files && req.files.image) {
      try {
        const uploadResult = await uploadToCloudinary(req.files.image[0].buffer, {
          public_id: `lesson-${Date.now()}-image`,
          folder: 'lesson-images',
          resource_type: 'image', // Explicitly set as image
          allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp']
        });
        imageUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload image'
        });
      }
    }

    // Handle PDF upload if provided
    let pdfUrl = null;
    if (req.files && req.files.pdf) {
      try {
        const uploadResult = await uploadToCloudinary(req.files.pdf[0].buffer, {
          public_id: `lesson-${Date.now()}-pdf`,
          folder: 'lesson-pdfs', // Different folder for PDFs
          resource_type: 'raw', // Use 'raw' for PDFs, not 'auto'
          format: 'pdf', // Explicitly specify PDF format
          allowed_formats: ['pdf']
        });
        pdfUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error('PDF upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload PDF'
        });
      }
    }

    // Get lesson count for order index
    const lessonCount = await Lesson.count({ where: { sectionId } });

    // Parse text array if it's a string
    let textArray = [];
    if (text) {
      try {
        textArray = typeof text === 'string' ? JSON.parse(text) : text;
      } catch (e) {
        textArray = Array.isArray(text) ? text : [text];
      }
    }

    // Build lesson content
    const lessonContent = {
      title,
      subtitle: subtitle || '',
      text: textArray,
      image: imageUrl
    };

    // Build attachments array
    const attachments = [];
    if (pdfUrl && req.files.pdf) {
      attachments.push({
        id: require('crypto').randomUUID(),
        name: req.files.pdf[0].originalname,
        url: pdfUrl,
        type: 'pdf',
        size: req.files.pdf[0].size
      });
    }

    const lesson = await Lesson.create({
      title,
      content: JSON.stringify(lessonContent),
      videoUrl: videoUrl || null,
      duration: parseInt(duration) || 0,
      orderIndex: lessonCount + 1,
      isFree: isFree === 'true' || isFree === true,
      sectionId,
      attachments: JSON.stringify(attachments)
    });

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: { lesson }
    });

  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create lesson'
    });
  }
});

// @route   GET /api/courses/lessons/:lessonId
// @desc    Get lesson by ID
// @access  Private (Instructor)
router.get('/:lessonId', authenticateToken, isInstructor, async (req, res) => {
  try {
    const { lessonId } = req.params;

    const lesson = await Lesson.findByPk(lessonId, {
      include: [{
        model: Section,
        as: 'section',
        include: [{
          model: Course,
          as: 'course',
          attributes: ['id', 'instructorId'],
          where: { instructorId: req.user.id }
        }]
      }]
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found or access denied'
      });
    }

    // Parse content and attachments
    let parsedContent = {};
    let parsedAttachments = [];

    try {
      parsedContent = JSON.parse(lesson.content || '{}');
    } catch (e) {
      parsedContent = {};
    }

    try {
      parsedAttachments = JSON.parse(lesson.attachments || '[]');
    } catch (e) {
      parsedAttachments = [];
    }

    const lessonData = {
      ...lesson.toJSON(),
      parsedContent,
      parsedAttachments
    };

    res.json({
      success: true,
      data: { lesson: lessonData }
    });

  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get lesson'
    });
  }
});

// @route   PUT /api/courses/lessons/:lessonId
// @desc    Update lesson
// @access  Private (Instructor)
router.put('/:lessonId', authenticateToken, isInstructor, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
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

    const { lessonId } = req.params;
    const { 
      title,
      subtitle,
      text,
      videoUrl, 
      duration, 
      isFree 
    } = req.body;

    // Get existing lesson
    const lesson = await Lesson.findByPk(lessonId, {
      include: [{
        model: Section,
        as: 'section',
        include: [{
          model: Course,
          as: 'course',
          attributes: ['id', 'instructorId'],
          where: { instructorId: req.user.id }
        }]
      }]
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found or access denied'
      });
    }

    // Parse existing content and attachments
    let existingContent = {};
    let existingAttachments = [];
    
    try {
      existingContent = JSON.parse(lesson.content || '{}');
    } catch (e) {
      existingContent = {};
    }

    try {
      existingAttachments = JSON.parse(lesson.attachments || '[]');
    } catch (e) {
      existingAttachments = [];
    }

    // Handle image upload if provided
    let imageUrl = existingContent.image;
    if (req.files && req.files.image) {
      try {
        const uploadResult = await uploadToCloudinary(req.files.image[0].buffer, {
          public_id: `lesson-${lessonId}-image-${Date.now()}`,
          folder: 'lesson-images',
          resource_type: 'image',
          allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp']
        });
        imageUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload image'
        });
      }
    }

    // Handle PDF upload if provided
    if (req.files && req.files.pdf) {
      const pdfFile = req.files.pdf[0];
      
      // Validate it's actually a PDF
      if (!pdfFile.mimetype.includes('pdf') && !pdfFile.originalname.toLowerCase().endsWith('.pdf')) {
        return res.status(400).json({
          success: false,
          message: 'Only PDF files are allowed for attachments'
        });
      }

      try {
        const uploadResult = await uploadToCloudinary(pdfFile.buffer, {
          public_id: `lesson-${lessonId}-pdf-${Date.now()}`,
          folder: 'lesson-pdfs', // Changed from lesson-attachments
          resource_type: 'raw', // Changed from 'auto' to 'raw'
          format: 'pdf', // Explicitly specify PDF format
          allowed_formats: ['pdf']
        });

        // Add new PDF to attachments
        const newAttachment = {
          id: require('crypto').randomUUID(),
          name: pdfFile.originalname,
          url: uploadResult.secure_url,
          type: 'application/pdf', // Changed from 'pdf' to proper MIME type
          size: pdfFile.size
        };

        existingAttachments.push(newAttachment);
      } catch (uploadError) {
        console.error('PDF upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload PDF'
        });
      }
    }

    // Parse text array if provided
    let textArray = existingContent.text || [];
    if (text !== undefined) {
      try {
        textArray = typeof text === 'string' ? JSON.parse(text) : text;
      } catch (e) {
        textArray = Array.isArray(text) ? text : [text];
      }
    }

    // Build update data
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (duration !== undefined) updateData.duration = parseInt(duration) || 0;
    if (isFree !== undefined) updateData.isFree = isFree === 'true' || isFree === true;

    // Update content
    const updatedContent = {
      title: title !== undefined ? title : existingContent.title,
      subtitle: subtitle !== undefined ? subtitle : existingContent.subtitle,
      text: textArray,
      image: imageUrl
    };
    updateData.content = JSON.stringify(updatedContent);
    updateData.attachments = JSON.stringify(existingAttachments);

    await lesson.update(updateData);

    // Get updated lesson
    const updatedLesson = await Lesson.findByPk(lessonId);

    res.json({
      success: true,
      message: 'Lesson updated successfully',
      data: { lesson: updatedLesson }
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
router.delete('/:lessonId', authenticateToken, isInstructor, async (req, res) => {
  try {
    const { lessonId } = req.params;

    // Verify lesson belongs to instructor's course
    const lesson = await Lesson.findByPk(lessonId, {
      include: [{
        model: Section,
        as: 'section',
        include: [{
          model: Course,
          as: 'course',
          attributes: ['id', 'instructorId'],
          where: { instructorId: req.user.id }
        }]
      }]
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found or access denied'
      });
    }

    // Clean up attachments from Cloudinary if needed
    try {
      const attachments = JSON.parse(lesson.attachments || '[]');
      for (const attachment of attachments) {
        if (attachment.url && attachment.url.includes('cloudinary.com')) {
          // Extract public_id from Cloudinary URL for cleanup
          const publicId = attachment.url.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`lesson-attachments/${publicId}`, { resource_type: 'auto' });
        }
      }
    } catch (cleanupError) {
      console.error('Failed to cleanup attachments:', cleanupError);
    }

    // Clean up lesson image from Cloudinary if needed
    try {
      const content = JSON.parse(lesson.content || '{}');
      if (content.image && content.image.includes('cloudinary.com')) {
        const publicId = content.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`lesson-images/${publicId}`);
      }
    } catch (cleanupError) {
      console.error('Failed to cleanup lesson image:', cleanupError);
    }

    await lesson.destroy();

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

// @route   POST /api/courses/lessons/:lessonId/duplicate
// @desc    Duplicate lesson
// @access  Private (Instructor)
router.post('/:lessonId/duplicate', authenticateToken, isInstructor, async (req, res) => {
  try {
    const { lessonId } = req.params;

    // Get original lesson
    const originalLesson = await Lesson.findByPk(lessonId, {
      include: [{
        model: Section,
        as: 'section',
        include: [{
          model: Course,
          as: 'course',
          attributes: ['id', 'instructorId'],
          where: { instructorId: req.user.id }
        }]
      }]
    });

    if (!originalLesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found or access denied'
      });
    }

    // Get lesson count for order index
    const lessonCount = await Lesson.count({ 
      where: { sectionId: originalLesson.sectionId } 
    });

    // Parse and update content for duplicate
    let originalContent = {};
    try {
      originalContent = JSON.parse(originalLesson.content || '{}');
    } catch (e) {
      originalContent = {};
    }

    const duplicateContent = {
      ...originalContent,
      title: `${originalContent.title || originalLesson.title} (Copy)`
    };

    const duplicateLesson = await Lesson.create({
      title: `${originalLesson.title} (Copy)`,
      content: JSON.stringify(duplicateContent),
      videoUrl: originalLesson.videoUrl,
      duration: originalLesson.duration,
      orderIndex: lessonCount + 1,
      isFree: originalLesson.isFree,
      sectionId: originalLesson.sectionId,
      attachments: originalLesson.attachments // Copy attachments as-is (references same files)
    });

    res.status(201).json({
      success: true,
      message: 'Lesson duplicated successfully',
      data: { lesson: duplicateLesson }
    });

  } catch (error) {
    console.error('Duplicate lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to duplicate lesson'
    });
  }
});

// @route   POST /api/courses/lessons/:lessonId/attachments
// @desc    Upload lesson attachment
// @access  Private (Instructor)
router.post('/:lessonId/attachments', authenticateToken, isInstructor, upload.single('attachment'), async (req, res) => {
  try {
    const { lessonId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Verify lesson belongs to instructor's course
    const lesson = await Lesson.findByPk(lessonId, {
      include: [{
        model: Section,
        as: 'section',
        include: [{
          model: Course,
          as: 'course',
          attributes: ['id', 'instructorId'],
          where: { instructorId: req.user.id }
        }]
      }]
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found or access denied'
      });
    }

    // Upload attachment to Cloudinary
    let attachmentUrl;
    try {
      const uploadResult = await uploadToCloudinary(req.file.buffer, {
        public_id: `lesson-${lessonId}-attachment-${Date.now()}`,
        folder: 'lesson-attachments',
        resource_type: 'auto'
      });
      attachmentUrl = uploadResult.secure_url;
    } catch (uploadError) {
      console.error('Attachment upload error:', uploadError);
      return res.status(500).json({
        success: false,
        message: 'Failed to upload attachment'
      });
    }

    // Parse existing attachments
    let attachments = [];
    try {
      attachments = JSON.parse(lesson.attachments || '[]');
    } catch (e) {
      attachments = [];
    }

    // Add new attachment
    const newAttachment = {
      id: require('crypto').randomUUID(),
      name: req.file.originalname,
      url: attachmentUrl,
      type: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date().toISOString()
    };

    attachments.push(newAttachment);

    // Update lesson
    await lesson.update({
      attachments: JSON.stringify(attachments)
    });

    res.status(201).json({
      success: true,
      message: 'Attachment uploaded successfully',
      data: { attachment: newAttachment }
    });

  } catch (error) {
    console.error('Upload attachment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload attachment'
    });
  }
});

// @route   DELETE /api/courses/lessons/:lessonId/attachments/:attachmentId
// @desc    Delete lesson attachment
// @access  Private (Instructor)
router.delete('/:lessonId/attachments/:attachmentId', authenticateToken, isInstructor, async (req, res) => {
  try {
    const { lessonId, attachmentId } = req.params;

    // Verify lesson belongs to instructor's course
    const lesson = await Lesson.findByPk(lessonId, {
      include: [{
        model: Section,
        as: 'section',
        include: [{
          model: Course,
          as: 'course',
          attributes: ['id', 'instructorId'],
          where: { instructorId: req.user.id }
        }]
      }]
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found or access denied'
      });
    }

    // Parse existing attachments
    let attachments = [];
    try {
      attachments = JSON.parse(lesson.attachments || '[]');
    } catch (e) {
      attachments = [];
    }

    // Find attachment to delete
    const attachmentIndex = attachments.findIndex(att => att.id === attachmentId);
    if (attachmentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Attachment not found'
      });
    }

    const attachmentToDelete = attachments[attachmentIndex];

    // Remove from Cloudinary if it's a Cloudinary URL
    if (attachmentToDelete.url && attachmentToDelete.url.includes('cloudinary.com')) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = attachmentToDelete.url.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = `lesson-attachments/${publicIdWithExtension.split('.')[0]}`;
        
        await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' });
      } catch (cloudinaryError) {
        console.error('Failed to delete from Cloudinary:', cloudinaryError);
        // Continue with database cleanup even if Cloudinary cleanup fails
      }
    }

    // Remove from attachments array
    attachments.splice(attachmentIndex, 1);

    // Update lesson
    await lesson.update({
      attachments: JSON.stringify(attachments)
    });

    res.json({
      success: true,
      message: 'Attachment deleted successfully'
    });

  } catch (error) {
    console.error('Delete attachment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete attachment'
    });
  }
});

module.exports = router;