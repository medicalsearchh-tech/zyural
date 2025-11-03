// UPDATE categories.js route file

const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Category, Specialty, Course } = require('../models');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for category icon uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (PNG, JPG, JPEG, SVG)'), false);
    }
  }
});

// Helper function to upload icon to Cloudinary
const uploadIconToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: 'image',
      folder: 'category-icons',
      quality: 'auto:best',
      transformation: [
        { width: 200, height: 200, crop: 'limit' },
        { quality: 'auto:best' }
      ]
    };

    cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(buffer);
  });
};

// Helper function to delete image from Cloudinary
const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) return;
    
    // Extract public_id from URL
    const parts = imageUrl.split('/');
    const filename = parts[parts.length - 1];
    const publicId = `category-icons/${filename.split('.')[0]}`;
    
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
  }
};

// Helper function to generate slug from name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'name', 'slug', 'icon', 'imageUrl', 'isActive', 'createdAt', 'updatedAt'],
      order: [['sortOrder', 'ASC'], ['name', 'ASC']]
    });

    res.json({
      success: true,
      data: { categories }
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get categories'
    });
  }
});

// @route   GET /api/categories/:id
// @desc    Get single category by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      attributes: ['id', 'name', 'slug', 'icon', 'imageUrl', 'isActive', 'createdAt', 'updatedAt']
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: { category }
    });

  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get category'
    });
  }
});

// @route   POST /api/categories
// @desc    Create new category with icon
// @access  Private/Admin
router.post('/', authenticateToken, isAdmin, upload.single('icon'), async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    // Check if category with same name exists
    const existingCategory = await Category.findOne({
      where: { name: name.trim() }
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const slug = generateSlug(name);

    // Upload icon if provided
    let imageUrl = null;
    if (req.file) {
      try {
        const uploadResult = await uploadIconToCloudinary(req.file.buffer);
        imageUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error('Icon upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload icon'
        });
      }
    }

    const category = await Category.create({
      name: name.trim(),
      slug,
      imageUrl,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: {
        category: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          imageUrl: category.imageUrl,
          isActive: category.isActive,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt
        }
      }
    });

  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category'
    });
  }
});

// @route   PUT /api/categories/:id
// @desc    Update category with icon
// @access  Private/Admin
router.put('/:id', authenticateToken, isAdmin, upload.single('icon'), async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if another category with same name exists
    const { Op } = require('sequelize');
    const existingCategory = await Category.findOne({
      where: { 
        name: name.trim(),
        id: { [Op.ne]: req.params.id }
      }
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const slug = generateSlug(name);
    const updateData = {
      name: name.trim(),
      slug
    };

    // Upload new icon if provided
    if (req.file) {
      try {
        // Delete old icon if exists
        if (category.imageUrl) {
          await deleteFromCloudinary(category.imageUrl);
        }

        // Upload new icon
        const uploadResult = await uploadIconToCloudinary(req.file.buffer);
        updateData.imageUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error('Icon upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload icon'
        });
      }
    }

    await category.update(updateData);

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: {
        category: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          imageUrl: category.imageUrl,
          isActive: category.isActive,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt
        }
      }
    });

  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category'
    });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete category and all associated specialties
// @access  Private/Admin
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has associated courses
    const courseCount = await Course.count({
      where: { categoryId: req.params.id }
    });

    if (courseCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${courseCount} associated courses.`
      });
    }

    // Delete icon from Cloudinary if exists
    if (category.imageUrl) {
      await deleteFromCloudinary(category.imageUrl);
    }

    // Delete all associated specialties first
    await Specialty.destroy({
      where: { categoryId: req.params.id }
    });

    await category.destroy();

    res.json({
      success: true,
      message: 'Category and all associated specialties deleted successfully'
    });

  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category'
    });
  }
});

module.exports = router;