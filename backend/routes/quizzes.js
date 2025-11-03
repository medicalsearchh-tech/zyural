const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { Quiz, Question, Answer, QuizAttempt, QuizAttemptAnswer, User,Course,Enrollment } = require('../models');
const { authenticateToken, isInstructor, optionalAuth } = require('../middleware/auth');

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

// @route   POST /api/quiz/:quizId/start
// @desc    Start a new quiz session
// @access  Private
router.post('/:quizId/start',  authenticateToken, [
    param('quizId')
      .isUUID()
      .withMessage('Valid quiz ID is required') 
], handleValidationErrors,
  async (req, res) => {
    try {
      const { quizId } = req.params;
      const userId = req.user.id;

      // Check if quiz exists and is active
      const quiz = await Quiz.findOne({
        where: { id: quizId, isActive: true },
        include: [
          {
            model: Question,
            as: 'questions',
            include: [
              {
                model: Answer,
                as: 'answers',
              }
            ]
          }
        ]
      });

      if (!quiz) {
        return res.status(404).json({
          success: false,
          message: 'Quiz not found or inactive'
        });
      }

      // Check if user is enrolled in the course (if quiz belongs to a course)
      if (quiz.courseId) {
        const enrollment = await Enrollment.findOne({
          where: { 
            userId: userId, 
            courseId: quiz.courseId,
            isActive: true
          }
        });

        if (!enrollment) {
          return res.status(403).json({
            success: false,
            message: 'You must be enrolled in this course to take the quiz'
          });
        }
      }

      // Check for existing incomplete attempt
      const existingAttempt = await QuizAttempt.findOne({
        where: {
          userId: userId,
          quizId: quizId,
          completedAt: null
        }
      });

      if (existingAttempt) {
        return res.status(400).json({
          success: false,
          message: 'You have an incomplete quiz attempt. Please go to dashboard and complete it first.',
          attemptId: existingAttempt.id
        });
      }

      // Check attempt limits if configured
      if (quiz.maxAttempts) {
        const attemptCount = await QuizAttempt.count({
          where: {
            userId: userId,
            quizId: quizId,
            completedAt: { [require('sequelize').Op.not]: null }
          }
        });

        if (attemptCount >= quiz.maxAttempts) {
          return res.status(400).json({
            success: false,
            message: `Maximum attempts (${quiz.maxAttempts}) reached for this quiz`
          });
        }
      }

      // Create new quiz attempt
      const quizAttempt = await QuizAttempt.create({
        userId: userId,
        quizId: quizId,
        totalQuestions: quiz.questions.length,
        startedAt: new Date()
      });

      // Prepare questions for frontend (without correct answers)
      const questionsForFrontend = quiz.questions.map(question => ({
        id: question.id,
        questionText: question.question,
        questionType: question.questionType,
        points: question.points,
        answers: question.answers.map(answer => ({
          id: answer.id,
          Text: answer.text
          // Note: Not sending isCorrect to prevent cheating
        }))
      }));

      res.json({
        success: true,
        data: {
          attemptId: quizAttempt.id,
          quiz: {
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            timeLimit: quiz.timeLimit,
            totalQuestions: quiz.questions.length,
            passingScore: quiz.passingScore
          },
          questions: questionsForFrontend,
          startedAt: quizAttempt.startedAt
        }
      });

    } catch (error) {
      console.error('Start quiz error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to start quiz session'
      });
    }
  }
);

// @route   POST /api/quiz/:quizId/continue
// @desc    Continue an existing incomplete quiz session
// @access  Private
router.post('/:quizId/continue', authenticateToken, [
    param('quizId')
      .isUUID()
      .withMessage('Valid quiz ID is required') 
], handleValidationErrors,
  async (req, res) => {
    try {
      const { quizId } = req.params;
      const userId = req.user.id;

      // Find existing incomplete attempt
      const existingAttempt = await QuizAttempt.findOne({
        where: {
          userId: userId,
          quizId: quizId,
          completedAt: null
        }
      });

      if (!existingAttempt) {
        return res.status(404).json({
          success: false,
          message: 'No incomplete quiz attempt found'
        });
      }

      // Get the quiz with questions and answers
      const quiz = await Quiz.findOne({
        where: { id: quizId, isActive: true },
        include: [
          {
            model: Question,
            as: 'questions',
            include: [
              {
                model: Answer,
                as: 'answers',
              }
            ]
          }
        ]
      });

      if (!quiz) {
        return res.status(404).json({
          success: false,
          message: 'Quiz not found or inactive'
        });
      }

      // Get user's previous answers for this attempt
      const userAnswers = await Answer.findAll({
        where: {
          userId: userId,
          questionId: {
            [require('sequelize').Op.in]: quiz.questions.map(q => q.id)
          }
        }
      });

      // Prepare questions for frontend (same structure as start quiz)
      const questionsForFrontend = quiz.questions.map(question => {
        // Find user's previous answer for this question
        const userAnswer = userAnswers.find(answer => answer.questionId === question.id);

        return {
          id: question.id,
          questionText: question.question,
          questionType: question.type,
          points: question.points,
          userAnswerId: userAnswer ? userAnswer.id : null, // Add this for frontend to know which answer was selected
          answers: question.answers.map(answer => ({
            id: answer.id,
            Text: answer.text
            // Note: Not sending isCorrect to prevent cheating
          }))
        };
      });

      res.json({
        success: true,
        data: {
          attemptId: existingAttempt.id,
          quiz: {
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            timeLimit: quiz.timeLimit,
            totalQuestions: quiz.questions.length,
            passingScore: quiz.passingScore
          },
          questions: questionsForFrontend,
          startedAt: existingAttempt.startedAt
        }
      });

    } catch (error) {
      console.error('Continue quiz error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to continue quiz session'
      });
    }
  }
);
// @route   POST /api/quiz/attempt/:attemptId/answer
// @desc    Submit answer for a question
// @access  Private
router.post('/attempt/:attemptId/answer',
  authenticateToken,
  [
    param('attemptId')
      .isInt({ min: 1 })
      .withMessage('Valid attempt ID is required'),
    body('questionId')
      .isUUID()
      .withMessage('Valid question ID is required'),
    body('selectedAnswerId')
      .isUUID()
      .withMessage('Valid answer ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { attemptId } = req.params;
      const { questionId, selectedAnswerId } = req.body;
      const userId = req.user.id;

      // Verify attempt belongs to user and is not completed
      const attempt = await QuizAttempt.findOne({
        where: {
          id: attemptId,
          userId: userId,
          completedAt: null
        },
        include: [
          {
            model: Quiz,
            as: 'quiz'
          }
        ]
      });

      if (!attempt) {
        return res.status(404).json({
          success: false,
          message: 'Quiz attempt not found or already completed'
        });
      }

      // Check if time limit exceeded
      if (attempt.quiz.timeLimit) {
        const timeElapsed = (new Date() - new Date(attempt.startedAt)) / (1000 * 60); // minutes
        if (timeElapsed > attempt.quiz.timeLimit) {
          return res.status(400).json({
            success: false,
            message: 'Time limit exceeded for this quiz'
          });
        }
      }

      // Verify question belongs to this quiz
      const question = await Question.findOne({
        where: {
          id: questionId,
          quizId: attempt.quizId,
        },
        include: [
          {
            model: Answer,
            as: 'answers',
          }
        ]
      });

      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Question not found in this quiz'
        });
      }

      // Verify selected answer belongs to this question
      const selectedAnswer = question.answers.find(answer => answer.id == selectedAnswerId);
      if (!selectedAnswer) {
        return res.status(400).json({
          success: false,
          message: 'Invalid answer selection'
        });
      }

      // Check if answer already submitted for this question
      const existingAnswer = await QuizAttemptAnswer.findOne({
        where: {
          attemptId: attemptId,
          questionId: questionId
        }
      });

      const isCorrect = selectedAnswer.isCorrect;
      const pointsEarned = isCorrect ? question.points : 0;

      if (existingAnswer) {
        // Update existing answer
        await existingAnswer.update({
          selectedAnswerId: selectedAnswerId,
          isCorrect: isCorrect,
          pointsEarned: pointsEarned
        });
      } else {
        // Create new answer record
        await QuizAttemptAnswer.create({
          attemptId: attemptId,
          questionId: questionId,
          selectedAnswerId: selectedAnswerId,
          isCorrect: isCorrect,
          pointsEarned: pointsEarned
        });
      }

      res.json({
        success: true,
        message: 'Answer submitted successfully',
        data: {
          questionId: questionId,
          // isCorrect: isCorrect,
          // pointsEarned: pointsEarned
        }
      });

    } catch (error) {
      console.error('Submit answer error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit answer'
      });
    }
  }
);

// @route   POST /api/quiz/attempt/:attemptId/submit
// @desc    Complete and submit quiz
// @access  Private
router.post('/attempt/:attemptId/submit',
  authenticateToken,
  [
    param('attemptId')
      .isInt({ min: 1 })
      .withMessage('Valid attempt ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { attemptId } = req.params;
      const userId = req.user.id;

      // Get attempt with all answers
      const attempt = await QuizAttempt.findOne({
        where: {
          id: attemptId,
          userId: userId,
          completedAt: null
        },
        include: [
          {
            model: Quiz,
            as: 'quiz'
          },
          {
            model: QuizAttemptAnswer,
            as: 'answers'
          }
        ]
      });

      console.log('Found attempt:', attempt?.id);
    console.log('Number of answers found:', attempt?.answers?.length);
    console.log('Answers:', attempt?.answers);

      if (!attempt) {
        return res.status(404).json({
          success: false,
          message: 'Quiz attempt not found or already completed'
        });
      }

      // Calculate final score
      const totalPointsEarned = attempt.answers.reduce((sum, answer) => sum + answer.pointsEarned, 0);
      const correctCount = attempt.answers.filter(answer => answer.isCorrect).length;
      
      // Get total possible points for the quiz
      const totalPossiblePoints = await Question.sum('points', {
        where: {
          quizId: attempt.quizId,
        }
      }) || 0;

      const scorePercentage = totalPossiblePoints > 0 ? (totalPointsEarned / totalPossiblePoints) * 100 : 0;

      // Update attempt with final results
      await attempt.update({
        score: scorePercentage,
        correctCount: correctCount,
        completedAt: new Date()
      });

      // Determine if passed
      const passed = scorePercentage >= (attempt.quiz.passingScore || 70);

      res.json({
        success: true,
        message: 'Quiz submitted successfully',
        data: {
          attemptId: attempt.id,
          score: scorePercentage,
          totalPointsEarned: totalPointsEarned,
          totalPossiblePoints: totalPossiblePoints,
          correctCount: correctCount,
          totalQuestions: attempt.totalQuestions,
          passed: passed,
          passingScore: attempt.quiz.passingScore || 70,
          completedAt: attempt.completedAt
        }
      });

    } catch (error) {
      console.error('Submit quiz error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit quiz'
      });
    }
  }
);

// @route   GET /api/quiz/attempt/:attemptId/results
// @desc    Get detailed quiz results
// @access  Private
router.get('/attempt/:attemptId/results',
  authenticateToken,
  [
    param('attemptId')
      .isInt({ min: 1 })
      .withMessage('Valid attempt ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { attemptId } = req.params;
      const userId = req.user.id;

      const attempt = await QuizAttempt.findOne({
        where: {
          id: attemptId,
          userId: userId,
          completedAt: { [require('sequelize').Op.not]: null }
        },
        include: [
          {
            model: Quiz,
            as: 'quiz'
          },
          {
            model: QuizAttemptAnswer,
            as: 'answers',
            include: [
              {
                model: Question,
                as: 'question'
              },
              {
                model: Answer,
                as: 'selectedAnswer'
              }
            ]
          }
        ]
      });

      if (!attempt) {
        return res.status(404).json({
          success: false,
          message: 'Quiz results not found or quiz not completed'
        });
      }

      // Get all questions with correct answers for detailed results
      const questions = await Question.findAll({
        where: {
          quizId: attempt.quizId,
        },
        include: [
          {
            model: Answer,
            as: 'answers',
          }
        ]
      });

      // Build detailed results
      const detailedResults = questions.map(question => {
        const userAnswer = attempt.answers.find(ans => ans.questionId === question.id);
        const correctAnswer = question.answers.find(ans => ans.isCorrect);

        return {
          questionId: question.id,
          questionText: question.question,
          questionType: question.questionType,
          points: question.points,
          userAnswerId: userAnswer ? userAnswer.selectedAnswerId : null,
          userAnswerText: userAnswer ? userAnswer.selectedAnswer.text : null,
          correctAnswerId: correctAnswer.id,
          correctAnswerText: correctAnswer.text,
          isCorrect: userAnswer ? userAnswer.isCorrect : false,
          pointsEarned: userAnswer ? userAnswer.pointsEarned : 0,
          allAnswers: question.answers.map(answer => ({
            id: answer.id,
            answerText: answer.text,
            isCorrect: answer.isCorrect
          }))
        };
      });

      const passed = attempt.score >= (attempt.quiz.passingScore || 70);

      res.json({
        success: true,
        data: {
          attempt: {
            id: attempt.id,
            score: attempt.score,
            correctCount: attempt.correctCount,
            totalQuestions: attempt.totalQuestions,
            startedAt: attempt.startedAt,
            completedAt: attempt.completedAt,
            passed: passed
          },
          quiz: {
            id: attempt.quiz.id,
            title: attempt.quiz.title,
            description: attempt.quiz.description,
            passingScore: attempt.quiz.passingScore || 70
          },
          questions: detailedResults
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

// @route   GET /api/quiz/:quizId/attempts
// @desc    Get user's quiz attempt history
// @access  Private
router.get('/:quizId/attempts',
  authenticateToken,
  [
    param('quizId')
      .isUUID()
      .withMessage('Valid quiz ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { quizId } = req.params;
      const userId = req.user.id;

      const attempts = await QuizAttempt.findAll({
        where: {
          userId: userId,
          quizId: quizId
        },
        include: [
          {
            model: Quiz,
            as: 'quiz',
            attributes: ['id', 'title', 'passingScore']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      const formattedAttempts = attempts.map(attempt => ({
        id: attempt.id,
        score: attempt.score,
        correctCount: attempt.correctCount,
        totalQuestions: attempt.totalQuestions,
        passed: attempt.completedAt ? attempt.score >= (attempt.quiz.passingScore || 70) : false,
        startedAt: attempt.startedAt,
        completedAt: attempt.completedAt,
        status: attempt.completedAt ? 'completed' : 'in_progress'
      }));

      res.json({
        success: true,
        data: {
          quizId: parseInt(quizId),
          attempts: formattedAttempts
        }
      });

    } catch (error) {
      console.error('Get quiz attempts error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get quiz attempts'
      });
    }
  }
);

// @route   GET /api/quiz/attempt/:attemptId/status
// @desc    Get current attempt status and progress
// @access  Private
router.get('/attempt/:attemptId/status',
  authenticateToken,
  [
    param('attemptId')
      .isInt({ min: 1 })
      .withMessage('Valid attempt ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { attemptId } = req.params;
      const userId = req.user.id;

      const attempt = await QuizAttempt.findOne({
        where: {
          id: attemptId,
          userId: userId
        },
        include: [
          {
            model: Quiz,
            as: 'quiz',
            attributes: ['id', 'title', 'timeLimit']
          },
          {
            model: QuizAttemptAnswer,
            as: 'answers',
            attributes: ['questionId']
          }
        ]
      });

      if (!attempt) {
        return res.status(404).json({
          success: false,
          message: 'Quiz attempt not found'
        });
      }

      const answeredQuestions = attempt.answers.length;
      const timeElapsed = (new Date() - new Date(attempt.startedAt)) / (1000 * 60); // minutes
      const timeRemaining = attempt.quiz.timeLimit ? Math.max(0, attempt.quiz.timeLimit - timeElapsed) : null;

      res.json({
        success: true,
        data: {
          attemptId: attempt.id,
          quizTitle: attempt.quiz.title,
          status: attempt.completedAt ? 'completed' : 'in_progress',
          answeredQuestions: answeredQuestions,
          totalQuestions: attempt.totalQuestions,
          progress: (answeredQuestions / attempt.totalQuestions) * 100,
          timeElapsed: Math.round(timeElapsed),
          timeRemaining: timeRemaining ? Math.round(timeRemaining) : null,
          startedAt: attempt.startedAt,
          completedAt: attempt.completedAt
        }
      });

    } catch (error) {
      console.error('Get attempt status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get attempt status'
      });
    }
  }
);

// @route   DELETE /api/quiz/attempt/:attemptId
// @desc    Cancel/abandon quiz attempt (for incomplete attempts only)
// @access  Private
router.delete('/attempt/:attemptId',
  authenticateToken,
  [
    param('attemptId')
      .isInt({ min: 1 })
      .withMessage('Valid attempt ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { attemptId } = req.params;
      const userId = req.user.id;

      const attempt = await QuizAttempt.findOne({
        where: {
          id: attemptId,
          userId: userId,
          completedAt: null // Only allow deletion of incomplete attempts
        }
      });

      if (!attempt) {
        return res.status(404).json({
          success: false,
          message: 'Incomplete quiz attempt not found'
        });
      }

      // Delete the attempt and all associated answers (cascade will handle answers)
      await attempt.destroy();

      res.json({
        success: true,
        message: 'Quiz attempt cancelled successfully'
      });

    } catch (error) {
      console.error('Cancel quiz attempt error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cancel quiz attempt'
      });
    }
  }
);

// @route   GET /api/quiz/my-attempts
// @desc    Get all quiz attempts for current user (for student dashboard)
// @access  Private
router.get('/my-attempts',
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      // Get all quiz attempts for the user with quiz details
      const { count, rows: attempts } = await QuizAttempt.findAndCountAll({
        where: { userId: userId },
        include: [
          {
            model: Quiz,
            as: 'quiz',
            attributes: ['id', 'title', 'description', 'passingScore'],
            include: [
              {
                model: Question,
                as: 'questions',
                attributes: ['id'],
                required: false
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: limit,
        offset: offset
      });

      const formattedAttempts = attempts.map(attempt => {
        const totalQuestions = attempt.quiz.questions ? attempt.quiz.questions.length : attempt.totalQuestions;
        const passed = attempt.completedAt ? attempt.score >= (attempt.quiz.passingScore || 70) : false;
        
        return {
          id: attempt.id,
          quizId: attempt.quiz.id,
          quizTitle: attempt.quiz.title,
          quizDescription: attempt.quiz.description,
          totalQuestions: totalQuestions,
          score: attempt.score,
          correctCount: attempt.correctCount,
          passed: passed,
          status: attempt.completedAt ? 'completed' : 'in_progress',
          startedAt: attempt.startedAt,
          completedAt: attempt.completedAt,
          createdAt: attempt.createdAt
        };
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        success: true,
        data: {
          attempts: formattedAttempts,
          pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalItems: count,
            itemsPerPage: limit,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        }
      });

    } catch (error) {
      console.error('Get my quiz attempts error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get quiz attempts'
      });
    }
  }
);


module.exports = router;