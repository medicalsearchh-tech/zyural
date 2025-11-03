const express = require('express');
const { body, param, validationResult, query } = require('express-validator');
const { User, Conversation, Message, Notification } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');
const db = require('../models');

const router = express.Router();

// @route   GET /api/messages/conversations
// @desc    Get all conversations for current user
// @access  Private
router.get('/conversations', authenticateToken, [
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

    const userId = req.user.id;
    const { page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;

    // First, find all conversations where user is a participant
    const userConversations = await Conversation.findAll({
      include: [{
        model: User,
        as: 'participants',
        where: { id: userId },
        through: { attributes: [] },
        attributes: ['id']
      }]
    });

    const conversationIds = userConversations.map(c => c.id);

    if (conversationIds.length === 0) {
      return res.json({
        success: true,
        data: {
          conversations: [],
          pagination: {
            total: 0,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: 0
          }
        }
      });
    }

    // Build where clause for search
    const whereClause = {
      id: { [Op.in]: conversationIds }
    };
    
    if (search) {
      whereClause.lastMessagePreview = {
        [Op.iLike]: `%${search}%`
      };
    }

    // Now fetch full conversation data with ALL participants
    const conversations = await Conversation.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'participants',
          through: { attributes: [] },
          attributes: ['id', 'firstName', 'lastName', 'email', 'avatar', 'role']
        },
        {
          model: User,
          as: 'initiator',
          attributes: ['id', 'firstName', 'lastName', 'email', 'avatar', 'role']
        },
        {
          model: Message,
          as: 'messages',
          limit: 1,
          order: [['createdAt', 'DESC']],
          include: [{
            model: User,
            as: 'sender',
            attributes: ['id', 'firstName', 'lastName', 'avatar']
          }]
        }
      ],
      order: [['lastMessageAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });

    // Get unread count for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.rows.map(async (conv) => {
        const unreadCount = await Message.count({
          where: {
            conversationId: conv.id,
            senderId: { [Op.ne]: userId },
            isRead: false,
            deletedBy: { [Op.not]: { [Op.contains]: [userId] } }
          }
        });

        // Get other participant (not current user)
        const otherParticipant = conv.participants.find(p => p.id !== userId);

        return {
          ...conv.toJSON(),
          unreadCount,
          otherParticipant
        };
      })
    );

    res.json({
      success: true,
      data: {
        conversations: conversationsWithUnread,
        pagination: {
          total: conversations.count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(conversations.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations'
    });
  }
});

// @route   GET /api/messages/conversations/:conversationId
// @desc    Get single conversation details
// @access  Private
router.get('/conversations/:conversationId', authenticateToken, [
  param('conversationId')
    .isUUID()
    .withMessage('Valid conversation ID is required')
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

    const { conversationId } = req.params;
    const userId = req.user.id;

    // Verify user is participant and get conversation details
    const conversation = await Conversation.findByPk(conversationId, {
      include: [
        {
          model: User,
          as: 'participants',
          through: { attributes: [] },
          attributes: ['id', 'firstName', 'lastName', 'email', 'avatar', 'role', 'isOnline', 'lastSeen']
        },
        {
          model: User,
          as: 'initiator',
          attributes: ['id', 'firstName', 'lastName', 'email', 'avatar', 'role']
        },
        {
          model: Message,
          as: 'messages',
          limit: 1,
          order: [['createdAt', 'DESC']],
          include: [{
            model: User,
            as: 'sender',
            attributes: ['id', 'firstName', 'lastName', 'avatar']
          }]
        }
      ]
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Check if user is a participant
    const isParticipant = conversation.participants.some(p => p.id === userId);
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this conversation'
      });
    }

    // Get unread count
    const unreadCount = await Message.count({
      where: {
        conversationId: conversation.id,
        senderId: { [Op.ne]: userId },
        isRead: false,
        deletedBy: { [Op.not]: { [Op.contains]: [userId] } }
      }
    });

    // Get other participant (not current user)
    const otherParticipant = conversation.participants.find(p => p.id !== userId);

    const conversationData = {
      ...conversation.toJSON(),
      unreadCount,
      otherParticipant
    };

    res.json({
      success: true,
      data: {
        conversation: conversationData
      }
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversation'
    });
  }
});

// @route   POST /api/messages/conversations
// @desc    Start a new conversation (Admin only)
// @access  Private (Admin)
router.post('/conversations', authenticateToken, [
  body('recipientId')
    .isUUID()
    .withMessage('Valid recipient ID is required'),
  body('message')
    .isString()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters')
], async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { recipientId, message } = req.body;
    const userId = req.user.id;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: 'Only admins can initiate conversations'
      });
    }

    // Check if recipient exists
    const recipient = await User.findByPk(recipientId, { transaction });
    if (!recipient) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    // Check if conversation already exists between these two users
    const existingConversations = await Conversation.findAll({
      include: [{
        model: User,
        as: 'participants',
        through: { attributes: [] },
        attributes: ['id']
      }],
      transaction
    });

    let conversation = null;
    for (let conv of existingConversations) {
      const participantIds = conv.participants.map(p => p.id);
      if (participantIds.includes(userId) && participantIds.includes(recipientId) && participantIds.length === 2) {
        conversation = conv;
        break;
      }
    }

    if (!conversation) {
      // Create new conversation
      conversation = await Conversation.create({
        initiatorId: userId,
        lastMessagePreview: message.substring(0, 200),
        lastMessageAt: new Date()
      }, { transaction });

      // Fetch user instances to add as participants
      const currentUser = await User.findByPk(userId, { transaction });
      const recipientUser = await User.findByPk(recipientId, { transaction });
      
      // Add participants using User instances, not IDs
      await conversation.addParticipants([currentUser, recipientUser], { transaction });
    }

    // Create message
    const newMessage = await Message.create({
      conversationId: conversation.id,
      senderId: userId,
      content: message
    }, { transaction });

    // Update conversation
    await conversation.update({
      lastMessageAt: new Date(),
      lastMessagePreview: message.substring(0, 200)
    }, { transaction });

    // Create notification for recipient
    await Notification.create({
      userId: recipientId,
      type: 'message',
      title: 'New Message',
      message: `You have a new message from ${req.user.firstName} ${req.user.lastName}`,
      link: `/messages/${conversation.id}`,
      metadata: {
        conversationId: conversation.id,
        messageId: newMessage.id,
        senderId: userId
      }
    }, { transaction });

    await transaction.commit();

    // Fetch full conversation data
    const fullConversation = await Conversation.findByPk(conversation.id, {
      include: [
        {
          model: User,
          as: 'participants',
          attributes: ['id', 'firstName', 'lastName', 'email', 'avatar', 'role']
        },
        {
          model: User,
          as: 'initiator',
          attributes: ['id', 'firstName', 'lastName', 'email', 'avatar', 'role']
        },
        {
          model: Message,
          as: 'messages',
          limit: 1,
          order: [['createdAt', 'DESC']],
          include: [{
            model: User,
            as: 'sender',
            attributes: ['id', 'firstName', 'lastName', 'avatar']
          }]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Conversation created successfully',
      data: {
        conversation: fullConversation
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create conversation'
    });
  }
});

// @route   GET /api/messages/conversations/:conversationId/messages
// @desc    Get messages in a conversation
// @access  Private
router.get('/conversations/:conversationId/messages', authenticateToken, [
  param('conversationId')
    .isUUID()
    .withMessage('Valid conversation ID is required'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
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

    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    const userId = req.user.id;

    // Verify user is participant
    const conversation = await Conversation.findByPk(conversationId, {
      include: [{
        model: User,
        as: 'participants',
        where: { id: userId },
        through: { attributes: [] }
      }]
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or access denied'
      });
    }

    // Get messages
    const messages = await Message.findAndCountAll({
      where: {
        conversationId,
        deletedBy: { [Op.not]: { [Op.contains]: [userId] } }
      },
      include: [{
        model: User,
        as: 'sender',
        attributes: ['id', 'firstName', 'lastName', 'avatar', 'role']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Mark unread messages as read
    await Message.update(
      { isRead: true, readAt: new Date() },
      {
        where: {
          conversationId,
          senderId: { [Op.ne]: userId },
          isRead: false
        }
      }
    );

    res.json({
      success: true,
      data: {
        messages: messages.rows.reverse(), // Reverse to show oldest first
        pagination: {
          total: messages.count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(messages.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
});

// @route   POST /api/messages/conversations/:conversationId/messages
// @desc    Send a message in conversation
// @access  Private
router.post('/conversations/:conversationId/messages', authenticateToken, [
  param('conversationId')
    .isUUID()
    .withMessage('Valid conversation ID is required'),
  body('content')
    .isString()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message content must be between 1 and 1000 characters')
], async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { conversationId } = req.params;
    const { content, attachments } = req.body;
    const userId = req.user.id;

    // Verify user is participant
    const conversation = await Conversation.findByPk(conversationId, {
      include: [{
        model: User,
        as: 'participants',
        through: { attributes: [] }
      }]
    });

    if (!conversation) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const isParticipant = conversation.participants.some(p => p.id === userId);
    if (!isParticipant) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this conversation'
      });
    }

    // Create message
    const newMessage = await Message.create({
      conversationId,
      senderId: userId,
      content: content.trim(),
      attachments: attachments || []
    }, { transaction });

    // Update conversation
    await conversation.update({
      lastMessageAt: new Date(),
      lastMessagePreview: content.substring(0, 200)
    }, { transaction });

    // Create notifications for other participants
    const otherParticipants = conversation.participants.filter(p => p.id !== userId);
    
    const notifications = otherParticipants.map(participant => ({
      userId: participant.id,
      type: 'message',
      title: 'New Message',
      message: `${req.user.firstName} ${req.user.lastName}: ${content.substring(0, 100)}...`,
      link: `/messages/${conversationId}`,
      metadata: {
        conversationId,
        messageId: newMessage.id,
        senderId: userId
      }
    }));

    await Notification.bulkCreate(notifications, { transaction });

    await transaction.commit();

    // Fetch message with sender info
    const messageWithSender = await Message.findByPk(newMessage.id, {
      include: [{
        model: User,
        as: 'sender',
        attributes: ['id', 'firstName', 'lastName', 'avatar', 'role']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: messageWithSender
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
});

// @route   GET /api/messages/unread-count
// @desc    Get unread message count
// @access  Private
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all conversations where user is participant
    const conversations = await Conversation.findAll({
      include: [{
        model: User,
        as: 'participants',
        where: { id: userId },
        through: { attributes: [] }
      }]
    });

    const conversationIds = conversations.map(c => c.id);

    const unreadCount = await Message.count({
      where: {
        conversationId: { [Op.in]: conversationIds },
        senderId: { [Op.ne]: userId },
        isRead: false,
        deletedBy: { [Op.not]: { [Op.contains]: [userId] } }
      }
    });

    res.json({
      success: true,
      data: { unreadCount }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unread count'
    });
  }
});

module.exports = router;