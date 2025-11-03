const express = require('express');
const { body, validationResult } = require('express-validator');
const { Progress, Lesson, Section, Course, Enrollment } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/progress
// @desc    Update lesson progress
// @access  Private
router.post('/', authenticateToken, [
  body('lessonId')
    .isUUID()
    .withMessage('Valid lesson ID is required'),
  body('watchTime')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Watch time must be a positive number'),
  body('lastPosition')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Last position must be a positive number'),
  body('isCompleted')
    .optional()
    .isBoolean()
    .withMessage('Completed status must be boolean')
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

    const { lessonId, watchTime, lastPosition, isCompleted, notes } = req.body;
    const userId = req.user.id;

    // Check if lesson exists
    const lesson = await Lesson.findByPk(lessonId, {
      include: [
        {
          model: Section,
          as: 'section',
          include: [
            {
              model: Course,
              as: 'course'
            }
          ]
        }
      ]
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({
      where: {
        userId,
        courseId: lesson.section.course.id,
        isActive: true
      }
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'Not enrolled in this course'
      });
    }

    // Update or create progress
    const [progress, created] = await Progress.findOrCreate({
      where: { userId, lessonId },
      defaults: {
        watchTime: watchTime || 0,
        lastPosition: lastPosition || 0,
        isCompleted: isCompleted || false,
        notes: notes || null,
        completedAt: isCompleted ? new Date() : null
      }
    });

    if (!created) {
      await progress.update({
        ...(watchTime !== undefined && { watchTime }),
        ...(lastPosition !== undefined && { lastPosition }),
        ...(isCompleted !== undefined && { isCompleted }),
        ...(notes !== undefined && { notes }),
        ...(isCompleted && !progress.completedAt && { completedAt: new Date() }),
        ...(isCompleted === false && { completedAt: null })
      });
    }

    // Update enrollment last accessed time
    await enrollment.update({ lastAccessedAt: new Date() });

    // Calculate overall course progress
    await updateCourseProgress(userId, lesson.section.course.id);

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: { progress }
    });

  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update progress'
    });
  }
});

// Helper function to calculate course progress
async function updateCourseProgress(userId, courseId) {
  try {
    // Get all lessons in the course
    const lessons = await Lesson.findAll({
      include: [
        {
          model: Section,
          as: 'section',
          where: { courseId },
          attributes: []
        }
      ]
    });

    // Get user's progress for these lessons
    const progressRecords = await Progress.findAll({
      where: {
        userId,
        lessonId: lessons.map(lesson => lesson.id)
      }
    });

    const completedLessons = progressRecords.filter(p => p.isCompleted).length;
    const totalLessons = lessons.length;
    const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    // Update enrollment progress
    const enrollment = await Enrollment.findOne({
      where: { userId, courseId }
    });

    if (enrollment) {
      const isCompleted = progressPercentage === 100;
      await enrollment.update({
        progressPercentage: progressPercentage.toFixed(2),
        completedAt: isCompleted && !enrollment.completedAt ? new Date() : enrollment.completedAt
      });
    }

  } catch (error) {
    console.error('Update course progress error:', error);
  }
}

// @route   GET /api/progress/course/:courseId
// @desc    Get course progress
// @access  Private
router.get('/course/:courseId', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Check enrollment
    const enrollment = await Enrollment.findOne({
      where: { userId, courseId, isActive: true }
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'Not enrolled in this course'
      });
    }

    // Get all progress for this course
    const progress = await Progress.findAll({
      where: { userId },
      include: [
        {
          model: Lesson,
          as: 'lesson',
          include: [
            {
              model: Section,
              as: 'section',
              where: { courseId },
              include: [
                {
                  model: Course,
                  as: 'course',
                  attributes: ['id', 'title']
                }
              ]
            }
          ]
        }
      ]
    });

    res.json({
      success: true,
      data: {
        enrollment,
        progress
      }
    });

  } catch (error) {
    console.error('Get course progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get course progress'
    });
  }
});

module.exports = router;
