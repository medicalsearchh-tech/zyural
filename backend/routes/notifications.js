const express = require('express');
const { body, param, validationResult, query } = require('express-validator');
const { Notification, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get all notifications for current user
// @access  Private
router.get('/', authenticateToken, [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('type')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Type must be a valid string'),
  query('isRead')
    .optional()
    .isBoolean()
    .withMessage('isRead must be a boolean')
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

    const userId = req.user.id;
    const { page = 1, limit = 20, type, isRead } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = { userId };
    
    if (type) {
      whereClause.type = type;
    }
    
    if (isRead !== undefined) {
      whereClause.isRead = isRead === 'true';
    }

    const notifications = await Notification.findAndCountAll({
      where: whereClause,
      order: [
        ['priority', 'DESC'], // urgent first
        ['createdAt', 'DESC']
      ],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        notifications: notifications.rows,
        pagination: {
          total: notifications.count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(notifications.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
});

// @route   GET /api/notifications/unread-count
// @desc    Get unread notification count
// @access  Private
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const count = await Notification.count({
      where: {
        userId: req.user.id,
        isRead: false
      }
    });

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unread count'
    });
  }
});

// @route   PATCH /api/notifications/:notificationId/read
// @desc    Mark notification as read
// @access  Private
router.patch('/:notificationId/read', authenticateToken, [
  param('notificationId')
    .isUUID()
    .withMessage('Valid notification ID is required')
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

    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: {
        id: notificationId,
        userId
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.update({
      isRead: true,
      readAt: new Date()
    });

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification'
    });
  }
});

// @route   PATCH /api/notifications/mark-all-read
// @desc    Mark all notifications as read
// @access  Private
router.patch('/mark-all-read', authenticateToken, async (req, res) => {
  try {
    await Notification.update(
      {
        isRead: true,
        readAt: new Date()
      },
      {
        where: {
          userId: req.user.id,
          isRead: false
        }
      }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notifications'
    });
  }
});

// @route   DELETE /api/notifications/:notificationId
// @desc    Delete a notification
// @access  Private
router.delete('/:notificationId', authenticateToken, [
  param('notificationId')
    .isUUID()
    .withMessage('Valid notification ID is required')
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

    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: {
        id: notificationId,
        userId
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.destroy();

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification'
    });
  }
});

// @route   POST /api/notifications/send
// @desc    Send notification to specific user(s) (Admin only)
// @access  Private (Admin)
router.post('/send', authenticateToken, [
  body('userIds')
    .isArray({ min: 1 })
    .withMessage('User IDs array with at least one ID is required'),
  body('userIds.*')
    .isUUID()
    .withMessage('Each user ID must be a valid UUID'),
  body('type')
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Type is required and must be less than 50 characters'),
  body('title')
    .isString()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must be less than 200 characters'),
  body('message')
    .isString()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message is required and must be less than 1000 characters'),
  body('link')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Link must be a valid string'),
  body('priority')
    .optional()
    .isIn(['low', 'normal', 'high', 'urgent'])
    .withMessage('Priority must be one of: low, normal, high, urgent')
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

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can send notifications'
      });
    }

    const { userIds, type, title, message, link, priority = 'normal' } = req.body;

    // Verify users exist
    const users = await User.findAll({
      where: {
        id: { [Op.in]: userIds }
      }
    });

    if (users.length !== userIds.length) {
      return res.status(404).json({
        success: false,
        message: 'One or more users not found'
      });
    }

    // Create notifications
    const notifications = userIds.map(userId => ({
      userId,
      type,
      title,
      message,
      link,
      priority,
      metadata: {
        sentBy: req.user.id,
        sentByName: `${req.user.firstName} ${req.user.lastName}`
      }
    }));

    const createdNotifications = await Notification.bulkCreate(notifications);

    res.status(201).json({
      success: true,
      message: `Notifications sent to ${userIds.length} user(s)`,
      data: createdNotifications
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notifications'
    });
  }
});

module.exports = router;