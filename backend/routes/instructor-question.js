const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { Quiz, Question, Answer, User, Course } = require('../models');
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

// @route   POST /api/instructor/quiz/:quizId/questions
// @desc    Create a new question for a quiz
// @access  Private (Instructor only)
router.post('/:quizId/questions',
  authenticateToken,
  isInstructor,
  [
    param('quizId')
      .isUUID()
      .withMessage('Valid quiz ID is required'),
    body('questionText')
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Question text must be between 10 and 1000 characters'),
    body('type')
      .isIn(['multiple_choice', 'true_false'])
      .withMessage('Question type must be either multiple_choice or true_false'),
    body('points')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Points must be between 1 and 100'),
    body('answers')
      .isArray({ min: 2 })
      .withMessage('At least 2 answers are required'),
    body('answers.*.text')
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage('Answer text must be between 1 and 500 characters'),
    body('answers.*.isCorrect')
      .isBoolean()
      .withMessage('isCorrect must be a boolean value'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { quizId } = req.params;
      const { questionText, type, points = 1, order, answers } = req.body;
      const instructorId = req.user.id;

      // Verify the quiz belongs to the instructor
      const quiz = await Quiz.findOne({
        where: { 
          id: quizId, 
          instructorId: instructorId 
        }
      });

      if (!quiz) {
        return res.status(404).json({
          success: false,
          message: 'Quiz not found or you do not have permission to add questions to this quiz'
        });
      }

      // Validate answers based on question type
      if (type === 'true_false' && answers.length !== 2) {
        return res.status(400).json({
          success: false,
          message: 'True/False questions must have exactly 2 answers'
        });
      }

      if (type === 'multiple_choice' && (answers.length < 2 || answers.length > 6)) {
        return res.status(400).json({
          success: false,
          message: 'Multiple choice questions must have between 2 and 6 answers'
        });
      }

      // Check that at least one answer is correct
      const correctAnswers = answers.filter(answer => answer.isCorrect);
      if (correctAnswers.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one answer must be marked as correct'
        });
      }

      // For true/false, ensure exactly one correct answer
      if (type === 'true_false' && correctAnswers.length !== 1) {
        return res.status(400).json({
          success: false,
          message: 'True/False questions must have exactly one correct answer'
        });
      }

      // Get the next order number if not provided
      let questionOrder = order;
      if (!questionOrder) {
        const maxOrder = await Question.max('orderIndex', {
          where: { quizId: quizId }
        });
        questionOrder = (maxOrder || 0) + 1;
      }

      // Get indices of correct answers
      const correctAnswerIndices = answers
        .map((answer, index) => answer.isCorrect ? index : null)
        .filter(index => index !== null);

      // Create the question
      const question = await Question.create({
        quizId,
        question: questionText.trim(),
        type,
        points,
        orderIndex: questionOrder,
        correctAnswer: JSON.stringify(correctAnswerIndices) 
      });

      // Create the answers
      const createdAnswers = await Promise.all(
        answers.map((answer, index) => 
          Answer.create({
            questionId: question.id,
            text: answer.text.trim(),
            isCorrect: answer.isCorrect,
            userId: instructorId
          })
        )
      );

      // Return the created question with answers
      const questionWithAnswers = await Question.findByPk(question.id, {
        include: [
          {
            model: Answer,
            as: 'answers',
            order: [['order', 'ASC']]
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Question created successfully',
        data: questionWithAnswers
      });

    } catch (error) {
      console.error('Create question error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create question'
      });
    }
  }
);

// @route   GET /api/instructor/quiz/:quizId/questions
// @desc    Get all questions for a quiz
// @access  Private (Instructor only)
router.get('/:quizId/questions',
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

      // Verify the quiz belongs to the instructor
      const quiz = await Quiz.findOne({
        where: { 
          id: quizId, 
          instructorId: instructorId 
        },
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

      const { count, rows: questions } = await Question.findAndCountAll({
        where: { quizId },
        include: [
          {
            model: Answer,
            as: 'answers',
            order: [['order', 'ASC']]
          }
        ],
        order: [['orderIndex', 'ASC'], ['createdAt', 'ASC']],
        limit,
        offset,
        distinct: true
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        success: true,
        data: {
          quiz: {
            id: quiz.id,
            title: quiz.title,
            timeLimit: quiz.timeLimit,
            course: quiz.course
          },
          questions,
          pagination: {
            currentPage: page,
            totalPages,
            totalQuestions: count,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        }
      });

    } catch (error) {
      console.error('Get questions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get questions'
      });
    }
  }
);

// @route   GET /api/instructor/quiz/:quizId/questions/:questionId
// @desc    Get single question details
// @access  Private (Instructor only)
router.get('/:quizId/questions/:questionId',
  authenticateToken,
  isInstructor,
  [
    param('quizId').isUUID().withMessage('Valid quiz ID is required'),
    param('questionId').isUUID().withMessage('Valid question ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { quizId, questionId } = req.params;
      const instructorId = req.user.id;

      // Verify the quiz belongs to the instructor
      const quiz = await Quiz.findOne({
        where: { 
          id: quizId, 
          instructorId: instructorId 
        }
      });

      if (!quiz) {
        return res.status(404).json({
          success: false,
          message: 'Quiz not found'
        });
      }

      const question = await Question.findOne({
        where: { 
          id: questionId, 
          quizId: quizId 
        },
        include: [
          {
            model: Answer,
            as: 'answers',
            order: [['order', 'ASC']]
          }
        ]
      });

      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Question not found'
        });
      }

      res.json({
        success: true,
        data: question
      });

    } catch (error) {
      console.error('Get question error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get question'
      });
    }
  }
);

// @route   PUT /api/instructor/quiz/:quizId/questions/:questionId
// @desc    Update a question
// @access  Private (Instructor only)
router.put('/:quizId/questions/:questionId',
  authenticateToken,
  isInstructor,
  [
    param('quizId').isUUID().withMessage('Valid quiz ID is required'),
    param('questionId').isUUID().withMessage('Valid question ID is required'),
    body('questionText')
      .optional()
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Question text must be between 10 and 1000 characters'),
    body('type')
      .optional()
      .isIn(['multiple_choice', 'true_false'])
      .withMessage('Question type must be either multiple_choice or true_false'),
    body('points')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Points must be between 1 and 100'),
    body('answers')
      .optional()
      .isArray({ min: 2 })
      .withMessage('At least 2 answers are required'),
    body('answers.*.text')
      .optional()
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage('Answer text must be between 1 and 500 characters'),
    body('answers.*.isCorrect')
      .optional()
      .isBoolean()
      .withMessage('isCorrect must be a boolean value'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { quizId, questionId } = req.params;
      const { questionText, type, points, order, answers } = req.body;
      const instructorId = req.user.id;

      // Verify the quiz belongs to the instructor
      const quiz = await Quiz.findOne({
        where: { 
          id: quizId, 
          instructorId: instructorId 
        }
      });

      if (!quiz) {
        return res.status(404).json({
          success: false,
          message: 'Quiz not found'
        });
      }

      const question = await Question.findOne({
        where: { 
          id: questionId, 
          quizId: quizId 
        }
      });

      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Question not found'
        });
      }

      // Validate answers if provided
      if (answers) {
        if (type === 'true_false' && answers.length !== 2) {
          return res.status(400).json({
            success: false,
            message: 'True/False questions must have exactly 2 answers'
          });
        }

        if (type === 'multiple_choice' && (answers.length < 2 || answers.length > 6)) {
          return res.status(400).json({
            success: false,
            message: 'Multiple choice questions must have between 2 and 6 answers'
          });
        }

        const correctAnswers = answers.filter(answer => answer.isCorrect);
        if (correctAnswers.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'At least one answer must be marked as correct'
          });
        }

        if (type === 'true_false' && correctAnswers.length !== 1) {
          return res.status(400).json({
            success: false,
            message: 'True/False questions must have exactly one correct answer'
          });
        }
      }

      // Update question
      const updateData = {};
      if (questionText) updateData.question = questionText.trim();
      if (type) updateData.type = type;
      if (points) updateData.points = points;
      if (order) updateData.orderIndex = order;

      // Get indices of correct answers
      const correctAnswerIndices = answers
        .map((answer, index) => answer.isCorrect ? index : null)
        .filter(index => index !== null);

      await question.update(updateData);

      // Update answers if provided
      if (answers) {
        // Delete existing answers
        await Answer.destroy({
          where: { questionId: question.id }
        });

        // Create new answers
        await Promise.all(
          answers.map((answer, index) => 
            Answer.create({
              questionId: question.id,
              text: answer.text.trim(),
              isCorrect: answer.isCorrect,
              userId: instructorId
            })
          )
        );
      }

      // Get updated question with answers
      const updatedQuestion = await Question.findByPk(question.id, {
        include: [
          {
            model: Answer,
            as: 'answers',
            order: [['order', 'ASC']]
          }
        ]
      });

      res.json({
        success: true,
        message: 'Question updated successfully',
        data: updatedQuestion
      });

    } catch (error) {
      console.error('Update question error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update question'
      });
    }
  }
);

// @route   DELETE /api/instructor/quiz/:quizId/questions/:questionId
// @desc    Delete a question
// @access  Private (Instructor only)
router.delete('/:quizId/questions/:questionId',
  authenticateToken,
  isInstructor,
  [
    param('quizId').isUUID().withMessage('Valid quiz ID is required'),
    param('questionId').isUUID().withMessage('Valid question ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { quizId, questionId } = req.params;
      const instructorId = req.user.id;

      // Verify the quiz belongs to the instructor
      const quiz = await Quiz.findOne({
        where: { 
          id: quizId, 
          instructorId: instructorId 
        }
      });

      if (!quiz) {
        return res.status(404).json({
          success: false,
          message: 'Quiz not found'
        });
      }

      const question = await Question.findOne({
        where: { 
          id: questionId, 
          quizId: quizId 
        }
      });

      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Question not found'
        });
      }

      // Delete the question (cascade will delete answers)
      await question.destroy();

      res.json({
        success: true,
        message: 'Question deleted successfully'
      });

    } catch (error) {
      console.error('Delete question error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete question'
      });
    }
  }
);

// @route   PUT /api/instructor/quiz/:quizId/questions/reorder
// @desc    Reorder questions in a quiz
// @access  Private (Instructor only)
router.put('/:quizId/questions/reorder',
  authenticateToken,
  isInstructor,
  [
    param('quizId').isUUID().withMessage('Valid quiz ID is required'),
    body('questionIds')
      .isArray()
      .withMessage('Question IDs array is required'),
    body('questionIds.*')
      .isUUID()
      .withMessage('Each question ID must be a valid UUID')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { quizId } = req.params;
      const { questionIds } = req.body;
      const instructorId = req.user.id;

      // Verify the quiz belongs to the instructor
      const quiz = await Quiz.findOne({
        where: { 
          id: quizId, 
          instructorId: instructorId 
        }
      });

      if (!quiz) {
        return res.status(404).json({
          success: false,
          message: 'Quiz not found'
        });
      }

      // Verify all questions belong to this quiz
      const questions = await Question.findAll({
        where: { 
          id: { [Op.in]: questionIds },
          quizId: quizId 
        }
      });

      if (questions.length !== questionIds.length) {
        return res.status(400).json({
          success: false,
          message: 'Some questions do not belong to this quiz'
        });
      }

      // Update order for each question
      await Promise.all(
        questionIds.map((questionId, index) =>
          Question.update(
            { orderIndex: index + 1 },
            { where: { id: questionId } }
          )
        )
      );

      res.json({
        success: true,
        message: 'Questions reordered successfully'
      });

    } catch (error) {
      console.error('Reorder questions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reorder questions'
      });
    }
  }
);

module.exports = router;