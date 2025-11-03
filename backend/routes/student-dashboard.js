const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { Course, Enrollment, QuizAttempt, Payment, User, Quiz, Category, Progress, Lesson, Section, StudentCertificate, QuizAttemptAnswer, Certificate } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');
const { sequelize } = require('../models');

const router = express.Router();

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

// @route   GET /api/student/dashboard/stats
// @desc    Get student dashboard statistics
// @access  Private
router.get('/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.id;

    // Get enrolled courses count
    const enrolledCourses = await Enrollment.count({
      where: { userId: studentId, isActive: true }
    });

    // Get active courses (in progress but not completed)
    const activeCourses = await Enrollment.count({
      where: { 
        userId: studentId, 
        isActive: true,
        progressPercentage: {
          [Op.gt]: 0,
          [Op.lt]: 100
        }
      }
    });

    // Get completed courses
    const completedCourses = await Enrollment.count({
      where: { 
        userId: studentId, 
        isActive: true,
        progressPercentage: 100
      }
    });

    // Get total time spent (sum of all enrollment totalTimeSpent)
    const totalTimeSpentResult = await Enrollment.findOne({
      where: { userId: studentId, isActive: true },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('totalTimeSpent')), 'totalTimeSpent']
      ],
      raw: true
    });

    const totalTimeSpent = totalTimeSpentResult?.totalTimeSpent || 0;

    // Get certificates earned count
    const certificatesEarned = await StudentCertificate.count({
      where: { 
        studentId: studentId,
        isValid: true
      }
    });

    res.json({
      success: true,
      data: {
        enrolledCourses,
        activeCourses,
        completedCourses,
        totalTimeSpent,
        certificatesEarned
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/student/dashboard/recent-courses
// @desc    Get recently enrolled courses with progress and status (optimized)
// @access  Private
router.get('/dashboard/recent-courses', authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.id;
    const limit = parseInt(req.query.limit) || 6;

    const recentEnrollments = await Enrollment.findAll({
      where: { userId: studentId, isActive: true },
      include: [
        {
          model: Course,
          as: 'course',
          include: [
            {
              model: User,
              as: 'instructor',
              attributes: ['id', 'firstName', 'lastName', 'avatar']
            },
            {
              model: Category,
              as: 'category',
              attributes: ['name']
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
          ]
        }
      ],
      order: [['lastAccessedAt', 'DESC'], ['enrolledAt', 'DESC']],
      limit: limit
    });

    // Get all lesson IDs from the enrolled courses
    const allLessonIds = recentEnrollments.flatMap(enrollment => 
      enrollment.course.sections?.flatMap(section => 
        section.lessons?.map(lesson => lesson.id) || []
      ) || []
    );

    // Get progress for all lessons in one query
    const progressRecords = await Progress.findAll({
      where: {
        userId: studentId,
        lessonId: {
          [Op.in]: allLessonIds
        },
        isCompleted: true
      },
      attributes: ['lessonId', 'isCompleted'],
      raw: true
    });

    // Create a Set of completed lesson IDs for fast lookup
    const completedLessonIds = new Set(progressRecords.map(record => record.lessonId));

    const courses = recentEnrollments.map((enrollment) => {
      const course = enrollment.course;
      
      // Get instructor full name
      const instructorName = course.instructor ? 
        `${course.instructor.firstName} ${course.instructor.lastName}` : 
        'Unknown Instructor';

      // Get course thumbnail (using heroImageUrl or default)
      const thumbnail = course.heroImageUrl || 'assets/img/course/course-01.jpg';

      // Calculate total lessons and completed lessons
      const allLessons = course.sections?.flatMap(section => section.lessons || []) || [];
      const totalLessons = allLessons.length;
      const completedLessons = allLessons.filter(lesson => 
        completedLessonIds.has(lesson.id)
      ).length;

      // Determine course status
      let status = 'enrolled';
      if (enrollment.progressPercentage === 100) {
        status = 'completed';
      } else if (enrollment.progressPercentage > 0) {
        status = 'active';
      }

      return {
        id: course.id,
        title: course.title,
        subtitle: course.subtitle,
        slug: course.slug,
        instructorName,
        instructorAvatar: course.instructor?.avatar || 'assets/img/user/user-29.jpg',
        thumbnail,
        category: course.category?.name || 'General',
        rating: course.averageRating || 4.5,
        reviewCount: course.totalReviews || 0,
        accreditedCreditHours: course.accreditedCreditHours,
        accreditedCreditType: course.accreditedCreditType,
        price: course.pricing?.price || 0,
        progress: enrollment.progressPercentage,
        status: status,
        enrolledAt: enrollment.enrolledAt,
        lastAccessedAt: enrollment.lastAccessedAt,
        totalLessons: totalLessons,
        completedLessons: completedLessons,
        duration: course.duration || 0,
        level: course.level || 'beginner'
      };
    });

    res.json({
      success: true,
      data: courses
    });

  } catch (error) {
    console.error('Error fetching recent courses:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/student/dashboard/quiz-progress
// @desc    Get recent quiz attempts and progress
// @access  Private
router.get('/dashboard/quiz-progress', authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.id;
    const limit = parseInt(req.query.limit) || 5;

    const quizAttempts = await QuizAttempt.findAll({
      where: { userId: studentId },
      include: [
        {
          model: Quiz,
          as: 'quiz',
          attributes: ['id', 'title', 'totalQuestions'],
          include: [
            {
              model: Course,
              as: 'course',
              attributes: ['title']
            }
          ]
        }
      ],
      order: [['completedAt', 'DESC']],
      limit: limit
    });

    const quizProgress = quizAttempts.map(attempt => {
      const scorePercentage = attempt.totalQuestions > 0 ? 
        (attempt.correctCount / attempt.totalQuestions) * 100 : 0;

      return {
        id: attempt.id,
        title: attempt.quiz?.title || 'Unknown Quiz',
        correctAnswers: attempt.correctCount,
        totalQuestions: attempt.totalQuestions,
        score: scorePercentage,
        completedAt: attempt.completedAt
      };
    });

    res.json({
      success: true,
      data: quizProgress
    });

  } catch (error) {
    console.error('Error fetching quiz progress:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/student/dashboard/recent-invoices
// @desc    Get recent payment invoices
// @access  Private
router.get('/dashboard/recent-invoices', authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.id;
    const limit = parseInt(req.query.limit) || 5;

    const payments = await Payment.findAll({
      where: { userId: studentId },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['title']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: limit
    });

    const invoices = payments.map((payment, index) => {
      const invoiceNumber = `INV${String(payment.id).slice(-6).padStart(6, '0')}`;
      
      return {
        id: payment.id,
        invoiceNumber,
        courseTitle: payment.course?.title || 'Course Payment',
        amount: parseFloat(payment.amount),
        status: payment.status,
        createdAt: payment.createdAt
      };
    });

    res.json({
      success: true,
      data: invoices
    });

  } catch (error) {
    console.error('Error fetching recent invoices:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/student/dashboard/active-quiz
// @desc    Get currently active quiz (if any)
// @access  Private
router.get('/dashboard/active-quiz', authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.id;

    // Find active quiz attempts (started but not completed)
    const activeAttempt = await QuizAttempt.findOne({
      where: { 
        userId: studentId, 
        completedAt: null 
      },
      include: [
        {
          model: Quiz,
          as: 'quiz',
          attributes: ['id', 'title', 'totalQuestions', 'timeLimit'],
          include: [
            {
              model: Course,
              as: 'course',
              attributes: ['title']
            }
          ]
        }
      ],
      order: [['startedAt', 'DESC']]
    });

    if (!activeAttempt) {
      return res.json({
        success: true,
        data: null
      });
    }

    // Calculate time remaining
    const quiz = activeAttempt.quiz;
    let timeRemaining = 0;
    
    if (quiz.timeLimit) {
      const timeElapsed = Math.floor((new Date() - new Date(activeAttempt.startedAt)) / 1000);
      timeRemaining = Math.max(0, (quiz.timeLimit * 60) - timeElapsed);
    }

    // Get answered questions count
    const answeredCount = await QuizAttemptAnswer.count({
      where: { attemptId: activeAttempt.id }
    });

    const activeQuiz = {
      id: quiz.id,
      title: quiz.title,
      answered: answeredCount,
      totalQuestions: quiz.totalQuestions,
      timeRemaining: timeRemaining
    };

    res.json({
      success: true,
      data: activeQuiz
    });

  } catch (error) {
    console.error('Error fetching active quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/student/courses/:courseId/favorite
// @desc    Toggle course favorite status
// @access  Private
router.post('/courses/:courseId/favorite', 
  authenticateToken,
  [
    param('courseId').isUUID().withMessage('Valid course ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { courseId } = req.params;
      const userId = req.user.id;

      // Check if enrollment exists
      const enrollment = await Enrollment.findOne({
        where: { userId, courseId, isActive: true }
      });

      if (!enrollment) {
        return res.status(404).json({ 
          success: false,
          message: 'Course enrollment not found' 
        });
      }

      // Toggle favorite status
      const updatedEnrollment = await enrollment.update({
        isFavorite: !enrollment.isFavorite
      });

      res.json({
        success: true,
        data: {
          isFavorite: updatedEnrollment.isFavorite
        },
        message: updatedEnrollment.isFavorite ? 
          'Course added to favorites' : 
          'Course removed from favorites'
      });

    } catch (error) {
      console.error('Error toggling favorite:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
);

// @route   GET /api/student/dashboard/learning-activity
// @desc    Get recent learning activity
// @access  Private
router.get('/dashboard/learning-activity', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    const recentProgress = await Progress.findAll({
      where: { userId },
      include: [
        {
          model: Lesson,
          as: 'lesson',
          attributes: ['id', 'title', 'duration'],
          include: [
            {
              model: Section,
              as: 'section',
              attributes: ['id', 'title'],
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
      ],
      order: [['updatedAt', 'DESC']],
      limit: limit
    });

    const activity = recentProgress.map(progress => {
      const lesson = progress.lesson;
      const course = lesson?.section?.course;

      return {
        id: progress.id,
        type: progress.isCompleted ? 'lesson_completed' : 'lesson_progress',
        title: lesson?.title || 'Unknown Lesson',
        courseTitle: course?.title || 'Unknown Course',
        progress: progress.completionPercentage,
        isCompleted: progress.isCompleted,
        timestamp: progress.updatedAt,
        duration: progress.watchTime
      };
    });

    res.json({
      success: true,
      data: activity
    });

  } catch (error) {
    console.error('Error fetching learning activity:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/student/dashboard/certificates
// @desc    Get all student certificates
// @access  Private
router.get('/dashboard/certificates', authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.id;

    const certificates = await StudentCertificate.findAll({
      where: { 
        studentId: studentId,
        isValid: true
      },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'slug', 'description']
        },
        {
          model: Certificate,
          as: 'certificate',
          attributes: ['id', 'title', 'templateUrl', 'settings']
        },
        {
          model: User,
          as: 'student',
          attributes: ['firstName', 'lastName', 'email']
        }
      ],
      order: [['issueDate', 'DESC']]
    });

    // Format the response
    const formattedCertificates = certificates.map(cert => ({
      id: cert.id,
      certificateNumber: cert.certificateNumber,
      courseTitle: cert.courseTitle,
      studentName: cert.studentName,
      instructorName: cert.instructorName,
      completionDate: cert.completionDate,
      issueDate: cert.issueDate,
      certificateUrl: cert.certificateUrl,
      isValid: cert.isValid,
      course: {
        id: cert.course.id,
        title: cert.course.title,
        slug: cert.course.slug
      },
      certificate: cert.certificate ? {
        id: cert.certificate.id,
        title: cert.certificate.title,
        templateUrl: cert.certificate.templateUrl
      } : null
    }));

    res.json({
      success: true,
      data: {
        certificates: formattedCertificates,
        totalCount: certificates.length
      }
    });

  } catch (error) {
    console.error('Error fetching student certificates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificates',
      error: error.message
    });
  }
});


// @route   GET /api/student/dashboard/overview
// @desc    Get complete dashboard overview (all data in one call)
// @access  Private
router.get('/dashboard/overview', authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.id;

    // Fetch all data in parallel for better performance
    const [
      statsResponse,
      recentCoursesResponse,
      quizProgressResponse,
      invoicesResponse,
      activeQuizResponse,
      learningActivityResponse
    ] = await Promise.all([
      // Mock the internal calls - in a real app, you'd call the functions directly
      getDashboardStatsData(studentId),
      getRecentCoursesData(studentId),
      getQuizProgressData(studentId),
      getRecentInvoicesData(studentId),
      getActiveQuizData(studentId),
      getLearningActivityData(studentId)
    ]);

    res.json({
      success: true,
      data: {
        stats: statsResponse,
        recentCourses: recentCoursesResponse,
        quizProgress: quizProgressResponse,
        invoices: invoicesResponse,
        activeQuiz: activeQuizResponse,
        learningActivity: learningActivityResponse
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/student/dashboard/stats
// @desc    Get student dashboard statistics with learning hours
// @access  Private
router.get('/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.id;

    // Get enrolled courses count
    const enrolledCourses = await Enrollment.count({
      where: { userId: studentId, isActive: true }
    });

    // Get active courses (in progress but not completed)
    const activeCourses = await Enrollment.count({
      where: { 
        userId: studentId, 
        isActive: true,
        progressPercentage: {
          [Op.gt]: 0,
          [Op.lt]: 100
        }
      }
    });

    // Get completed courses
    const completedCourses = await Enrollment.count({
      where: { 
        userId: studentId, 
        isActive: true,
        progressPercentage: 100
      }
    });

    // Get total learning hours from Progress model (watchTime in seconds)
    const totalLearningHoursResult = await Progress.findOne({
      where: { userId: studentId },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('watchTime')), 'totalWatchTimeSeconds']
      ],
      raw: true
    });

    // Calculate total learning hours
    const totalWatchTimeSeconds = totalLearningHoursResult?.totalWatchTimeSeconds || 0;
    const totalLearningHours = Math.round((totalWatchTimeSeconds / 3600) * 100) / 100; // Convert seconds to hours

    // Get this week's learning hours
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyLearningHoursResult = await Progress.findOne({
      where: { 
        userId: studentId,
        lastAccessedAt: {
          [Op.gte]: startOfWeek
        }
      },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('watchTime')), 'weeklyWatchTimeSeconds']
      ],
      raw: true
    });

    const weeklyWatchTimeSeconds = weeklyLearningHoursResult?.weeklyWatchTimeSeconds || 0;
    const weeklyLearningHours = Math.round((weeklyWatchTimeSeconds / 3600) * 100) / 100;

    // Get today's learning hours
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const dailyLearningHoursResult = await Progress.findOne({
      where: { 
        userId: studentId,
        lastAccessedAt: {
          [Op.gte]: startOfDay
        }
      },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('watchTime')), 'dailyWatchTimeSeconds']
      ],
      raw: true
    });

    const dailyWatchTimeSeconds = dailyLearningHoursResult?.dailyWatchTimeSeconds || 0;
    const dailyLearningHours = Math.round((dailyWatchTimeSeconds / 3600) * 100) / 100;

    // Get certificates earned count
    const certificatesEarned = await StudentCertificate.count({
      where: { 
        studentId: studentId,
        isValid: true
      }
    });

    res.json({
      success: true,
      data: {
        enrolledCourses,
        activeCourses,
        completedCourses,
        totalLearningHours,
        weeklyLearningHours,
        dailyLearningHours,
        certificatesEarned,
        learningStats: {
          totalWatchTimeSeconds,
          weeklyWatchTimeSeconds,
          dailyWatchTimeSeconds
        }
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/student/dashboard/learning-analytics
// @desc    Get detailed learning analytics for charts
// @access  Private
router.get('/dashboard/learning-analytics', authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.id;
    const period = req.query.period || 'week'; // week, month, year

    let startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    // Get daily learning hours for the selected period
    const dailyProgress = await Progress.findAll({
      where: {
        userId: studentId,
        lastAccessedAt: {
          [Op.gte]: startDate
        }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('lastAccessedAt')), 'date'],
        [sequelize.fn('SUM', sequelize.col('watchTime')), 'totalSeconds']
      ],
      group: [sequelize.fn('DATE', sequelize.col('lastAccessedAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('lastAccessedAt')), 'ASC']],
      raw: true
    });

    // Format data for charts
    const learningData = dailyProgress.map(item => ({
      date: item.date,
      hours: Math.round((item.totalSeconds / 3600) * 100) / 100,
      minutes: Math.round(item.totalSeconds / 60)
    }));

    // Get learning hours by course
    const courseProgress = await Progress.findAll({
      where: { userId: studentId },
      include: [
        {
          model: Lesson,
          as: 'lesson',
          attributes: ['id'],
          include: [
            {
              model: Section,
              as: 'section',
              attributes: ['id'],
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
      ],
      attributes: [
        [sequelize.fn('SUM', sequelize.col('watchTime')), 'totalSeconds']
      ],
      group: ['lesson.section.course.id'],
      raw: true
    });

    const courseLearningData = courseProgress.map(item => ({
      courseTitle: item['lesson.section.course.title'],
      hours: Math.round((item.totalSeconds / 3600) * 100) / 100
    }));

    res.json({
      success: true,
      data: {
        dailyLearning: learningData,
        courseLearning: courseLearningData,
        period: period
      }
    });

  } catch (error) {
    console.error('Error fetching learning analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/student/resume/courses
// @desc    Get user's last studied course for redirection
// @access  Private
router.get('/resume/courses', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the most recently accessed course
    const lastEnrollment = await Enrollment.findOne({
      where: { 
        userId, 
        isActive: true,
        progressPercentage: { [Op.lt]: 100 } // Only incomplete courses
      },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'slug', 'title'],
          include: [
            {
              model: Section,
              as: 'sections',
              attributes: ['id'],
              include: [
                {
                  model: Lesson,
                  as: 'lessons',
                  attributes: ['id', 'title', 'sortOrder']
                }
              ]
            }
          ]
        }
      ],
      order: [['lastAccessedAt', 'DESC']]
    });

    if (!lastEnrollment) {
      return res.status(404).json({
        success: false,
        message: 'No active courses found',
        redirectTo: '/courses' // Redirect to courses page if no active courses
      });
    }

    // Find the last accessed lesson or first incomplete lesson
    const lastProgress = await Progress.findOne({
      where: { 
        userId,
        lessonId: {
          [Op.in]: lastEnrollment.course.sections.flatMap(section => 
            section.lessons.map(lesson => lesson.id)
          )
        }
      },
      order: [['lastAccessedAt', 'DESC']]
    });

    let lessonId = null;
    
    if (lastProgress) {
      // If user has progress, redirect to last accessed lesson
      lessonId = lastProgress.lessonId;
    } else {
      // Otherwise, find the first lesson in the course
      const firstLesson = lastEnrollment.course.sections
        .flatMap(section => section.lessons)
        .sort((a, b) => a.sortOrder - b.sortOrder)[0];
      
      if (firstLesson) {
        lessonId = firstLesson.id;
      }
    }

    res.json({
      success: true,
      data: {
        courseSlug: lastEnrollment.course.slug,
        lessonId: lessonId,
        courseTitle: lastEnrollment.course.title,
        progress: lastEnrollment.progressPercentage,
        redirectTo: lessonId 
        ? `/learn/${lastEnrollment.course.slug}/${lessonId}`
        : `/learn/${lastEnrollment.course.slug}`
      }
    });

  } catch (error) {
    console.error('Resume courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get resume course data'
    });
  }
});

// Helper functions for the overview endpoint
async function getDashboardStatsData(studentId) {
  const enrolledCourses = await Enrollment.count({
    where: { userId: studentId, isActive: true }
  });

  const activeCourses = await Enrollment.count({
    where: { 
      userId: studentId, 
      isActive: true,
      progressPercentage: {
        [Op.gt]: 0,
        [Op.lt]: 100
      }
    }
  });

  const completedCourses = await Enrollment.count({
    where: { 
      userId: studentId, 
      isActive: true,
      progressPercentage: 100
    }
  });

  // Get total learning hours
  const totalLearningHoursResult = await Progress.findOne({
    where: { userId: studentId },
    attributes: [
      [sequelize.fn('SUM', sequelize.col('watchTime')), 'totalWatchTimeSeconds']
    ],
    raw: true
  });

  const totalWatchTimeSeconds = totalLearningHoursResult?.totalWatchTimeSeconds || 0;
  const totalLearningHours = Math.round((totalWatchTimeSeconds / 3600) * 100) / 100;

  const certificatesEarned = await StudentCertificate.count({
    where: { 
      studentId: studentId,
      isValid: true
    }
  });

  return {
    enrolledCourses,
    activeCourses,
    completedCourses,
    totalLearningHours,
    certificatesEarned
  };
}

async function getRecentCoursesData(studentId) {
  const recentEnrollments = await Enrollment.findAll({
    where: { userId: studentId, isActive: true },
    include: [
      {
        model: Course,
        as: 'course',
        include: [
          {
            model: User,
            as: 'instructor',
            attributes: ['id', 'firstName', 'lastName', 'avatar']
          },
          {
            model: Category,
            as: 'category',
            attributes: ['name']
          }
        ]
      }
    ],
    order: [['enrolledAt', 'DESC']],
    limit: 3
  });

  return recentEnrollments.map(enrollment => {
    const course = enrollment.course;
    const instructorName = course.instructor ? 
      `${course.instructor.firstName} ${course.instructor.lastName}` : 
      'Unknown Instructor';

    return {
      id: course.id,
      title: course.title,
      instructorName,
      instructorAvatar: course.instructor?.avatar || 'assets/img/user/user-29.jpg',
      thumbnail: course.heroImageUrl || 'assets/img/course/course-01.jpg',
      category: course.category?.name || 'General',
      progress: enrollment.progressPercentage
    };
  });
}

async function getQuizProgressData(studentId) {
  const quizAttempts = await QuizAttempt.findAll({
    where: { userId: studentId },
    include: [
      {
        model: Quiz,
        as: 'quiz',
        attributes: ['id', 'title', 'totalQuestions']
      }
    ],
    order: [['completedAt', 'DESC']],
    limit: 5
  });

  return quizAttempts.map(attempt => {
    const scorePercentage = attempt.totalQuestions > 0 ? 
      (attempt.correctCount / attempt.totalQuestions) * 100 : 0;

    return {
      id: attempt.id,
      title: attempt.quiz?.title || 'Unknown Quiz',
      correctAnswers: attempt.correctCount,
      totalQuestions: attempt.totalQuestions,
      score: scorePercentage
    };
  });
}

async function getRecentInvoicesData(studentId) {
  const payments = await Payment.findAll({
    where: { userId: studentId },
    include: [
      {
        model: Course,
        as: 'course',
        attributes: ['title']
      }
    ],
    order: [['createdAt', 'DESC']],
    limit: 5
  });

  return payments.map((payment, index) => {
    const invoiceNumber = `INV${String(payment.id).slice(-6).padStart(6, '0')}`;
    
    return {
      id: payment.id,
      invoiceNumber,
      courseTitle: payment.course?.title || 'Course Payment',
      amount: parseFloat(payment.amount),
      status: payment.status,
      createdAt: payment.createdAt
    };
  });
}

async function getActiveQuizData(studentId) {
  const activeAttempt = await QuizAttempt.findOne({
    where: { 
      userId: studentId, 
      completedAt: null 
    },
    include: [
      {
        model: Quiz,
        as: 'quiz',
        attributes: ['id', 'title', 'totalQuestions', 'timeLimit']
      }
    ],
    order: [['startedAt', 'DESC']]
  });

  if (!activeAttempt) return null;

  const quiz = activeAttempt.quiz;
  let timeRemaining = 0;
  
  if (quiz.timeLimit) {
    const timeElapsed = Math.floor((new Date() - new Date(activeAttempt.startedAt)) / 1000);
    timeRemaining = Math.max(0, (quiz.timeLimit * 60) - timeElapsed);
  }

  const answeredCount = await QuizAttemptAnswer.count({
    where: { attemptId: activeAttempt.id }
  });

  return {
    id: activeAttempt.id,
    title: quiz.title,
    answered: answeredCount,
    totalQuestions: quiz.totalQuestions,
    timeRemaining: timeRemaining
  };
}

async function getLearningActivityData(studentId) {
  const recentProgress = await Progress.findAll({
    where: { userId: studentId },
    include: [
      {
        model: Lesson,
        as: 'lesson',
        attributes: ['id', 'title'],
        include: [
          {
            model: Section,
            as: 'section',
            attributes: ['id', 'title'],
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
    ],
    order: [['updatedAt', 'DESC']],
    limit: 5
  });

  return recentProgress.map(progress => {
    const lesson = progress.lesson;
    const course = lesson?.section?.course;

    return {
      id: progress.id,
      type: progress.isCompleted ? 'lesson_completed' : 'lesson_progress',
      title: lesson?.title || 'Unknown Lesson',
      courseTitle: course?.title || 'Unknown Course',
      progress: progress.completionPercentage,
      isCompleted: progress.isCompleted,
      timestamp: progress.updatedAt
    };
  });
}

module.exports = router;