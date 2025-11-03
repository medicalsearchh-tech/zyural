const express = require('express');
const { Specialty, Category, Course } = require('../models');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Helper function to generate slug from name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// @route   GET /api/specialties
// @desc    Get all specialties
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { categoryId } = req.query;

    const whereClause = {};
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    const specialties = await Specialty.findAll({
      where: whereClause,
      attributes: ['id', 'name', 'categoryId', 'isActive', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ],
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: { specialties }
    });

  } catch (error) {
    console.error('Get specialties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get specialties'
    });
  }
});

// @route   GET /api/specialties/:id
// @desc    Get single specialty by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const specialty = await Specialty.findByPk(req.params.id, {
      attributes: ['id', 'name', 'categoryId', 'isActive', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ]
    });

    if (!specialty) {
      return res.status(404).json({
        success: false,
        message: 'Specialty not found'
      });
    }

    res.json({
      success: true,
      data: { specialty }
    });

  } catch (error) {
    console.error('Get specialty error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get specialty'
    });
  }
});

// @route   POST /api/specialties
// @desc    Create new specialty
// @access  Private/Admin
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Specialty name is required'
      });
    }

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Category ID is required'
      });
    }

    // Verify category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if specialty with same name exists in this category
    const existingSpecialty = await Specialty.findOne({
      where: { 
        name: name.trim(),
        categoryId 
      }
    });

    if (existingSpecialty) {
      return res.status(400).json({
        success: false,
        message: 'Specialty with this name already exists in this category'
      });
    }

    const slug = generateSlug(name);

    const specialty = await Specialty.create({
      name: name.trim(),
      slug,
      categoryId,
      isActive: true
    });

    // Fetch the created specialty with category info
    const createdSpecialty = await Specialty.findByPk(specialty.id, {
      attributes: ['id', 'name', 'categoryId', 'isActive', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Specialty created successfully',
      data: { specialty: createdSpecialty }
    });

  } catch (error) {
    console.error('Create specialty error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create specialty'
    });
  }
});

// @route   PUT /api/specialties/:id
// @desc    Update specialty
// @access  Private/Admin
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Specialty name is required'
      });
    }

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Category ID is required'
      });
    }

    const specialty = await Specialty.findByPk(req.params.id);

    if (!specialty) {
      return res.status(404).json({
        success: false,
        message: 'Specialty not found'
      });
    }

    // Verify category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if another specialty with same name exists in this category
    const existingSpecialty = await Specialty.findOne({
      where: { 
        name: name.trim(),
        categoryId,
        id: { [require('sequelize').Op.ne]: req.params.id }
      }
    });

    if (existingSpecialty) {
      return res.status(400).json({
        success: false,
        message: 'Specialty with this name already exists in this category'
      });
    }

    const slug = generateSlug(name);

    await specialty.update({
      name: name.trim(),
      slug,
      categoryId
    });

    // Fetch updated specialty with category info
    const updatedSpecialty = await Specialty.findByPk(specialty.id, {
      attributes: ['id', 'name', 'categoryId', 'isActive', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Specialty updated successfully',
      data: { specialty: updatedSpecialty }
    });

  } catch (error) {
    console.error('Update specialty error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update specialty'
    });
  }
});

// @route   DELETE /api/specialties/:id
// @desc    Delete specialty
// @access  Private/Admin
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const specialty = await Specialty.findByPk(req.params.id);

    if (!specialty) {
      return res.status(404).json({
        success: false,
        message: 'Specialty not found'
      });
    }

    // Check if specialty has associated courses
    const courseCount = await Course.count({
      where: { specialtyId: req.params.id }
    });

    if (courseCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete specialty. It has ${courseCount} associated courses.`
      });
    }

    await specialty.destroy();

    res.json({
      success: true,
      message: 'Specialty deleted successfully'
    });

  } catch (error) {
    console.error('Delete specialty error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete specialty'
    });
  }
});

module.exports = router;