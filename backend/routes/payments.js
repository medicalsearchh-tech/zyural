const express = require('express');
const { body, validationResult } = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Payment, Course, User, Enrollment } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/payments/create-payment-intent
// @desc    Create payment intent for certificate purchase
// @access  Private
router.post('/create-payment-intent', authenticateToken, [
  body('courseId')
    .isUUID()
    .withMessage('Valid course ID is required'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Valid amount is required')
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

    const { courseId, amount } = req.body;
    const userId = req.user.id;

    // Verify course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({
      where: { userId, courseId }
    });

    if (!enrollment) {
      return res.status(400).json({
        success: false,
        message: 'You must be enrolled in the course to purchase a certificate'
      });
    }

    // Check if course is completed
    if (!enrollment.completedAt) {
      return res.status(400).json({
        success: false,
        message: 'You must complete the course before purchasing a certificate'
      });
    }

    // Check if certificate already purchased
    const existingPayment = await Payment.findOne({
      where: {
        userId,
        courseId,
        paymentType: 'certificate',
        status: 'completed'
      }
    });

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'Certificate already purchased for this course'
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId,
        courseId,
        paymentType: 'certificate'
      }
    });

    // Save payment record
    const payment = await Payment.create({
      userId,
      courseId,
      stripePaymentIntentId: paymentIntent.id,
      amount,
      currency: 'USD',
      status: 'pending',
      paymentType: 'certificate',
      metadata: {
        courseTitle: course.title
      }
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentId: payment.id
      }
    });

  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent'
    });
  }
});

// @route   POST /api/payments/confirm
// @desc    Confirm payment and issue certificate
// @access  Private
router.post('/confirm', authenticateToken, [
  body('paymentIntentId')
    .notEmpty()
    .withMessage('Payment intent ID is required')
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

    const { paymentIntentId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }

    // Find payment record
    const payment = await Payment.findOne({
      where: { stripePaymentIntentId: paymentIntentId }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // Update payment status
    await payment.update({
      status: 'completed',
      stripeChargeId: paymentIntent.latest_charge,
      transactionId: paymentIntent.id
    });

    // Issue certificate
    const enrollment = await Enrollment.findOne({
      where: {
        userId: payment.userId,
        courseId: payment.courseId
      }
    });

    if (enrollment) {
      const certificateUrl = `${process.env.FRONTEND_URL}/certificate/${enrollment.id}`;
      await enrollment.update({
        certificateIssued: true,
        certificateUrl
      });
    }

    res.json({
      success: true,
      message: 'Payment confirmed and certificate issued successfully',
      data: {
        payment,
        certificateUrl: enrollment?.certificateUrl
      }
    });

  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment'
    });
  }
});

// @route   GET /api/payments/history
// @desc    Get user payment history
// @access  Private
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: payments } = await Payment.findAndCountAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'heroImageUrl', 'slug']
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          currentPage: page,
          totalPages,
          totalPayments: count,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment history'
    });
  }
});

// @route   POST /api/payments/refund
// @desc    Request refund for a payment
// @access  Private
router.post('/refund', authenticateToken, [
  body('paymentId')
    .isUUID()
    .withMessage('Valid payment ID is required'),
  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Refund reason is required')
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

    const { paymentId, reason } = req.body;

    // Find payment
    const payment = await Payment.findOne({
      where: {
        id: paymentId,
        userId: req.user.id,
        status: 'completed'
      }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found or not eligible for refund'
      });
    }

    // Check if payment is within refund period (30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    if (payment.createdAt < thirtyDaysAgo) {
      return res.status(400).json({
        success: false,
        message: 'Refund period has expired (30 days)'
      });
    }

    // Create refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
      reason: 'requested_by_customer'
    });

    // Update payment record
    await payment.update({
      status: 'refunded',
      refundReason: reason,
      metadata: {
        ...payment.metadata,
        refundId: refund.id,
        refundedAt: new Date()
      }
    });

    // Revoke certificate if applicable
    if (payment.paymentType === 'certificate') {
      const enrollment = await Enrollment.findOne({
        where: {
          userId: payment.userId,
          courseId: payment.courseId
        }
      });

      if (enrollment) {
        await enrollment.update({
          certificateIssued: false,
          certificateUrl: null
        });
      }
    }

    res.json({
      success: true,
      message: 'Refund processed successfully'
    });

  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process refund'
    });
  }
});

// @route   POST /api/payments/webhook
// @desc    Stripe webhook handler
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handlePaymentSuccess(paymentIntent);
        break;
        
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await handlePaymentFailure(failedPayment);
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Helper function to handle successful payments
async function handlePaymentSuccess(paymentIntent) {
  const payment = await Payment.findOne({
    where: { stripePaymentIntentId: paymentIntent.id }
  });

  if (payment && payment.status === 'pending') {
    await payment.update({
      status: 'completed',
      stripeChargeId: paymentIntent.latest_charge,
      transactionId: paymentIntent.id
    });

    // Issue certificate if payment is for certificate
    if (payment.paymentType === 'certificate') {
      const enrollment = await Enrollment.findOne({
        where: {
          userId: payment.userId,
          courseId: payment.courseId
        }
      });

      if (enrollment) {
        const certificateUrl = `${process.env.FRONTEND_URL}/certificate/${enrollment.id}`;
        await enrollment.update({
          certificateIssued: true,
          certificateUrl
        });
      }
    }
  }
}

// Helper function to handle failed payments
async function handlePaymentFailure(paymentIntent) {
  const payment = await Payment.findOne({
    where: { stripePaymentIntentId: paymentIntent.id }
  });

  if (payment) {
    await payment.update({
      status: 'failed',
      failureReason: paymentIntent.last_payment_error?.message || 'Payment failed'
    });
  }
}

// @route   GET /api/payments/stats (Admin/Instructor)
// @desc    Get payment statistics
// @access  Private
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const { role } = req.user;
    
    let whereClause = {};
    
    if (role === 'instructor') {
      // Get payments for instructor's courses
      const instructorCourses = await Course.findAll({
        where: { instructorId: req.user.id },
        attributes: ['id']
      });
      
      const courseIds = instructorCourses.map(course => course.id);
      whereClause.courseId = { [require('sequelize').Op.in]: courseIds };
    }

    const totalPayments = await Payment.count({
      where: { ...whereClause, status: 'completed' }
    });

    const totalRevenue = await Payment.sum('amount', {
      where: { ...whereClause, status: 'completed' }
    });

    const monthlyRevenue = await Payment.sum('amount', {
      where: {
        ...whereClause,
        status: 'completed',
        createdAt: {
          [require('sequelize').Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    });

    res.json({
      success: true,
      data: {
        totalPayments,
        totalRevenue: totalRevenue || 0,
        monthlyRevenue: monthlyRevenue || 0
      }
    });

  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment statistics'
    });
  }
});

module.exports = router;