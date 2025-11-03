const express = require('express');
const { body, validationResult } = require('express-validator');
const { Course, Section, Lesson } = require('../models');
const { authenticateToken, isInstructor, optionalAuth } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// SECTION ROUTES

// @route   POST /api/sections
// @desc    Create new section
// @access  Private (Instructor)
router.post('/', authenticateToken, isInstructor, [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Section title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('courseId')
    .isUUID()
    .withMessage('Valid course ID is required')
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

    const { title, description, courseId } = req.body;

    // Verify course belongs to instructor
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

    // Get section count for order index
    const sectionCount = await Section.count({ where: { courseId } });

    const section = await Section.create({
      title,
      description: description || '',
      courseId,
      orderIndex: sectionCount + 1
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

// @route   GET /api/sections/:sectionId
// @desc    Get section by ID with lessons
// @access  Private (Instructor)
router.get('/:sectionId', authenticateToken, isInstructor, async (req, res) => {
  try {
    const { sectionId } = req.params;

    const section = await Section.findByPk(sectionId, {
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'instructorId'],
          where: { instructorId: req.user.id }
        },
        {
          model: Lesson,
          as: 'lessons',
          order: [['orderIndex', 'ASC']]
        }
      ]
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found or access denied'
      });
    }

    res.json({
      success: true,
      data: { section }
    });

  } catch (error) {
    console.error('Get section error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get section'
    });
  }
});

// @route   PUT /api/sections/:sectionId
// @desc    Update section
// @access  Private (Instructor)
router.put('/:sectionId', authenticateToken, isInstructor, [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters')
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

    const { sectionId } = req.params;
    const { title, description } = req.body;

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

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

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

// @route   DELETE /api/sections/:sectionId
// @desc    Delete section and all its lessons
// @access  Private (Instructor)
router.delete('/:sectionId', authenticateToken, isInstructor, async (req, res) => {
  try {
    const { sectionId } = req.params;

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

    // Delete all lessons in this section first (cascade should handle this)
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

// @route   POST /api/sections/:sectionId/duplicate
// @desc    Duplicate section with all lessons
// @access  Private (Instructor)
router.post('/:sectionId/duplicate', authenticateToken, isInstructor, async (req, res) => {
  try {
    const { sectionId } = req.params;

    // Get original section with lessons
    const originalSection = await Section.findByPk(sectionId, {
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'instructorId'],
          where: { instructorId: req.user.id }
        },
        {
          model: Lesson,
          as: 'lessons',
          order: [['orderIndex', 'ASC']]
        }
      ]
    });

    if (!originalSection) {
      return res.status(404).json({
        success: false,
        message: 'Section not found or access denied'
      });
    }

    // Get section count for order index
    const sectionCount = await Section.count({ 
      where: { courseId: originalSection.courseId } 
    });

    // Create duplicate section
    const duplicateSection = await Section.create({
      title: `${originalSection.title} (Copy)`,
      description: originalSection.description,
      courseId: originalSection.courseId,
      orderIndex: sectionCount + 1
    });

    // Duplicate all lessons
    for (const lesson of originalSection.lessons) {
      await Lesson.create({
        title: `${lesson.title} (Copy)`,
        content: lesson.content,
        videoUrl: lesson.videoUrl,
        duration: lesson.duration,
        orderIndex: lesson.orderIndex,
        isFree: lesson.isFree,
        sectionId: duplicateSection.id,
        attachments: lesson.attachments
      });
    }

    // Load duplicate section with lessons
    const sectionWithLessons = await Section.findByPk(duplicateSection.id, {
      include: [{
        model: Lesson,
        as: 'lessons',
        order: [['orderIndex', 'ASC']]
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Section duplicated successfully',
      data: { section: sectionWithLessons }
    });

  } catch (error) {
    console.error('Duplicate section error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to duplicate section'
    });
  }
});

// @route   GET /api/sections/:sectionId/lessons
// @desc    Get all lessons in a section
// @access  Private (Instructor)
router.get('/:sectionId/lessons', authenticateToken, isInstructor, async (req, res) => {
  try {
    const { sectionId } = req.params;

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

    const lessons = await Lesson.findAll({
      where: { sectionId },
      order: [['orderIndex', 'ASC']]
    });

    res.json({
      success: true,
      data: { lessons }
    });

  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get lessons'
    });
  }
});

// @route   PUT /api/sections/:sectionId/lessons/reorder
// @desc    Reorder lessons within section
// @access  Private (Instructor)
router.put('/:sectionId/lessons/reorder', authenticateToken, isInstructor, async (req, res) => {
  try {
    const { sectionId } = req.params;
    const lessonIds = req.body;

    if (!Array.isArray(lessonIds)) {
      return res.status(400).json({
        success: false,
        message: 'Lesson IDs must be an array'
      });
    }

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

    // Update order index for each lesson
    for (let i = 0; i < lessonIds.length; i++) {
      await Lesson.update(
        { sortOrder: i + 1 },
        { where: { id: lessonIds[i], sectionId } }
      );
    }

    res.json({
      success: true,
      message: 'Lessons reordered successfully'
    });

  } catch (error) {
    console.error('Reorder lessons error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder lessons'
    });
  }
});


module.exports = router;