const express = require('express');
const { body, param, validationResult } = require('express-validator');
const {Quiz, Question, Answer, User, Course, QuizAttempt, Section} = require('../models');
const { authenticateToken, isInstructor } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Helper function to handle validation errors
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

// @route   POST /api/instructors/quiz
// @desc    Create a new quiz
// @access  Private (Instructor only)
router.post('/quiz',
  authenticateToken,
  isInstructor,
  [
    body('courseId')
        .isUUID()
        .withMessage('Valid course ID is required'),
    body('sectionId') // ADD SECTION ID VALIDATION
        .isUUID()
        .withMessage('Valid section ID is required'),
    body('title')
        .trim()
        .isLength({ min: 3, max: 255 })
        .withMessage('Title must be between 3 and 255 characters'),
    body('timeLimit')
        .isInt({ min: 1 })
        .withMessage('Time limit must be a positive integer (minutes)'),
    body('passingScore')
        .isFloat({ min: 0, max: 100 })
        .withMessage('Passing score must be between 0 and 100'),
    body('maxAttempts')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Max attempts must be a positive integer'),
    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { courseId, sectionId, title, description, timeLimit, passingScore, maxAttempts, isActive } = req.body;
      const instructorId = req.user.id;

      // Verify the course belongs to the instructor
      const course = await Course.findOne({
        where: { 
          id: courseId, 
          instructorId: instructorId,
        }
      });

      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found or you do not have permission to add quizzes to this course'
        });
      }

      // VERIFY SECTION BELONGS TO COURSE
      const section = await Section.findOne({
        where: { 
          id: sectionId,
          courseId: courseId
        }
      });

      if (!section) {
        return res.status(404).json({
          success: false,
          message: 'Section not found or does not belong to this course'
        });
      }

      // Create the quiz
      const quiz = await Quiz.create({
        courseId,
        sectionId, // ADD SECTION ID
        instructorId,
        title: title.trim(),
        description: description ? description.trim() : null,
        timeLimit,
        passingScore,
        maxAttempts: maxAttempts || null,
        isActive: isActive !== undefined ? isActive : true
      });

      // Get the quiz with course and section information
      const quizWithDetails = await Quiz.findByPk(quiz.id, {
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'title', 'slug']
          },
          {
            model: Section, // INCLUDE SECTION
            as: 'section',
            attributes: ['id', 'title']
          },
          {
            model: Question,
            as: 'questions',
            attributes: ['id']
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Quiz created successfully',
        data: {
          id: quizWithDetails.id,
          title: quizWithDetails.title,
          description: quizWithDetails.description,
          timeLimit: quizWithDetails.timeLimit,
          passingScore: quizWithDetails.passingScore,
          maxAttempts: quizWithDetails.maxAttempts,
          isActive: quizWithDetails.isActive,
          sectionId: quizWithDetails.sectionId, // INCLUDE SECTION ID IN RESPONSE
          questionsCount: quizWithDetails.questions.length,
          course: quizWithDetails.course,
          section: quizWithDetails.section, // INCLUDE SECTION IN RESPONSE
          createdAt: quizWithDetails.createdAt
        }
      });

    } catch (error) {
      console.error('Create quiz error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create quiz'
      });
    }
  }
);

// @route   GET /api/instructors/quiz
// @desc    Get all quizzes for the instructor
// @access  Private (Instructor only)
router.get('/quiz',
  authenticateToken,
  isInstructor,
  async (req, res) => {
    try {
      const instructorId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const courseId = req.query.courseId || '';
      const search = req.query.search || '';

      const where = { instructorId };
      
      if (courseId) {
        where.courseId = courseId;
      }

      if (search) {
        where[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { count, rows: quizzes } = await Quiz.findAndCountAll({
        where,
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'title', 'slug']
          },
          {
            model: Question,
            as: 'questions',
            attributes: ['id', 'points'],
            include: [
              {
                model: Answer,
                as: 'answers',
                attributes: ['id']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
        distinct: true
      });

      // Calculate statistics for each quiz
      const quizzesWithStats = await Promise.all(
        quizzes.map(async (quiz) => {
          const questionsCount = quiz.questions.length;
          const totalMarks = quiz.questions.reduce((sum, question) => sum + (question.points || 0), 0);
          
          // Get attempt statistics
          const totalAttempts = await QuizAttempt.count({
            where: { quizId: quiz.id }
          });

          const completedAttempts = await QuizAttempt.count({
            where: { 
              quizId: quiz.id,
              completedAt: { [Op.not]: null }
            }
          });

          const passedAttempts = await QuizAttempt.count({
            where: { 
              quizId: quiz.id,
              completedAt: { [Op.not]: null },
              score: { [Op.gte]: quiz.passingScore }
            }
          });

          return {
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            timeLimit: quiz.timeLimit,
            passingScore: quiz.passingScore,
            maxAttempts: quiz.maxAttempts,
            isActive: quiz.isActive,
            questionsCount,
            totalMarks,
            course: quiz.course,
            stats: {
              totalAttempts,
              completedAttempts,
              passedAttempts,
              passRate: completedAttempts > 0 ? Math.round((passedAttempts / completedAttempts) * 100) : 0
            },
            createdAt: quiz.createdAt,
            updatedAt: quiz.updatedAt
          };
        })
      );

      const totalPages = Math.ceil(count / limit);

      res.json({
        success: true,
        data: {
          quizzes: quizzesWithStats,
          pagination: {
            currentPage: page,
            totalPages,
            totalQuizzes: count,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        }
      });

    } catch (error) {
      console.error('Get instructor quizzes error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get quizzes'
      });
    }
  }
);

// @route   GET /api/instructors/quiz/course/:courseId
// @desc    Get all quizzes for a course (with section info)
// @access  Private (Instructor only)
router.get('/quiz/course/:courseId',
  authenticateToken,
  isInstructor,
  [
    param('courseId')
        .isUUID()
        .withMessage('Valid Course ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { courseId } = req.params;
      const instructorId = req.user.id;

      // Verify course ownership
      const course = await Course.findOne({
        where: { 
          id: courseId, 
          instructorId: instructorId 
        }
      });

      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      const quizzes = await Quiz.findAll({
        where: { courseId: courseId },
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'title', 'slug']
          },
          {
            model: Section, // INCLUDE SECTION
            as: 'section',
            attributes: ['id', 'title', 'sortOrder']
          },
          {
            model: Question,
            as: 'questions',
            attributes: ['id'],
            include: [
              {
                model: Answer,
                as: 'answers',
                attributes: ['id']
              }
            ]
          }
        ],
        order: [
          [{ model: Section, as: 'section' }, 'sortOrder', 'ASC'],
          ['createdAt', 'ASC']
        ]
      });

      res.json({
        success: true,
        data: {
          quizzes: quizzes.map(quiz => ({
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            timeLimit: quiz.timeLimit,
            passingScore: quiz.passingScore,
            maxAttempts: quiz.maxAttempts,
            isActive: quiz.isActive,
            sectionId: quiz.sectionId,
            section: quiz.section,
            questionsCount: quiz.questions.length,
            totalPoints: quiz.questions.reduce((sum, q) => sum + (q.points || 0), 0),
            createdAt: quiz.createdAt,
            updatedAt: quiz.updatedAt
          }))
        }
      });

    } catch (error) {
      console.error('Get course quizzes error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get course quizzes'
      });
    }
  }
);

// @route   GET /api/instructors/quiz/section/:sectionId
// @desc    Get all quizzes for a section
// @access  Private (Instructor only)
router.get('/quiz/section/:sectionId',
  authenticateToken,
  isInstructor,
  [
    param('sectionId')
        .isUUID()
        .withMessage('Valid Section ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { sectionId } = req.params;
      const instructorId = req.user.id;

      // Verify section ownership through course
      const section = await Section.findOne({
        where: { id: sectionId },
        include: [{
          model: Course,
          as: 'course',
          where: { instructorId: instructorId }
        }]
      });

      if (!section) {
        return res.status(404).json({
          success: false,
          message: 'Section not found or unauthorized'
        });
      }

      const quizzes = await Quiz.findAll({
        where: { sectionId: sectionId },
        include: [
          {
            model: Question,
            as: 'questions',
            attributes: ['id'],
            include: [
              {
                model: Answer,
                as: 'answers',
                attributes: ['id']
              }
            ]
          }
        ],
        order: [['createdAt', 'ASC']]
      });

      res.json({
        success: true,
        data: {
          quizzes: quizzes.map(quiz => ({
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            timeLimit: quiz.timeLimit,
            passingScore: quiz.passingScore,
            maxAttempts: quiz.maxAttempts,
            isActive: quiz.isActive,
            questionsCount: quiz.questions.length,
            totalPoints: quiz.questions.reduce((sum, q) => sum + (q.points || 0), 0),
            createdAt: quiz.createdAt,
            updatedAt: quiz.updatedAt
          }))
        }
      });

    } catch (error) {
      console.error('Get section quizzes error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get section quizzes'
      });
    }
  }
);

// @route   PUT /api/instructors/quiz/:quizId
// @desc    Update quiz
// @access  Private (Instructor only)
router.put('/quiz/:quizId',
  authenticateToken,
  isInstructor,
  [
    param('quizId').isUUID().withMessage('Valid quiz ID is required'),
    body('courseId').optional().isUUID().withMessage('Valid course ID is required'),
    body('sectionId').optional().isUUID().withMessage('Valid section ID is required'), // ADD SECTION ID VALIDATION
    body('title').optional().trim().isLength({ min: 3, max: 255 }).withMessage('Title must be between 3 and 255 characters'),
    body('description').optional().isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
    body('timeLimit').optional().isInt({ min: 1 }).withMessage('Time limit must be a positive integer (minutes)'),
    body('passingScore').optional().isFloat({ min: 0, max: 100 }).withMessage('Passing score must be between 0 and 100'),
    body('maxAttempts').optional().isInt({ min: 1 }).withMessage('Max attempts must be a positive integer'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { quizId } = req.params;
      const instructorId = req.user.id;
      const updateData = req.body;

      // Find the quiz
      const quiz = await Quiz.findOne({
        where: { id: quizId, instructorId }
      });

      if (!quiz) {
        return res.status(404).json({
          success: false,
          message: 'Quiz not found'
        });
      }

      // If courseId is being updated, verify the new course belongs to instructor
      if (updateData.courseId) {
        const course = await Course.findOne({
          where: { 
            id: updateData.courseId, 
            instructorId: instructorId
          }
        });

        if (!course) {
          return res.status(404).json({
            success: false,
            message: 'Course not found or you do not have permission'
          });
        }
      }

      // If sectionId is being updated, verify the section belongs to the course
      if (updateData.sectionId) {
        const section = await Section.findOne({
          where: { 
            id: updateData.sectionId
          },
          include: [{
            model: Course,
            as: 'course',
            where: { instructorId: instructorId }
          }]
        });

        if (!section) {
          return res.status(404).json({
            success: false,
            message: 'Section not found or does not belong to your courses'
          });
        }

        // If courseId is not being updated, use the section's courseId
        if (!updateData.courseId) {
          updateData.courseId = section.courseId;
        } else if (updateData.courseId !== section.courseId) {
          return res.status(400).json({
            success: false,
            message: 'Section does not belong to the specified course'
          });
        }
      }

      // If courseId is being updated but sectionId is not, verify the current section belongs to new course
      if (updateData.courseId && !updateData.sectionId) {
        const currentSection = await Section.findOne({
          where: { 
            id: quiz.sectionId,
            courseId: updateData.courseId 
          }
        });

        if (!currentSection) {
          return res.status(400).json({
            success: false,
            message: 'Current section does not belong to the new course. Please update sectionId as well.'
          });
        }
      }

      // Check if quiz has attempts (limit some updates)
      const hasAttempts = await QuizAttempt.count({
        where: { quizId: quiz.id }
      }) > 0;

      if (hasAttempts) {
        // If quiz has attempts, prevent certain changes that could affect scoring
        const restrictedFields = ['passingScore', 'sectionId', 'courseId']; // ADD SECTIONID AND COURSEID TO RESTRICTED
        const attemptedRestricted = restrictedFields.filter(field => updateData.hasOwnProperty(field));
        
        if (attemptedRestricted.length > 0) {
          return res.status(400).json({
            success: false,
            message: `Cannot modify ${attemptedRestricted.join(', ')} - quiz has existing attempts`
          });
        }
      }

      // Clean the update data
      const allowedFields = ['courseId', 'sectionId', 'title', 'description', 'timeLimit', 'passingScore', 'maxAttempts', 'isActive']; // ADD SECTIONID
      const cleanedData = {};
      
      allowedFields.forEach(field => {
        if (updateData.hasOwnProperty(field)) {
          cleanedData[field] = updateData[field];
        }
      });

      // Trim string fields
      if (cleanedData.title) cleanedData.title = cleanedData.title.trim();
      if (cleanedData.description) cleanedData.description = cleanedData.description.trim();

      // Update the quiz
      await quiz.update(cleanedData);

      // Get updated quiz with relations
      const updatedQuiz = await Quiz.findByPk(quiz.id, {
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'title', 'slug']
          },
          {
            model: Section, // INCLUDE SECTION
            as: 'section',
            attributes: ['id', 'title']
          },
          {
            model: Question,
            as: 'questions',
            attributes: ['id', 'points']
          }
        ]
      });

      const totalMarks = updatedQuiz.questions.reduce((sum, question) => sum + (question.points || 0), 0);

      res.json({
        success: true,
        message: 'Quiz updated successfully',
        data: {
          id: updatedQuiz.id,
          title: updatedQuiz.title,
          description: updatedQuiz.description,
          timeLimit: updatedQuiz.timeLimit,
          passingScore: updatedQuiz.passingScore,
          maxAttempts: updatedQuiz.maxAttempts,
          isActive: updatedQuiz.isActive,
          courseId: updatedQuiz.courseId,
          sectionId: updatedQuiz.sectionId, // INCLUDE SECTION ID
          course: updatedQuiz.course,
          section: updatedQuiz.section, // INCLUDE SECTION
          totalMarks,
          questionsCount: updatedQuiz.questions.length,
          createdAt: updatedQuiz.createdAt,
          updatedAt: updatedQuiz.updatedAt
        }
      });

    } catch (error) {
      console.error('Update quiz error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update quiz'
      });
    }
  }
);

// @route   DELETE /api/instructors/quiz/:quizId
// @desc    Delete quiz
// @access  Private (Instructor only)
router.delete('/quiz/:quizId',
  authenticateToken,
  isInstructor,
  [
    param('quizId').isUUID().withMessage('Valid quiz ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { quizId } = req.params;
      const instructorId = req.user.id;

      const quiz = await Quiz.findOne({
        where: { id: quizId, instructorId }
      });

      if (!quiz) {
        return res.status(404).json({
          success: false,
          message: 'Quiz not found'
        });
      }

      // Check if quiz has attempts
      const attemptCount = await QuizAttempt.count({
        where: { quizId: quiz.id }
      });

      if (attemptCount > 0) {
        // Instead of deleting, mark as inactive
        await quiz.update({ isActive: false });
        
        return res.json({
          success: true,
          message: 'Quiz has existing attempts and has been marked as inactive instead of deleted'
        });
      }

      // Delete the quiz (cascade will delete questions and answers)
      await quiz.destroy();

      res.json({
        success: true,
        message: 'Quiz deleted successfully'
      });

    } catch (error) {
      console.error('Delete quiz error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete quiz'
      });
    }
  }
);

// @route   GET /api/instructors/quiz/:quizId/results
// @desc    Get quiz results and statistics for instructor
// @access  Private (Instructor only)
router.get('/quiz/:quizId/results',
  authenticateToken,
  isInstructor,
  [
    param('quizId').isUUID().withMessage('Valid quiz ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { quizId } = req.params;
      const instructorId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      // Verify quiz belongs to instructor
      const quiz = await Quiz.findOne({
        where: { id: quizId, instructorId },
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'title']
          }
        ]
      });

      if (!quiz) {
        return res.status(404).json({
          success: false,
          message: 'Quiz not found'
        });
      }

      // Get quiz attempts with user details
      const { count, rows: attempts } = await QuizAttempt.findAndCountAll({
        where: { 
          quizId: quizId,
          completedAt: { [Op.not]: null } // Only completed attempts
        },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
          }
        ],
        order: [['completedAt', 'DESC']],
        limit,
        offset
      });

      // Calculate overall statistics
      const totalAttempts = await QuizAttempt.count({
        where: { quizId }
      });

      const completedAttempts = count;
      const passedAttempts = attempts.filter(attempt => attempt.score >= quiz.passingScore).length;
      const averageScore = attempts.length > 0 ? 
        Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length * 100) / 100 : 0;

      // Format attempts for response
      const formattedAttempts = attempts.map(attempt => ({
        id: attempt.id,
        user: {
          id: attempt.user.id,
          name: `${attempt.user.firstName} ${attempt.user.lastName}`,
          email: attempt.user.email,
          avatar: attempt.user.avatar
        },
        score: attempt.score,
        correctCount: attempt.correctCount,
        totalQuestions: attempt.totalQuestions,
        passed: attempt.score >= quiz.passingScore,
        startedAt: attempt.startedAt,
        completedAt: attempt.completedAt,
        duration: attempt.completedAt ? 
          Math.round((new Date(attempt.completedAt) - new Date(attempt.startedAt)) / (1000 * 60)) : null // in minutes
      }));

      const totalPages = Math.ceil(count / limit);

      res.json({
        success: true,
        data: {
          quiz: {
            id: quiz.id,
            title: quiz.title,
            passingScore: quiz.passingScore,
            course: quiz.course
          },
          statistics: {
            totalAttempts,
            completedAttempts,
            passedAttempts,
            passRate: completedAttempts > 0 ? Math.round((passedAttempts / completedAttempts) * 100) : 0,
            averageScore
          },
          attempts: formattedAttempts,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: count,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        }
      });

    } catch (error) {
      console.error('Get quiz results error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get quiz results'
      });
    }
  }
);

// @route   GET /api/instructors/courses
// @desc    Get instructor's courses for dropdown
// @access  Private (Instructor only)
router.get('/courses',
  authenticateToken,
  isInstructor,
  async (req, res) => {
    try {
      const instructorId = req.user.id;

      const courses = await Course.findAll({
        where: { 
          instructorId: instructorId,
          status: 'published'
        },
        attributes: ['id', 'title', 'slug'],
        order: [['title', 'ASC']]
      });

      const formattedCourses = courses.map(course => ({
        label: course.title,
        value: course.id
      }));

      res.json({
        success: true,
        data: formattedCourses
      });

    } catch (error) {
      console.error('Get instructor courses error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get courses'
      });
    }
  }
);

module.exports = router;