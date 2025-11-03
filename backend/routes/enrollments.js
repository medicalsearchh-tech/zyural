const express = require('express');
const { body, validationResult } = require('express-validator');
const { Enrollment, Course, User, Section, Lesson, Progress } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/enrollments
// @desc    Enroll in a course
// @access  Private
router.post('/', authenticateToken, [
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

    const { courseId } = req.body;
    const userId = req.user.id;

    // Check if course exists and is published
    const course = await Course.findOne({
      where: { id: courseId, status: 'published' }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or not available'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      where: { userId, courseId }
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      userId,
      courseId,
      enrolledAt: new Date(),
      lastAccessedAt: new Date()
    });

    // Update course enrollment count
    await course.increment('totalEnrollments');

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: { enrollment }
    });

  } catch (error) {
    console.error('Enroll course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enroll in course'
    });
  }
});

// @route   GET /api/enrollments
// @desc    Get user enrollments
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: { userId: req.user.id, isActive: true },
      include: [
        {
          model: Course,
          as: 'course',
          include: [
            {
              model: User,
              as: 'instructor',
              attributes: ['firstName', 'lastName', 'avatar']
            },
            {
              model: Section,
              as: 'sections',
              include: [
                {
                  model: Lesson,
                  as: 'lessons',
                  attributes: ['id', 'title', 'duration', 'isFree']
                }
              ]
            }
          ]
        }
      ],
      order: [['lastAccessedAt', 'DESC']]
    });

    res.json({
      success: true,
      data: { enrollments }
    });

  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get enrollments'
    });
  }
});

module.exports = router;