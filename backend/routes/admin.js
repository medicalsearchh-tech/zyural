const express = require('express');
const { query, body, validationResult } = require('express-validator');
const { User, Course, Category, Section, Lesson, Enrollment, Progress, Certificate, Review, Specialty, Notification, SyllabusDocument,  StudentCertificate, QuizAttempt, Quiz} = require('../models');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { Op } = require('sequelize');
const { sequelize } = require('../models');
const { sendCourseReviewEmail } = require('../utils/email');

const router = express.Router();

// @route   GET /api/admin/users
// @desc    Get all users for admin (with filtering and pagination)
// @access  Private (Admin only)
router.get('/users', authenticateToken, isAdmin, [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('search')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search query too long'),
  query('role')
    .optional()
    .isIn(['student', 'instructor', 'admin'])
    .withMessage('Role must be student, instructor, or admin'),
  query('excludeCurrent')
    .optional()
    .isBoolean()
    .withMessage('excludeCurrent must be boolean')
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
      page = 1, 
      limit = 50, 
      search, 
      role,
      excludeCurrent 
    } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {
      isActive: true
    };

    // Exclude current user if requested
    if (excludeCurrent === 'true') {
      whereClause.id = { [Op.ne]: req.user.id };
    }

    // Filter by role
    if (role) {
      whereClause.role = role;
    }

    // Search filter
    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const users = await User.findAndCountAll({
      where: whereClause,
      attributes: [
        'id', 
        'firstName', 
        'lastName', 
        'email', 
        'avatar', 
        'role',
        'isActive',
        'lastLoginAt',
        'createdAt'
      ],
      order: [
        ['createdAt', 'DESC']
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });

    res.json({
      success: true,
      data: {
        users: users.rows,
        pagination: {
          total: users.count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(users.count / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// @route   GET /api/admin/instructors-list
// @desc    Get all instructors for admin with stats
// @access  Private (Admin)
router.get('/instructors-list', [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('search')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search query too long')
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    // Build where clause for users
    const userWhere = { role: 'instructor' };
    
    if (search) {
      userWhere[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Get all instructors with their courses - FIXED ALIAS
    const { count, rows: instructors } = await User.findAndCountAll({
      where: userWhere,
      attributes: [
        'id', 'firstName', 'lastName', 'email', 'avatar', 'bio', 
        'isVerified', 'status', 'createdAt', 'lastLoginAt'
      ],
      include: [
        {
          model: Course,
          as: 'instructor', // CHANGED FROM 'courses' TO 'instructor'
          attributes: ['id', 'title', 'status'],
          required: false,
          include: [
            {
              model: Enrollment,
              as: 'enrollments',
              attributes: ['id'],
              required: false
            },
            {
              model: Review,
              as: 'reviews',
              attributes: ['rating'],
              required: false
            }
          ]
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      distinct: true
    });

    // Transform data for frontend
    const instructorListData = instructors.map(instructor => {
      const courses = instructor.instructor || []; // CHANGED FROM instructor.courses
      const publishedCourses = courses.filter(course => course.status === 'published');
      
      // Calculate total students from enrollments
      const totalStudents = publishedCourses.reduce((sum, course) => 
        sum + (course.enrollments?.length || 0), 0
      );

      // Calculate average rating from course reviews
      const allRatings = publishedCourses.flatMap(course => 
        course.reviews ? course.reviews.map(review => review.rating) : []
      );
      const averageRating = allRatings.length > 0 
        ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length 
        : 0;

      return {
        instructorId: instructor.id,
        fullName: `${instructor.firstName} ${instructor.lastName}`,
        email: instructor.email,
        avatar: instructor.avatar,
        bio: instructor.bio,
        isVerified: instructor.isVerified,
        status: instructor.status,
        totalCourses: publishedCourses.length,
        totalStudents: totalStudents,
        averageRating: parseFloat(averageRating.toFixed(1)),
        joinedAt: instructor.createdAt,
        lastLogin: instructor.lastLoginAt,
        courses: publishedCourses.map(course => ({
          id: course.id,
          title: course.title,
          status: course.status,
          enrolledStudents: course.enrollments?.length || 0
        }))
      };
    });

    // Calculate stats
    const stats = {
      totalInstructors: count,
      activeInstructors: instructors.filter(i => i.status === 'active').length,
      pendingInstructors: instructors.filter(i => i.status === 'pending').length,
      suspendedInstructors: instructors.filter(i => i.status === 'suspended').length,
      verifiedInstructors: instructors.filter(i => i.isVerified).length
    };

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        instructorListData,
        stats,
        pagination: {
          currentPage: page,
          totalPages,
          totalInstructors: count,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get admin instructors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get instructors list',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/admin/instructors/:instructorId/status
// @desc    Update instructor status
// @access  Private (Admin)
router.put('/instructors/:instructorId/status', authenticateToken, isAdmin,[
  body('status')
    .isIn(['active', 'pending', 'suspended'])
    .withMessage('Status must be active, pending, or suspended')
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

    const { instructorId } = req.params;
    const { status } = req.body;

    const instructor = await User.findOne({
      where: { 
        id: instructorId, 
        role: 'instructor' 
      }
    });

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found'
      });
    }

    await instructor.update({ status });

    res.json({
      success: true,
      message: `Instructor status updated to ${status}`,
      data: {
        instructorId: instructor.id,
        status: instructor.status
      }
    });

  } catch (error) {
    console.error('Update instructor status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update instructor status'
    });
  }
});

// @route   DELETE /api/admin/instructors/:instructorId
// @desc    Delete instructor (soft delete)
// @access  Private (Admin)
router.delete('/instructors/:instructorId', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { instructorId } = req.params;

    const instructor = await User.findOne({
      where: { 
        id: instructorId, 
        role: 'instructor' 
      }
    });

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found'
      });
    }

    // Soft delete by updating status
    await instructor.update({ 
      status: 'deleted',
      email: `${instructor.email}_deleted_${Date.now()}` // Prevent email conflicts
    });

    res.json({
      success: true,
      message: 'Instructor deleted successfully'
    });

  } catch (error) {
    console.error('Delete instructor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete instructor'
    });
  }
});

// @route   GET /api/admin/course-requests
// @desc    Get all course requests for admin review
// @access  Private (Admin only)
router.get('/course-requests', authenticateToken, isAdmin, [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('search')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search query too long'),
  query('status')
    .optional()
    .isIn(['submitted', 'changes_requested', 'approved', 'rejected', 'all'])
    .withMessage('Status must be submitted, changes_requested, approved, rejected, or all'),
  query('instructor')
    .optional()
    .isUUID()
    .withMessage('Instructor ID must be a valid UUID')
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
      page = 1, 
      limit = 10, 
      search, 
      status = 'all',
      instructor 
    } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause for courses
    const whereClause = {};

    // Filter by status
    if (status !== 'all') {
      whereClause.status = status;
    } else {
      // Show only courses that need review
      whereClause.status = {
        [Op.in]: ['submitted', 'changes_requested']
      };
    }

    // Filter by instructor
    if (instructor) {
      whereClause.instructorId = instructor;
    }

    // Search filter
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { subtitle: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Get courses with related data
    const { count, rows: courses } = await Course.findAndCountAll({
      where: whereClause,
      attributes: [
        'id', 'title', 'subtitle', 'status', 'submittedAt', 'heroImageUrl',
        'level', 'duration', 'totalSections', 'totalLessons', 'createdAt'
      ],
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'firstName', 'lastName', 'email', 'avatar', 'role'],
          required: true
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
          required: true
        },
        {
          model: Specialty,
          as: 'specialty',
          attributes: ['id', 'name'],
          required: false
        }
      ],
      order: [
        ['submittedAt', 'DESC'],
        ['createdAt', 'DESC']
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });

    // Filter out any courses not created by instructors (application-level filtering)
    const validCourses = courses.filter(course => 
      course.instructor && course.instructor.role === 'instructor'
    );

    // Calculate statistics
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const stats = await Promise.all([
      // Pending review count
      Course.count({
        where: { status: 'submitted' }
      }),
      // Changes requested count
      Course.count({
        where: { status: 'changes_requested' }
      }),
      // Approved this week count
      Course.count({
        where: { 
          status: 'approved',
          approvedAt: {
            [Op.gte]: oneWeekAgo
          }
        }
      }),
      // Total processed count (all courses that went through review)
      Course.count({
        where: {
          status: {
            [Op.in]: ['approved', 'published']
          }
        }
      })
    ]);

    // Transform data for frontend
    const courseRequestsData = validCourses.map(course => ({
      id: course.id,
      title: course.title,
      subtitle: course.subtitle,
      status: course.status,
      submittedAt: course.submittedAt,
      heroImageUrl: course.heroImageUrl,
      instructor: {
        id: course.instructor.id,
        fullName: `${course.instructor.firstName} ${course.instructor.lastName}`,
        email: course.instructor.email,
        avatar: course.instructor.avatar
      },
      category: {
        id: course.category.id,
        name: course.category.name
      },
      specialty: course.specialty ? {
        id: course.specialty.id,
        name: course.specialty.name
      } : null,
      level: course.level,
      duration: course.duration,
      totalSections: course.totalSections,
      totalLessons: course.totalLessons
    }));

    // Adjust count for filtered courses
    const adjustedCount = validCourses.length < courses.length ? 
      count - (courses.length - validCourses.length) : 
      count;

    res.json({
      success: true,
      data: {
        courses: courseRequestsData,
        stats: {
          pending: stats[0],
          changesRequested: stats[1],
          approvedThisWeek: stats[2],
          totalProcessed: stats[3]
        },
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(adjustedCount / limit),
          totalCourses: adjustedCount,
          hasNext: page < Math.ceil(adjustedCount / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get admin course requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course requests',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


// @route   GET /api/admin/course-requests/:courseId
// @desc    Get detailed course information for review
// @access  Private (Admin only)
router.get('/course-requests/:courseId', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findOne({
      where: { id: courseId },
      attributes: { exclude: ['password'] },
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'firstName', 'lastName', 'email', 'avatar', 'bio']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: Specialty,
          as: 'specialty',
          attributes: ['id', 'name']
        },
        {
          model: Section,
          as: 'sections',
          attributes: ['id', 'title', 'description', 'sortOrder', 'totalLessons', 'totalDuration'],
          include: [
            {
              model: Lesson,
              as: 'lessons',
              attributes: ['id', 'title', 'type', 'duration', 'sortOrder', 'freePreview']
            }
          ]
        },
        {
          model: SyllabusDocument,
          as: 'syllabusDocuments',
          attributes: ['id', 'originalFileName', 'fileUrl', 'processingStatus', 'extractedStructure'],
          where: {
            processingStatus: 'completed'
          },
          required: false
        }
      ]
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      data: {
        course
      }
    });

  } catch (error) {
    console.error('Get course details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/admin/course-requests/:courseId/review
// @desc    Review a course request (approve, reject, request changes)
// @access  Private (Admin only)
router.put('/course-requests/:courseId/review', authenticateToken, isAdmin, [
  body('action')
    .isIn(['approve', 'reject', 'request-changes'])
    .withMessage('Action must be approve, reject, or request-changes'),
  body('comments')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Comments must be less than 2000 characters')
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

    const { courseId } = req.params;
    const { action, comments } = req.body;

    const course = await Course.findOne({
      where: { 
        id: courseId,
        status: {
          [Op.in]: ['submitted', 'changes_requested']
        }
      },
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or not available for review'
      });
    }

    // Update course based on action
    let newStatus;
    let updateData = {
      reviewFeedback: {
        action,
        comments: comments || '',
        reviewedBy: req.user.id,
        reviewedAt: new Date()
      }
    };

    // Notification configuration based on action
    let notificationConfig = {
      userId: course.instructor.id,
      metadata: {
        courseId: course.id,
        courseTitle: course.title,
        reviewerId: req.user.id,
        comments: comments || ''
      }
    };

    switch (action) {
      case 'approve':
        newStatus = 'approved';
        updateData.approvedAt = new Date();
        
        notificationConfig = {
          ...notificationConfig,
          type: 'course_approved',
          title: 'Course Approved!',
          message: `Great news! Your course "${course.title}" has been approved and is ready for publication.`,
          link: `/instructor/instructor-course`,
          priority: 'high'
        };
        break;
      
      case 'reject':
        newStatus = 'draft'; // Send back to draft for revisions
        
        notificationConfig = {
          ...notificationConfig,
          type: 'course_rejected',
          title: 'Course Review Update',
          message: `Your course "${course.title}" needs revision before it can be approved.${comments ? ' Reviewer comments: ' + comments : ''}`,
          link: `/instructor/instructor-course`,
          priority: 'high'
        };
        break;
      
      case 'request-changes':
        newStatus = 'changes_requested';
        
        notificationConfig = {
          ...notificationConfig,
          type: 'course_changes_requested',
          title: 'Changes Requested for Your Course',
          message: `The reviewer has requested changes to your course "${course.title}".${comments ? ' Comments: ' + comments : ''}`,
          link: `/instructor/create-course`,
          priority: 'normal'
        };
        break;
      
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }

    updateData.status = newStatus;

    // Update course and create notification in a transaction
    const result = await sequelize.transaction(async (t) => {
      // Update course
      await course.update(updateData, { transaction: t });

      // Create notification
      const notification = await Notification.create(notificationConfig, { transaction: t });

      return { course, notification };
    });

    // Optional: Send email notification
    await sendCourseReviewEmail(course.instructor, course, action, comments);

    res.json({
      success: true,
      message: `Course ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'sent for changes'} successfully`,
      data: {
        courseId: course.id,
        status: newStatus,
        action: action,
        notificationSent: true
      }
    });

  } catch (error) {
    console.error('Review course request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to review course request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/admin/course-requests/stats/overview
// @desc    Get overview statistics for dashboard
// @access  Private (Admin only)
router.get('/course-requests/stats/overview', authenticateToken, isAdmin, async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const stats = await Promise.all([
      // Total courses by status
      Course.findAll({
        attributes: [
          'status',
          [Course.sequelize.fn('COUNT', Course.sequelize.col('id')), 'count']
        ],
        group: ['status'],
        raw: true
      }),
      // Courses submitted this week
      Course.count({
        where: {
          submittedAt: {
            [Op.gte]: oneWeekAgo
          }
        }
      }),
      // Courses approved this month
      Course.count({
        where: {
          status: 'approved',
          approvedAt: {
            [Op.gte]: oneMonthAgo
          }
        }
      }),
      // Total instructors with submitted courses
      Course.count({
        distinct: true,
        col: 'instructorId',
        where: {
          status: {
            [Op.in]: ['submitted', 'changes_requested', 'approved']
          }
        }
      })
    ]);

    const statusCounts = stats[0].reduce((acc, item) => {
      acc[item.status] = parseInt(item.count);
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        statusCounts,
        submittedThisWeek: stats[1],
        approvedThisMonth: stats[2],
        activeInstructors: stats[3]
      }
    });

  } catch (error) {
    console.error('Get course requests stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course requests statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/admin/allCourses
// @desc    Get all courses (Admin can see all courses from all instructors and their own)
// @access  Private (Admin only)
router.get('/allCourses', authenticateToken, isAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const status = req.query.status || '';
    const instructorId = req.query.instructorId || ''; // Filter by specific instructor
    const courseType = req.query.courseType || ''; // 'admin' or 'instructor' or '' (all)
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'DESC';

    // Build where clause
    const where = {};

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

    // Filter by specific instructor
    if (instructorId) {
      where.instructorId = instructorId;
    }

    // Build instructor include with role filter
    const instructorInclude = {
      model: User,
      as: 'instructor',
      attributes: ['id', 'firstName', 'lastName', 'email', 'avatar', 'role'],
      required: false
    };

    // Add role filter based on courseType
    if (courseType === 'admin') {
      instructorInclude.where = { role: 'admin' };
      instructorInclude.required = true;
    } else if (courseType === 'instructor') {
      instructorInclude.where = { role: 'instructor' };
      instructorInclude.required = true;
    }

    const { count, rows: courses } = await Course.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        instructorInclude,
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
          ]
        }
      ],
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      distinct: true
    });

    // Calculate total lessons and total duration, and separate by course type
    const coursesWithStats = courses.map(course => {
      const totalLessons = course.sections.reduce((sum, section) => sum + section.lessons.length, 0);
      const totalDuration = course.sections.reduce(
        (sum, section) =>
          sum + section.lessons.reduce((lessonSum, lesson) => lessonSum + (lesson.duration || 0), 0),
        0
      );

      const courseData = course.toJSON();
      
      return {
        ...courseData,
        courseType: courseData.instructor?.role === 'admin' ? 'admin' : 'instructor',
        stats: {
          totalLessons,
          totalDuration,
          sectionsCount: course.sections.length
        }
      };
    });

    // Calculate statistics
    const adminCourses = coursesWithStats.filter(c => c.courseType === 'admin');
    const instructorCourses = coursesWithStats.filter(c => c.courseType === 'instructor');

    const stats = {
      totalCourses: count,
      adminCoursesCount: adminCourses.length,
      instructorCoursesCount: instructorCourses.length,
      statusBreakdown: {
        draft: coursesWithStats.filter(c => c.status === 'draft').length,
        published: coursesWithStats.filter(c => c.status === 'published').length,
        archived: coursesWithStats.filter(c => c.status === 'archived').length,
        pending: coursesWithStats.filter(c => c.status === 'pending').length
      }
    };

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        courses: coursesWithStats,
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
    console.error('Get all courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get all courses'
    });
  }
});

// @route   GET /api/admin/courses/:slug
// @desc    Get course by slug for Admin
// @access  Private (Admin only)
router.get('/courses/:slug', authenticateToken, isAdmin, async (req, res) => {
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

// @route   PUT /api/admin/courses/:courseId/status
// @desc    Update course status (publish/unpublish)
// @access  Private (Admin only)
router.put('/courses/:courseId/status', authenticateToken, isAdmin, [
  body('status')
    .isIn(['draft', 'published', 'submitted'])
    .withMessage('Status must be draft or published')
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

    const { courseId } = req.params;
    const { status } = req.body;

    const course = await Course.findOne({
      where: { 
        id: courseId, 
      }
    });

    if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found or you do not have permission to update it",
        });
      }

      // Update status
      course.status = status;
      await course.save();

      return res.json({
        success: true,
        message: `Course status updated to ${status}`,
        data: {
          id: course.id,
          title: course.title,
          status: course.status,
        },
      });
    } catch (err) {
      console.error("Error updating course status:", err);
      return res.status(500).json({
        success: false,
        message: "Server error while updating course status",
      });
    }
  }
);

// @route   GET /api/admin/students-list
// @desc    Get all students in the system (Admin view)
// @access  Private (Admin only)
router.get('/students-list', authenticateToken, isAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || ''; // Filter by user status (active, pending, suspended)
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'DESC';

    // Build where clause for users (students only)
    const userWhere = {
      role: 'student'
    };

    // Filter by status
    if (status) {
      userWhere.status = status;
    }

    // Search functionality
    if (search) {
      userWhere[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Get all students (users with role 'student')
    const { count, rows: students } = await User.findAndCountAll({
      where: userWhere,
      attributes: [
        'id', 'firstName', 'lastName', 'email', 'avatar', 
        'status', 'isVerified', 'isActive', 'lastLoginAt', 'createdAt'
      ],
      include: [
        {
          model: Enrollment,
          as: 'enrollments',
          where: { isActive: true },
          required: false, // LEFT JOIN to include students with no enrollments
          attributes: ['id', 'progressPercentage', 'enrolledAt', 'completedAt', 'certificateIssued'],
          include: [
            {
              model: Course,
              as: 'course',
              attributes: ['id', 'title', 'slug', 'heroImageUrl'],
              include: [
                {
                  model: User,
                  as: 'instructor',
                  attributes: ['id', 'firstName', 'lastName']
                }
              ]
            }
          ]
        }
      ],
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      distinct: true
    });

    // Transform data for frontend
    const studentListData = students.map(student => {
      const enrollments = student.enrollments || [];
      
      // Calculate student statistics
      const courseCount = enrollments.length;
      const certificateCount = enrollments.filter(e => e.certificateIssued).length;
      
      // Calculate average progress (only for enrolled courses)
      const totalProgress = enrollments.reduce((sum, e) => sum + parseFloat(e.progressPercentage || 0), 0);
      const averageProgress = courseCount > 0 ? totalProgress / courseCount : 0;

      // Get the earliest enrollment date
      const enrollmentDates = enrollments.map(e => new Date(e.enrolledAt));
      const earliestEnrollment = enrollmentDates.length > 0 
        ? new Date(Math.min(...enrollmentDates)) 
        : null;

      // Determine student activity status
      let activityStatus = 'not_enrolled';
      if (courseCount > 0) {
        if (averageProgress === 100) {
          activityStatus = 'completed';
        } else if (averageProgress > 0) {
          activityStatus = 'active';
        } else {
          activityStatus = 'enrolled_not_started';
        }
      }

      // Get last activity date (last login or last enrollment)
      const lastActivity = student.lastLoginAt || (earliestEnrollment ? new Date(Math.max(...enrollmentDates)) : null);

      return {
        studentId: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        fullName: `${student.firstName} ${student.lastName}`,
        email: student.email,
        avatar: student.avatar,
        status: student.status,
        isVerified: student.isVerified,
        isActive: student.isActive,
        joinedDate: student.createdAt, // When they created account
        lastLogin: student.lastLoginAt,
        lastActivity: lastActivity,
        
        // Enrollment statistics
        enrollDate: earliestEnrollment, // First course enrollment
        progressPercentage: parseFloat(averageProgress.toFixed(2)),
        courseCount: courseCount,
        certificateCount: certificateCount,
        activityStatus: activityStatus, // not_enrolled, enrolled_not_started, active, completed
        
        // Course details
        courses: enrollments.map(e => ({
          id: e.course.id,
          title: e.course.title,
          progress: parseFloat(e.progressPercentage || 0),
          enrolledAt: e.enrolledAt,
          completedAt: e.completedAt,
          certificateIssued: e.certificateIssued,
          instructor: e.course.instructor ? {
            id: e.course.instructor.id,
            name: `${e.course.instructor.firstName} ${e.course.instructor.lastName}`
          } : null
        }))
      };
    });

    // Calculate summary statistics - FIXED QUERIES
    const totalStudents = await User.count({
      where: { role: 'student' }
    });

    // Get students with enrollments using a subquery approach
    const studentsWithEnrollments = await User.count({
      where: { role: 'student' },
      include: [{
        model: Enrollment,
        as: 'enrollments',
        required: true
      }]
    });

    // Get students without enrollments using a subquery
    const studentsWithoutEnrollments = totalStudents - studentsWithEnrollments;

    const stats = await Promise.all([
      // Active students (logged in last 30 days)
      User.count({
        where: { 
          role: 'student',
          lastLoginAt: {
            [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      }),
      // New students this month
      User.count({
        where: { 
          role: 'student',
          createdAt: {
            [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      // Verified students
      User.count({
        where: { 
          role: 'student',
          isVerified: true
        }
      }),
      // Students with certificates
      User.count({
        where: { role: 'student' },
        include: [{
          model: Enrollment,
          as: 'enrollments',
          where: { certificateIssued: true },
          required: true
        }]
      })
    ]);

    // Calculate activity breakdown from the current page data
    const activityBreakdown = {
      notEnrolled: studentListData.filter(s => s.activityStatus === 'not_enrolled').length,
      enrolledNotStarted: studentListData.filter(s => s.activityStatus === 'enrolled_not_started').length,
      active: studentListData.filter(s => s.activityStatus === 'active').length,
      completed: studentListData.filter(s => s.activityStatus === 'completed').length
    };

    const summaryStats = {
      totalStudents: totalStudents,
      activeStudents: stats[0], // Logged in last 30 days
      enrolledStudents: studentsWithEnrollments, // Has at least one enrollment
      newStudentsThisMonth: stats[1],
      verifiedStudents: stats[2],
      studentsWithCertificates: stats[3],
      studentsWithoutEnrollments: studentsWithoutEnrollments,
      
      // Activity breakdown (from current page data)
      activityBreakdown: activityBreakdown
    };

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        studentListData: studentListData,
        stats: summaryStats,
        pagination: {
          currentPage: page,
          totalPages,
          totalStudents: count,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get all students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get students list',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/admin/students/status
// @desc    Change Student status
// @access  Private (Admin only)
router.put('/students/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { studentIds, status } = req.body;
    
    await User.update(
      { status },
      { where: { id: studentIds, role: 'student' } }
    );
    
    res.json({ success: true, message: 'Student status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update student status' });
  }
});

// @route   DELETE /api/admin/students
// @desc    Change Student status to deleted
// @access  Private (Admin only)
router.delete('/students', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { ids } = req.query;
    const studentIds = ids.split(',');
    
    await User.update(
      { status: 'deleted', isActive: false },
      { where: { id: studentIds, role: 'student' } }
    );
    
    res.json({ success: true, message: 'Students deleted successfully' });
  } catch (error) {
    console.error('Delete students error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete students',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/admin/students/progress
// @desc    Get student progress overview with filters
// @access  Private (Admin)
router.get('/students/progress', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', filter = '' } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause for students
    const studentWhere = {
      role: 'student',
      status: { [Op.ne]: 'deleted' }
    };

    if (search) {
      studentWhere[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Get students with enrollments and progress
    const students = await User.findAndCountAll({
      where: studentWhere,
      attributes: [
        'id', 'firstName', 'lastName', 'email', 'avatar', 'status',
        'isVerified', 'createdAt', 'lastLoginAt'
      ],
      include: [
        {
          model: Enrollment,
          as: 'enrollments',
          attributes: ['id', 'progressPercentage', 'completedAt', 'totalTimeSpent', 'lastAccessedAt', 'completedLessons'],
          include: [
            {
              model: Course,
              as: 'course',
              attributes: ['id', 'title', 'categoryId', 'specialtyId', 'totalLessons'],
              include: [
                {
                  model: User,
                  as: 'instructor',
                  attributes: ['firstName', 'lastName']
                }
              ]
            }
          ]
        },
        {
          model: Progress,
          as: 'progress',
          attributes: ['lessonId', 'isCompleted', 'watchTime']
        },
        {
          model: StudentCertificate,
          as: 'studentCertificates',
          attributes: ['id']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    // Process student data
    const studentProgress = await Promise.all(
      students.rows.map(async (student) => {
        const enrollments = student.enrollments || [];
        const certificates = student.studentCertificates || [];
        
        // Calculate overall progress metrics
        const totalEnrolledCourses = enrollments.length;
        const completedCourses = enrollments.filter(e => e.progressPercentage === 100).length;
        const totalLearningTime = enrollments.reduce((sum, e) => sum + (e.totalTimeSpent || 0), 0);
        
        // Calculate average progress across all courses
        const averageProgress = totalEnrolledCourses > 0 
          ? Math.round(enrollments.reduce((sum, e) => sum + (e.progressPercentage || 0), 0) / totalEnrolledCourses)
          : 0;

        // Get detailed course progress
        const courseProgress = await Promise.all(
          enrollments.map(async (enrollment) => {
            const course = enrollment.course;
            
            // Get quiz performance for this course
            const quizAttempts = await QuizAttempt.findAll({
              where: { userId: student.id },
              include: [
                {
                  model: Quiz,
                  as: 'quiz',
                  where: { courseId: course.id },
                  attributes: ['id', 'title']
                }
              ]
            });

            const quizPerformance = quizAttempts.length > 0 ? {
              averageScore: Math.round(quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / quizAttempts.length),
              totalAttempts: quizAttempts.length,
              passedQuizzes: quizAttempts.filter(attempt => attempt.score >= 70).length,
              totalQuizzes: await Quiz.count({ where: { courseId: course.id } })
            } : undefined;

            return {
              courseId: course.id,
              courseTitle: course.title,
              category: course.categoryId,
              instructorName: course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'Unknown',
              enrolledAt: enrollment.createdAt,
              progressPercentage: enrollment.progressPercentage || 0,
              completedLessons: enrollment.completedLessons || 0,
              totalLessons: course.totalLessons || 0,
              totalTimeSpent: enrollment.totalTimeSpent || 0,
              lastAccessedAt: enrollment.lastAccessedAt,
              certificateIssued: enrollment.certificateIssued || false,
              quizPerformance
            };
          })
        );

        // Determine activity status based on last login
        const lastLogin = student.lastLoginAt ? new Date(student.lastLoginAt) : null;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const activityStatus = lastLogin && lastLogin > thirtyDaysAgo ? 'active' : 'inactive';

        return {
          studentId: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          fullName: `${student.firstName} ${student.lastName}`,
          email: student.email,
          avatar: student.avatar,
          status: student.status,
          joinedDate: student.createdAt,
          lastLogin: student.lastLoginAt,
          totalEnrolledCourses,
          completedCourses,
          averageProgress,
          totalLearningTime,
          activeCourses: enrollments.filter(e => e.progressPercentage > 0 && e.progressPercentage < 100).length,
          certificateCount: certificates.length,
          activityStatus,
          courseProgress
        };
      })
    );

    // Apply progress filter if specified
    let filteredStudents = studentProgress;
    if (filter) {
      filteredStudents = studentProgress.filter(student => {
        switch (filter) {
          case 'not_started':
            return student.averageProgress === 0;
          case 'beginner':
            return student.averageProgress > 0 && student.averageProgress <= 25;
          case 'intermediate':
            return student.averageProgress > 25 && student.averageProgress <= 50;
          case 'advanced':
            return student.averageProgress > 50 && student.averageProgress <= 75;
          case 'completing':
            return student.averageProgress > 75 && student.averageProgress < 100;
          case 'completed':
            return student.averageProgress === 100;
          default:
            return true;
        }
      });
    }

    // Calculate statistics - FIXED QUERIES
    const totalStudents = await User.count({ 
      where: { 
        role: 'student',
        status: { [Op.ne]: 'deleted' }
      } 
    });

    const activeStudents = await User.count({
      where: {
        role: 'student',
        status: 'active',
        lastLoginAt: {
          [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });

    const totalEnrollments = await Enrollment.count({
      include: [{
        model: User,
        as: 'user',
        where: { role: 'student' }
      }]
    });

    // Calculate average completion rate - FIXED
    const completionRates = await Enrollment.findAll({
      include: [{
        model: User,
        as: 'user',
        where: { role: 'student' },
        attributes: [] // Don't select user columns to avoid GROUP BY issues
      }],
      attributes: ['progressPercentage'],
      raw: true
    });

    const averageCompletionRate = completionRates.length > 0
      ? Math.round(completionRates.reduce((sum, e) => sum + (e.progressPercentage || 0), 0) / completionRates.length)
      : 0;

    // Calculate total learning hours - FIXED
    const totalLearningTimeResult = await Enrollment.findOne({
      include: [{
        model: User,
        as: 'user',
        where: { role: 'student' },
        attributes: []
      }],
      attributes: [
        [sequelize.fn('SUM', sequelize.col('totalTimeSpent')), 'totalTime']
      ],
      raw: true
    });

    const totalLearningTime = totalLearningTimeResult?.totalTime || 0;

    const certificatesIssued = await StudentCertificate.count({
      include: [{
        model: User,
        as: 'student',
        where: { role: 'student' }
      }]
    });

    // Calculate progress breakdown - FIXED
    const progressBreakdown = {
      notStarted: await getStudentsByProgressRange(0, 0),
      beginner: await getStudentsByProgressRange(1, 25),
      intermediate: await getStudentsByProgressRange(26, 50),
      advanced: await getStudentsByProgressRange(51, 75),
      completing: await getStudentsByProgressRange(76, 99),
      completed: await getStudentsByProgressRange(100, 100)
    };

    const totalPages = Math.ceil(filteredStudents.length / limit);
    
    res.json({
      success: true,
      data: {
        studentProgress: filteredStudents.slice(offset, offset + parseInt(limit)),
        stats: {
          totalStudents,
          activeStudents,
          totalEnrollments,
          averageCompletionRate,
          totalLearningHours: Math.round(totalLearningTime / 60), // Convert to hours
          certificatesIssued,
          progressBreakdown
        },
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalStudents: filteredStudents.length,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get student progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student progress'
    });
  }
});

// Helper function to count students by progress range - FIXED
async function getStudentsByProgressRange(minProgress, maxProgress) {
  const students = await User.findAll({
    where: { role: 'student' },
    include: [{
      model: Enrollment,
      as: 'enrollments',
      attributes: ['progressPercentage']
    }],
    attributes: ['id'] // Only select ID to avoid GROUP BY issues
  });

  return students.filter(student => {
    const enrollments = student.enrollments || [];
    if (enrollments.length === 0) return minProgress === 0 && maxProgress === 0;
    
    const averageProgress = Math.round(
      enrollments.reduce((sum, e) => sum + (e.progressPercentage || 0), 0) / enrollments.length
    );
    
    return averageProgress >= minProgress && averageProgress <= maxProgress;
  }).length;
}

// Helper function to count students by progress range
async function getStudentsByProgressRange(minProgress, maxProgress) {
  const students = await User.findAll({
    where: { role: 'student' },
    include: [{
      model: Enrollment,
      as: 'enrollments',
      attributes: ['progressPercentage']
    }]
  });

  return students.filter(student => {
    const enrollments = student.enrollments || [];
    if (enrollments.length === 0) return minProgress === 0 && maxProgress === 0;
    
    const averageProgress = Math.round(
      enrollments.reduce((sum, e) => sum + (e.progressPercentage || 0), 0) / enrollments.length
    );
    
    return averageProgress >= minProgress && averageProgress <= maxProgress;
  }).length;
}

// @route   GET /api/admin/students/:studentId/progress/detailed
// @desc    Get detailed progress for a specific student
// @access  Private (Admin)
router.get('/students/:studentId/progress/detailed', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await User.findOne({
      where: { 
        id: studentId, 
        role: 'student' 
      },
      attributes: ['id', 'firstName', 'lastName', 'email', 'avatar', 'createdAt', 'lastLoginAt']
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get all enrollments with detailed progress
    const enrollments = await Enrollment.findAll({
      where: { userId: studentId },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'categoryId', 'specialtyId', 'totalLessons', 'duration'],
          include: [
            {
              model: User,
              as: 'instructor',
              attributes: ['firstName', 'lastName']
            },
            {
              model: Section,
              as: 'sections',
              attributes: ['id', 'title'],
              include: [{
                model: Lesson,
                as: 'lessons',
                attributes: ['id', 'title', 'type', 'duration']
              }]
            }
          ]
        },
        {
          model: Progress,
          as: 'progressRecords',
          attributes: ['lessonId', 'isCompleted', 'watchTime', 'completedAt', 'lastAccessedAt']
        }
      ]
    });

    // Get certificates
    const certificates = await StudentCertificate.findAll({
      where: { studentId },
      include: [{
        model: Course,
        as: 'course',
        attributes: ['id', 'title']
      }]
    });

    // Get quiz attempts
    const quizAttempts = await QuizAttempt.findAll({
      where: { userId: studentId },
      include: [{
        model: Quiz,
        as: 'quiz',
        attributes: ['id', 'title', 'courseId'],
        include: [{
          model: Course,
          as: 'course',
          attributes: ['title']
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    // Process detailed progress data
    const detailedProgress = enrollments.map(enrollment => {
      const course = enrollment.course;
      const progressRecords = enrollment.progressRecords || [];
      
      // Calculate lesson completion details
      const totalLessons = course.sections?.reduce((sum, section) => sum + (section.lessons?.length || 0), 0) || 0;
      const completedLessons = progressRecords.filter(p => p.isCompleted).length;
      
      // Calculate time spent on this course
      const courseTimeSpent = progressRecords.reduce((sum, p) => sum + (p.watchTime || 0), 0);
      
      // Get quiz performance for this course
      const courseQuizAttempts = quizAttempts.filter(attempt => 
        attempt.quiz.courseId === course.id
      );
      
      const quizPerformance = courseQuizAttempts.length > 0 ? {
        averageScore: Math.round(courseQuizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / courseQuizAttempts.length),
        bestScore: Math.max(...courseQuizAttempts.map(attempt => attempt.score)),
        totalAttempts: courseQuizAttempts.length,
        passedQuizzes: courseQuizAttempts.filter(attempt => attempt.score >= 70).length
      } : null;

      // Check if certificate exists for this course
      const hasCertificate = certificates.some(cert => cert.courseId === course.id);

      return {
        courseId: course.id,
        courseTitle: course.title,
        category: course.categoryId,
        instructorName: course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'Unknown',
        enrolledAt: enrollment.createdAt,
        progressPercentage: enrollment.progressPercentage || 0,
        completedLessons,
        totalLessons,
        totalTimeSpent: courseTimeSpent,
        lastAccessedAt: enrollment.lastAccessedAt,
        certificateIssued: hasCertificate,
        quizPerformance,
        lessonBreakdown: {
          completed: completedLessons,
          inProgress: progressRecords.filter(p => !p.isCompleted && p.watchTime > 0).length,
          notStarted: totalLessons - completedLessons - progressRecords.filter(p => !p.isCompleted && p.watchTime > 0).length
        }
      };
    });

    res.json({
      success: true,
      data: {
        student: {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          avatar: student.avatar,
          joinedDate: student.createdAt,
          lastLogin: student.lastLoginAt
        },
        detailedProgress,
        overallStats: {
          totalCourses: enrollments.length,
          completedCourses: enrollments.filter(e => e.progressPercentage === 100).length,
          averageProgress: Math.round(enrollments.reduce((sum, e) => sum + (e.progressPercentage || 0), 0) / enrollments.length),
          totalLearningTime: enrollments.reduce((sum, e) => sum + (e.totalTimeSpent || 0), 0),
          certificatesCount: certificates.length
        }
      }
    });

  } catch (error) {
    console.error('Get detailed student progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch detailed student progress'
    });
  }
});

// @route   GET /api/admin/certificates
// @desc    Get all certificates for Admin with statistics
// @access  Private (Admin only)
router.get('/certificates', authenticateToken, isAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const courseId = req.query.courseId || '';
    const instructorId = req.query.instructorId || '';
    const isActive = req.query.isActive;

    const whereConditions = {};
    
    // Search functionality
    if (search) {
      whereConditions[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Filter by course
    if (courseId) {
      whereConditions.courseId = courseId;
    }

    // Filter by active status
    if (isActive !== undefined) {
      whereConditions.isActive = isActive === 'true';
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
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      }
    ];

    // Filter by instructor
    if (instructorId) {
      includeOptions[0].where = { instructorId };
    }

    const { count, rows: certificates } = await Certificate.findAndCountAll({
      where: whereConditions,
      include: includeOptions,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      distinct: true
    });

    // Get issued certificate counts for each certificate
    const certificatesWithStats = await Promise.all(
      certificates.map(async (certificate) => {
        const issuedCount = await StudentCertificate.count({
          where: { certificateId: certificate.id }
        });

        return {
          ...certificate.toJSON(),
          issuedCount
        };
      })
    );

    const totalPages = Math.ceil(count / limit);

    // Calculate comprehensive statistics
    const totalCertificates = await Certificate.count();
    const activeCertificates = await Certificate.count({ where: { isActive: true } });
    const inactiveCertificates = totalCertificates - activeCertificates;
    
    // Count certificates with issued student certificates
    const certificatesWithIssued = await Certificate.count({
      include: [{
        model: StudentCertificate,
        as: 'issuedCertificates',
        required: true
      }]
    });

    const certificatesWithoutIssued = totalCertificates - certificatesWithIssued;

    // Calculate activity breakdown for current page results
    const currentPageActive = certificates.filter(c => c.isActive).length;
    const currentPageInactive = certificates.length - currentPageActive;

    const stats = {
      totalCertificates,
      activeCertificates,
      inactiveCertificates,
      certificatesWithIssued,
      certificatesWithoutIssued,
      currentPageStats: {
        total: certificates.length,
        active: currentPageActive,
        inactive: currentPageInactive
      }
    };

    res.json({
      success: true,
      data: {
        certificates: certificatesWithStats,
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
    console.error('Get certificates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificates'
    });
  }
});

// @route   GET /api/admin/users/:userId
// @desc    Get specific user details for admin
// @access  Private (Admin only)
router.get('/users/:userId', authenticateToken, isAdmin, [
  query('userId')
    .isUUID()
    .withMessage('Valid user ID is required')
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

    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      attributes: [
        'id', 
        'firstName', 
        'lastName', 
        'email', 
        'avatar', 
        'role',
        'phone',
        'bio',
        'isActive',
        'emailVerified',
        'lastLoginAt',
        'createdAt',
        'updatedAt'
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user details'
    });
  }
});

module.exports = router;