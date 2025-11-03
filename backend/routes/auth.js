const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');
const { Op } = require('sequelize');
const passport = require('passport');
require('../config/passport'); 


const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['student', 'instructor'])
    .withMessage('Role must be either student or instructor')
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

    const { firstName, lastName, email, password, role = 'student' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(200).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Create new user (but don't verify email yet)
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
      otp: otp,
      otpExpires: otpExpires,
      isEmailVerified: false // Keep false until OTP is verified
    });

    // Send OTP email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Verify Your Email - OTP Code',
        template: 'otp-verification',
        data: {
          name: user.getFullName(),
          otp: otp
        }
      });
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      // Delete user if email fails (since OTP is required)
      await User.destroy({ where: { id: user.id } });
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    // Remove sensitive data
    const userResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for the OTP code.',
      data: {
        user: userResponse,
        requiresOTPVerification: true
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
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

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await user.update({ lastLoginAt: new Date() });

    // Generate token
    const token = generateToken(user.id);

    // Remove sensitive data
    const userResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      isEmailVerified: user.isEmailVerified,
      lastLoginAt: user.lastLoginAt
    };

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to login'
    });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and complete registration
// @access  Public
router.post('/verify-otp', [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('OTP must be 6 digits')
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

    const { email, otp } = req.body;

    // Find user with matching email and OTP
    const user = await User.findOne({ 
      where: { 
        email: email,
        otp: otp,
        otpExpires: {
          [Op.gt]: new Date() // OTP should not be expired
        }
      } 
    });

    if (!user) {
      return res.status(200).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Update user - verify email and clear OTP
    await user.update({
      isEmailVerified: true,
      otp: null,
      otpExpires: null
    });

    // Generate JWT token now that user is verified
    const token = generateToken(user.id);

    // Remove sensitive data
    const userResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt
    };

    // Send welcome email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Welcome to E-Learning Platform!',
        template: 'welcome',
        data: {
          name: user.getFullName()
        }
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send welcome email'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Email verified successfully. Registration completed!',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP'
    });
  }
});

// @route   POST /api/auth/resend-otp
// @desc    Resend OTP to user email
// @access  Public
router.post('/resend-otp', [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
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

    const { email } = req.body;

    // Find user
    const user = await User.findOne({ 
      where: { 
        email: email,
        isEmailVerified: false // Only for unverified users
      } 
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found or already verified'
      });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new OTP
    await user.update({
      otp: otp,
      otpExpires: otpExpires
    });

    // Send new OTP email
    try {
      await sendEmail({
        to: user.email,
        subject: 'New OTP Code - Email Verification',
        template: 'otp-verification',
        data: {
          name: user.getFullName(),
          otp: otp
        }
      });
    } catch (emailError) {
      console.error('Failed to resend OTP email:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'New OTP sent to your email address'
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP'
    });
  }
});

// @route   POST /api/auth/verify-email
// @desc    Verify user email
// @access  Public
router.post('/verify-email', [
  body('token')
    .notEmpty()
    .withMessage('Verification token is required')
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

    const { token } = req.body;

    // Find user with verification token
    const user = await User.findOne({
      where: { emailVerificationToken: token }
    });

    if (!user) {
      return res.status(200).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Update user as verified
    await user.update({
      isEmailVerified: true,
      emailVerificationToken: null
    });

    // Send welcome email
    // try {
    //   await sendEmail({
    //     to: user.email,
    //     subject: 'Welcome to E-Learning Platform!',
    //     template: 'welcome',
    //     data: {
    //       name: user.getFullName()
    //     }
    //   });
    // } catch (emailError) {
    //   console.error('Failed to send welcome email:', emailError);
    //   return res.status(500).json({
    //     success: false,
    //     message: 'Failed to send welcome email'
    //   });
    // }

    res.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify email'
    });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
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

    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if email exists or not
      return res.json({
        success: true,
        message: 'If an account with this email exists, you will receive a password reset email.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires
    });

    // Send reset email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        template: 'password-reset',
        data: {
          name: user.getFullName(),
          resetLink: `${process.env.FRONTEND_URL}/set-password?token=${resetToken}`
        }
      });
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send reset email'
      });
    }

    res.json({
      success: true,
      message: 'Password reset email sent successfully'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request'
    });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset user password
// @access  Public
router.post('/reset-password', [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
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

    const { token, password } = req.body;

    // Find user with valid reset token
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          [require('sequelize').Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      return res.status(200).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password and clear reset token
    await user.update({
      password,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userResponse = {
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
      bio: req.user.bio,
      phone: req.user.phone,
      dateOfBirth: req.user.dateOfBirth,
      isEmailVerified: req.user.isEmailVerified,
      lastLoginAt: req.user.lastLoginAt,
      createdAt: req.user.createdAt
    };

    res.json({
      success: true,
      data: { user: userResponse }
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user information'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});


// @route   GET /api/auth/google
// @desc    Initiate Google OAuth
// @access  Public
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })
);


// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL.endsWith('/') ? process.env.FRONTEND_URL.slice(0, -1) : process.env.FRONTEND_URL}/login?error=google_auth_failed`
  }),
  async (req, res) => {
    try {
      // Generate JWT token for the authenticated user
      const token = generateToken(req.user.id);

      const frontendUrl = process.env.FRONTEND_URL.endsWith('/') 
        ? process.env.FRONTEND_URL.slice(0, -1) 
        : process.env.FRONTEND_URL;
      res.redirect(`${frontendUrl}/auth/google/success?token=${token}`);
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
  }
);

// @route   GET /api/auth/google/success
// @desc    Handle successful Google authentication (optional API endpoint)
// @access  Public
router.get('/google/success', authenticateToken, async (req, res) => {
  try {
    const userResponse = {
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
      bio: req.user.bio,
      isEmailVerified: req.user.isEmailVerified,
      lastLoginAt: req.user.lastLoginAt
    };

    res.json({
      success: true,
      message: 'Google authentication successful',
      data: {
        user: userResponse,
        token: req.headers.authorization.split(' ')[1]
      }
    });
  } catch (error) {
    console.error('Google success error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user information'
    });
  }
});

module.exports = router;
