const express = require('express');
const { body, validationResult } = require('express-validator');
const { User, Course, Enrollment } = require('../models');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { Op } = require('sequelize');
const { sendEmail } = require('../utils/email');
const crypto = require('crypto');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires', 'emailVerificationToken'] },
      include: [
        {
          model: Enrollment,
          as: 'enrollments',
          include: [
            {
              model: Course,
              as: 'course',
              attributes: ['id', 'title', 'heroImageUrl', 'slug']
            }
          ]
        }
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
      data: { user }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Bio must be less than 1000 characters'),
  body('phone')
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
  body('gender')
    .optional()
    .isIn(['male', 'female'])
    .withMessage('Gender must be one of: male, female')
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

    const { firstName, lastName, bio, phone, dateOfBirth, gender } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.update({
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(bio !== undefined && { bio }),
      ...(phone && { phone }),
      ...(dateOfBirth && { dateOfBirth }),
      ...(gender && { gender })
    });

    // Return updated user without sensitive data
    const updatedUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires', 'emailVerificationToken'] }
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// @route   POST /api/users/upload-avatar
// @desc    Upload user avatar
// @access  Private
router.post('/upload-avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'avatars',
          public_id: `avatar_${req.user.id}`,
          transformation: [
            { width: 200, height: 200, crop: 'fill', gravity: 'face' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    // Update user avatar URL
    await User.update(
      { avatar: result.secure_url },
      { where: { id: req.user.id } }
    );

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: { avatarUrl: result.secure_url }
    });

  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload avatar'
    });
  }
});

// @route   DELETE /api/users/profile
// @desc    Delete user account
// @access  Private
router.delete('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete related data first (enrollments, progress, etc.)
    await Enrollment.destroy({ where: { userId: user.id } });
    // Add other related deletions as needed

    // Delete the user
    await user.destroy();

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account'
    });
  }
});

// @route   POST /api/users/change-password
// @desc    Change user password (for authenticated users)
// @access  Private
router.post('/change-password', authenticateToken, [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long')
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

      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // Get current user
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Verify current password
      const isValidPassword = await user.comparePassword(currentPassword);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Update password (hooks will hash it automatically)
      await user.update({
        password: newPassword
      });

      res.json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to change password'
      });
    }
  }
);

// @route   POST /api/users/change-email
// @desc    Change user email (requires verification)
// @access  Private
router.post('/change-email', authenticateToken, [
  body('newEmail')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required')
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

    const { newEmail, currentPassword } = req.body;
    const userId = req.user.id;

    // Get current user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isValidPassword = await user.comparePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Check if new email is same as current
    if (newEmail.toLowerCase() === user.email.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: 'New email must be different from current email'
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({
      where: {
        email: newEmail.toLowerCase(),
        id: { [Op.ne]: userId }
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email address is already in use'
      });
    }

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Send verification email to **newEmail**
    try {
      await sendEmail({
        to: newEmail, // <-- send to new email
        subject: 'Verify Your Email Address',
        template: 'email-verification',
        data: {
          name: user.getFullName(),
          verificationLink: `${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`
        }
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.'
      });
    }

    // If email sent successfully, update user
    await user.update({
      email: newEmail.toLowerCase(),
      isEmailVerified: false,
      emailVerificationToken // store token for later verification
    });

    res.json({
      success: true,
      message: 'Verification email sent. Please check your inbox.',
      data: {
        newEmail: newEmail.toLowerCase()
      }
    });

  } catch (error) {
    console.error('Change email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change email address'
    });
  }
});


module.exports = router;