const express = require('express');
const { Course, Enrollment, User, Category, Section, Lesson, Review, Payment } = require('../models');
const { authenticateToken, isInstructor } = require('../middleware/auth');
const { Op } = require('sequelize');
const { sequelize } = require('../models');

const router = express.Router();

// @route   GET /api/instructor/dashboard/stats
// @desc    Get instructor dashboard statistics with revenue split
// @access  Private (Instructor only)
router.get('/dashboard/stats', authenticateToken, isInstructor, async (req, res) => {
  try {
    const instructorId = req.user.id;
    const INSTRUCTOR_SHARE_RATE = 0.40; // 40% for instructor
    const PLATFORM_SHARE_RATE = 0.60; // 60% for platform

    // Calculate date ranges
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    // Get all statistics in parallel
    const [
      totalCourses,
      publishedCourses,
      draftCourses,
      submittedCourses,
      totalEnrollments,
      activeEnrollments,
      totalStudents,
      totalGrossRevenue,
      monthlyGrossRevenue,
      courseRatings,
      recentEnrollments,
      completedEnrollments
    ] = await Promise.all([
      // Total courses count
      Course.count({
        where: { instructorId }
      }),

      // Published courses count
      Course.count({
        where: { 
          instructorId,
          status: 'published'
        }
      }),

      // Draft courses count
      Course.count({
        where: { 
          instructorId,
          status: 'draft'
        }
      }),

      // Submitted courses count (pending review)
      Course.count({
        where: { 
          instructorId,
          status: 'submitted'
        }
      }),

      // Total enrollments across all courses
      Enrollment.count({
        include: [{
          model: Course,
          as: 'course',
          where: { instructorId },
          attributes: []
        }],
        where: { isActive: true }
      }),

      // Active enrollments (last 3 months)
      Enrollment.count({
        include: [{
          model: Course,
          as: 'course',
          where: { instructorId },
          attributes: []
        }],
        where: { 
          isActive: true,
          enrolledAt: { [Op.gte]: threeMonthsAgo }
        }
      }),

      // Unique students count
      Enrollment.count({
        include: [{
          model: Course,
          as: 'course',
          where: { instructorId },
          attributes: []
        }],
        distinct: true,
        col: 'userId'
      }),

      // Total gross revenue (before split)
      Payment.sum('amount', {
        include: [{
          model: Course,
          as: 'course',
          where: { instructorId },
          attributes: []
        }],
        where: { 
          status: 'completed'
        }
      }),

      // Monthly gross revenue (before split)
      Payment.sum('amount', {
        include: [{
          model: Course,
          as: 'course',
          where: { instructorId },
          attributes: []
        }],
        where: { 
          status: 'completed',
          createdAt: { [Op.gte]: oneMonthAgo }
        }
      }),

      // Course ratings and reviews
      Review.findAll({
        include: [{
          model: Course,
          as: 'course',
          where: { instructorId },
          attributes: ['id']
        }],
        attributes: ['rating']
      }),

      // Recent enrollments (last 30 days)
      Enrollment.count({
        include: [{
          model: Course,
          as: 'course',
          where: { instructorId },
          attributes: []
        }],
        where: { 
          isActive: true,
          enrolledAt: { [Op.gte]: oneMonthAgo }
        }
      }),

      // Completed enrollments (for certificate revenue calculation)
      Enrollment.count({
        include: [{
          model: Course,
          as: 'course',
          where: { instructorId },
          attributes: []
        }],
        where: { 
          isActive: true,
          progressPercentage: 100
        }
      })
    ]);

    // Calculate instructor share (40% of gross revenue)
    const totalRevenue = totalGrossRevenue ? totalGrossRevenue * INSTRUCTOR_SHARE_RATE : 0;
    const monthlyRevenue = monthlyGrossRevenue ? monthlyGrossRevenue * INSTRUCTOR_SHARE_RATE : 0;

    // Calculate average rating
    const averageRating = courseRatings.length > 0 
      ? courseRatings.reduce((sum, review) => sum + review.rating, 0) / courseRatings.length
      : 0;

    // Calculate completion rate
    const completionRate = totalEnrollments > 0 
      ? (completedEnrollments / totalEnrollments) * 100 
      : 0;

    const stats = {
      totalCourses,
      publishedCourses,
      draftCourses,
      submittedCourses,
      totalEnrollments,
      activeEnrollments,
      totalStudents,
      recentEnrollments,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      monthlyRevenue: parseFloat(monthlyRevenue.toFixed(2)),
      totalGrossRevenue: totalGrossRevenue || 0,
      monthlyGrossRevenue: monthlyGrossRevenue || 0,
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews: courseRatings.length,
      completionRate: parseFloat(completionRate.toFixed(1)),
      certificateIssued: completedEnrollments,
      revenueShare: {
        instructorRate: INSTRUCTOR_SHARE_RATE * 100, // 40%
        platformRate: PLATFORM_SHARE_RATE * 100,     // 60%
        instructorShare: totalRevenue,
        platformShare: totalGrossRevenue ? totalGrossRevenue * PLATFORM_SHARE_RATE : 0
      }
    };

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get instructor dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/instructor/dashboard/recent-courses
// @desc    Get instructor's recent courses
// @access  Private (Instructor only)
router.get('/dashboard/recent-courses', authenticateToken, isInstructor, async (req, res) => {
  try {
    const instructorId = req.user.id;
    const limit = parseInt(req.query.limit) || 5;

    const courses = await Course.findAll({
      where: { instructorId },
      attributes: [
        'id', 'title', 'slug', 'heroImageUrl', 'status', 
        'createdAt', 'totalEnrollments', 'averageRating'
      ],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name']
        },
        {
          model: Enrollment,
          as: 'enrollments',
          attributes: ['id'],
          where: { isActive: true },
          required: false
        }
      ],
      order: [['createdAt', 'DESC']],
      limit
    });

    // Format response
    const recentCourses = courses.map(course => ({
      id: course.id,
      title: course.title,
      slug: course.slug,
      heroImageUrl: course.heroImageUrl,
      status: course.status,
      category: course.category?.name,
      enrollments: course.enrollments?.length || 0,
      averageRating: course.averageRating || 0,
      createdAt: course.createdAt
    }));

    res.json({
      success: true,
      data: { courses: recentCourses }
    });

  } catch (error) {
    console.error('Get recent courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load recent courses',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/instructor/dashboard/earnings-chart
// @desc    Get earnings data for chart with revenue split
// @access  Private (Instructor only)
router.get('/dashboard/earnings-chart', authenticateToken, isInstructor, async (req, res) => {
  try {
    const instructorId = req.user.id;
    const INSTRUCTOR_SHARE_RATE = 0.40; // 40% for instructor

    const { period = 'year' } = req.query;

    // Calculate date range based on period
    let startDate = new Date();
    if (period === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    }

    // Get payments for the instructor
    const payments = await Payment.findAll({
      attributes: ['id', 'amount', 'createdAt'],
      include: [{
        model: Course,
        as: 'course',
        where: { instructorId },
        attributes: ['id']
      }],
      where: {
        status: 'completed',
        createdAt: { [Op.gte]: startDate }
      },
      order: [['createdAt', 'ASC']],
      raw: true
    });

    // Group payments by month and apply revenue split
    const monthlyEarnings = {};
    payments.forEach(payment => {
      const date = new Date(payment.createdAt);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      // Calculate instructor share (40% of payment amount)
      const instructorShare = parseFloat(payment.amount) * INSTRUCTOR_SHARE_RATE;
      
      if (!monthlyEarnings[monthKey]) {
        monthlyEarnings[monthKey] = {
          month: monthName,
          instructorEarnings: 0,
          grossEarnings: 0
        };
      }
      monthlyEarnings[monthKey].instructorEarnings += instructorShare;
      monthlyEarnings[monthKey].grossEarnings += parseFloat(payment.amount);
    });

    // Format data for chart - last 12 months
    const chartData = {
      categories: [],
      series: [
        {
          name: 'Your Earnings (40%)',
          data: []
        },
        {
          name: 'Platform Share (60%)',
          data: []
        }
      ]
    };

    // Generate last 12 months
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 11 + i, 1);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      const earningsForMonth = monthlyEarnings[monthKey];
      const instructorEarnings = earningsForMonth ? earningsForMonth.instructorEarnings : 0;
      const platformEarnings = earningsForMonth ? earningsForMonth.grossEarnings - instructorEarnings : 0;
      
      chartData.categories.push(monthName);
      chartData.series[0].data.push(parseFloat(instructorEarnings.toFixed(2)));
      chartData.series[1].data.push(parseFloat(platformEarnings.toFixed(2)));
    }

    res.json({
      success: true,
      data: { chartData }
    });

  } catch (error) {
    console.error('Get earnings chart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load earnings data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/instructor/dashboard/revenue-breakdown
// @desc    Get detailed revenue breakdown
// @access  Private (Instructor only)
router.get('/dashboard/revenue-breakdown', authenticateToken, isInstructor, async (req, res) => {
  try {
    const instructorId = req.user.id;
    const INSTRUCTOR_SHARE_RATE = 0.40;

    // Get revenue by course
    const courseRevenues = await Payment.findAll({
      attributes: [
        'courseId',
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalRevenue']
      ],
      include: [{
        model: Course,
        as: 'course',
        where: { instructorId },
        attributes: ['id', 'title']
      }],
      where: {
        status: 'completed'
      },
      group: ['courseId', 'course.id'],
      order: [[sequelize.fn('SUM', sequelize.col('amount')), 'DESC']],
      raw: true
    });

    // Calculate breakdown
    const breakdown = courseRevenues.map(item => {
      const grossRevenue = parseFloat(item.totalRevenue);
      const instructorRevenue = grossRevenue * INSTRUCTOR_SHARE_RATE;
      const platformRevenue = grossRevenue - instructorRevenue;

      return {
        courseId: item.courseId,
        courseTitle: item['course.title'],
        grossRevenue: parseFloat(grossRevenue.toFixed(2)),
        instructorRevenue: parseFloat(instructorRevenue.toFixed(2)),
        platformRevenue: parseFloat(platformRevenue.toFixed(2)),
        instructorShare: `${(INSTRUCTOR_SHARE_RATE * 100)}%`
      };
    });

    // Calculate totals
    const totals = breakdown.reduce((acc, item) => {
      acc.totalGross += item.grossRevenue;
      acc.totalInstructor += item.instructorRevenue;
      acc.totalPlatform += item.platformRevenue;
      return acc;
    }, { totalGross: 0, totalInstructor: 0, totalPlatform: 0 });

    res.json({
      success: true,
      data: {
        breakdown,
        totals,
        shareRate: {
          instructor: INSTRUCTOR_SHARE_RATE * 100,
          platform: (1 - INSTRUCTOR_SHARE_RATE) * 100
        }
      }
    });

  } catch (error) {
    console.error('Get revenue breakdown error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load revenue breakdown',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/instructor/dashboard/quick-stats
// @desc    Get quick overview stats for dashboard cards
// @access  Private (Instructor only)
router.get('/dashboard/quick-stats', authenticateToken, isInstructor, async (req, res) => {
  try {
    const instructorId = req.user.id;

    const [courses, enrollments, revenue, students] = await Promise.all([
      Course.count({ where: { instructorId } }),
      Enrollment.count({
        include: [{
          model: Course,
          as: 'course',
          where: { instructorId }
        }],
        where: { isActive: true }
      }),
      Payment.sum('amount', {
        include: [{
          model: Course,
          as: 'course',
          where: { instructorId }
        }],
        where: { status: 'completed' }
      }),
      Enrollment.count({
        include: [{
          model: Course,
          as: 'course',
          where: { instructorId }
        }],
        distinct: true,
        col: 'userId'
      })
    ]);

    const quickStats = {
      totalCourses: courses,
      totalEnrollments: enrollments,
      totalRevenue: revenue || 0,
      totalStudents: students,
      activeCourses: await Course.count({
        where: { 
          instructorId,
          status: 'published'
        }
      }),
      completedCourses: await Enrollment.count({
        include: [{
          model: Course,
          as: 'course',
          where: { instructorId }
        }],
        where: { 
          isActive: true,
          progressPercentage: 100
        }
      })
    };

    res.json({
      success: true,
      data: { quickStats }
    });

  } catch (error) {
    console.error('Get quick stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load quick stats',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/instructor/dashboard/transactions
// @desc    Get instructor earnings transactions with revenue split
// @access  Private (Instructor only)
router.get('/dashboard/transactions', authenticateToken, isInstructor, async (req, res) => {
  try {
    const instructorId = req.user.id;
    const INSTRUCTOR_SHARE_RATE = 0.40; // 40% for instructor
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    // Build date filter if provided
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    // Get payments for the instructor with student and course information
    const { count, rows: payments } = await Payment.findAndCountAll({
      where: {
        status: 'completed',
        ...dateFilter
      },
      include: [
        {
          model: Course,
          as: 'course',
          where: { instructorId },
          attributes: ['id', 'title', 'slug']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      attributes: [
        'id', 'amount', 'createdAt', 'status', 'paymentMethod',
        [sequelize.literal(`CONCAT('ORD', LPAD("Payment"."id"::text, 7, '0'))`), 'orderId']
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      distinct: true
    });

    // Transform payments into earnings transactions with revenue split
    const transactions = payments.map(payment => {
      const grossAmount = parseFloat(payment.amount);
      const instructorShare = grossAmount * INSTRUCTOR_SHARE_RATE;
      const platformShare = grossAmount - instructorShare;

      return {
        id: payment.orderId,
        paymentId: payment.id,
        courseId: payment.course.id,
        courseTitle: payment.course.title,
        courseSlug: payment.course.slug,
        studentName: `${payment.user.firstName} ${payment.user.lastName}`,
        studentEmail: payment.user.email,
        grossAmount: parseFloat(grossAmount.toFixed(2)),
        instructorShare: parseFloat(instructorShare.toFixed(2)),
        platformShare: parseFloat(platformShare.toFixed(2)),
        createdAt: payment.createdAt,
        paymentMethod: payment.paymentMethod,
        status: payment.status,
        type: 'certificate', // All payments are for certificates in your model
        revenueShare: {
          instructorRate: INSTRUCTOR_SHARE_RATE * 100,
          platformRate: (1 - INSTRUCTOR_SHARE_RATE) * 100
        }
      };
    });

    // Calculate totals
    const totals = transactions.reduce((acc, transaction) => {
      acc.totalGross += transaction.grossAmount;
      acc.totalInstructor += transaction.instructorShare;
      acc.totalPlatform += transaction.platformShare;
      return acc;
    }, { totalGross: 0, totalInstructor: 0, totalPlatform: 0 });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        transactions,
        totals: {
          totalGross: parseFloat(totals.totalGross.toFixed(2)),
          totalInstructor: parseFloat(totals.totalInstructor.toFixed(2)),
          totalPlatform: parseFloat(totals.totalPlatform.toFixed(2)),
          transactionCount: count
        },
        pagination: {
          currentPage: page,
          totalPages,
          totalTransactions: count,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        revenueShare: {
          instructor: INSTRUCTOR_SHARE_RATE * 100,
          platform: (1 - INSTRUCTOR_SHARE_RATE) * 100
        }
      }
    });

  } catch (error) {
    console.error('Get instructor transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load earnings transactions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/instructor/dashboard/transactions/summary
// @desc    Get transactions summary for quick stats
// @access  Private (Instructor only)
router.get('/dashboard/transactions/summary', authenticateToken, isInstructor, async (req, res) => {
  try {
    const instructorId = req.user.id;
    const INSTRUCTOR_SHARE_RATE = 0.40;

    // Calculate date ranges
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    const [
      totalTransactions,
      monthlyTransactions,
      lastMonthTransactions,
      topCourses
    ] = await Promise.all([
      // Total transactions count
      Payment.count({
        include: [{
          model: Course,
          as: 'course',
          where: { instructorId }
        }],
        where: { status: 'completed' }
      }),

      // This month's transactions
      Payment.sum('amount', {
        include: [{
          model: Course,
          as: 'course',
          where: { instructorId }
        }],
        where: { 
          status: 'completed',
          createdAt: { [Op.gte]: startOfMonth }
        }
      }),

      // Last month's transactions for comparison
      Payment.sum('amount', {
        include: [{
          model: Course,
          as: 'course',
          where: { instructorId }
        }],
        where: { 
          status: 'completed',
          createdAt: { 
            [Op.between]: [startOfLastMonth, endOfLastMonth]
          }
        }
      }),

      // Top earning courses
      Payment.findAll({
        attributes: [
          'courseId',
          [sequelize.fn('COUNT', sequelize.col('Payment.id')), 'transactionCount'],
          [sequelize.fn('SUM', sequelize.col('amount')), 'totalRevenue']
        ],
        include: [{
          model: Course,
          as: 'course',
          where: { instructorId },
          attributes: ['id', 'title']
        }],
        where: { status: 'completed' },
        group: ['courseId', 'course.id', 'course.title'],
        order: [[sequelize.fn('SUM', sequelize.col('amount')), 'DESC']],
        limit: 5,
        raw: true
      })
    ]);

    const monthlyGross = monthlyTransactions || 0;
    const lastMonthGross = lastMonthTransactions || 0;
    
    // Calculate growth percentage
    const growthPercentage = lastMonthGross > 0 
      ? ((monthlyGross - lastMonthGross) / lastMonthGross) * 100 
      : monthlyGross > 0 ? 100 : 0;

    const summary = {
      totalTransactions,
      monthlyGross: parseFloat(monthlyGross.toFixed(2)),
      monthlyInstructor: parseFloat((monthlyGross * INSTRUCTOR_SHARE_RATE).toFixed(2)),
      growthPercentage: parseFloat(growthPercentage.toFixed(1)),
      growthTrend: growthPercentage >= 0 ? 'up' : 'down',
      topCourses: topCourses.map(course => ({
        courseId: course.courseId,
        title: course['course.title'],
        transactionCount: parseInt(course.transactionCount),
        totalRevenue: parseFloat(course.totalRevenue),
        instructorRevenue: parseFloat(course.totalRevenue * INSTRUCTOR_SHARE_RATE)
      }))
    };

    res.json({
      success: true,
      data: { summary }
    });

  } catch (error) {
    console.error('Get transactions summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load transactions summary',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;