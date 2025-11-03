const express = require('express');
const router = express.Router();
const { User, Course, Section, Lesson, Category, Enrollment } = require('../models');
const { Op } = require('sequelize');

// @route   GET /api/detail-instructors
// @desc    Get all instructors with filters (optimized response)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const level = req.query.level || '';
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'DESC';

    console.log('Fetching instructors with filters:', {
      search, category, level, minPrice, maxPrice, page, limit
    });

    // Build where clause for instructors - SIMPLIFIED
    const instructorWhere = { 
      role: 'instructor'
    };
    
    if (search) {
      instructorWhere[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { expertise: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // First, get instructors without course filters
    const { count, rows: instructors } = await User.findAndCountAll({
      where: instructorWhere,
      attributes: [
        'id', 'firstName', 'lastName', 'email', 'avatar', 'profileImage',
        'expertise', 'bio', 'rating', 'reviewCount', 'isVerified', 'createdAt'
      ],
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      distinct: true
    });

    console.log(`Found ${count} instructors, returning ${instructors.length} for page ${page}`);

    if (instructors.length === 0) {
      return res.json({
        success: true,
        data: {
          instructors: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalInstructors: 0,
            hasNext: false,
            hasPrev: false
          }
        }
      });
    }

    // Get course stats for each instructor
    const instructorsWithStats = await Promise.all(
      instructors.map(async (instructor) => {
        try {
          // Build course query based on filters
          const courseWhere = { 
            instructorId: instructor.id,
            status: 'published'
          };

          // Handle category filter
          if (category) {
            courseWhere.categoryId = category;
          }

          // Handle level filter
          if (level) {
            courseWhere.level = level;
          }

          // Handle price filters - FIXED: Use proper JSON query
          if (minPrice !== null || maxPrice !== null) {
            const priceConditions = [];
            
            if (minPrice !== null) {
              priceConditions.push({
                pricing: {
                  [Op.contains]: { certPrice: { [Op.gte]: minPrice } }
                }
              });
            }
            
            if (maxPrice !== null) {
              priceConditions.push({
                pricing: {
                  [Op.contains]: { certPrice: { [Op.lte]: maxPrice } }
                }
              });
            }

            if (priceConditions.length > 0) {
              courseWhere[Op.and] = priceConditions;
            }
          }

          console.log(`Getting courses for instructor ${instructor.id} with where:`, courseWhere);

          // Get courses for this instructor
          const courses = await Course.findAll({
            where: courseWhere,
            attributes: ['id', 'pricing'],
            include: [
              {
                model: Section,
                as: 'sections',
                attributes: ['id'],
                include: [
                  {
                    model: Lesson,
                    as: 'lessons',
                    attributes: ['id', 'duration']
                  }
                ]
              },
              {
                model: Enrollment,
                as: 'enrollments',
                attributes: ['id']
              }
            ]
          });

          console.log(`Found ${courses.length} courses for instructor ${instructor.id}`);

          // Calculate total lessons, duration, and students
          let totalLessons = 0;
          let totalDuration = 0;
          let totalStudents = 0;

          courses.forEach(course => {
            if (course.sections) {
              course.sections.forEach(section => {
                if (section.lessons) {
                  totalLessons += section.lessons.length;
                  section.lessons.forEach(lesson => {
                    totalDuration += lesson.duration || 0;
                  });
                }
              });
            }
            if (course.enrollments) {
              totalStudents += course.enrollments.length;
            }
          });

          // Convert duration from minutes to hours and minutes
          const hours = Math.floor(totalDuration / 60);
          const minutes = totalDuration % 60;

          return {
            id: instructor.id,
            firstName: instructor.firstName,
            lastName: instructor.lastName,
            fullName: `${instructor.firstName} ${instructor.lastName}`,
            email: instructor.email,
            avatar: instructor.avatar,
            profileImage: instructor.profileImage || instructor.avatar,
            expertise: instructor.expertise || 'Instructor',
            bio: instructor.bio,
            rating: parseFloat(instructor.rating) || 0,
            reviewCount: instructor.reviewCount || 0,
            isVerified: instructor.isVerified || false,
            courseCount: courses.length,
            totalLessons,
            totalDuration: `${hours}hr ${minutes}min`,
            totalStudents,
            createdAt: instructor.createdAt
          };
        } catch (error) {
          console.error(`Error processing instructor ${instructor.id}:`, error);
          // Return basic instructor info even if course stats fail
          return {
            id: instructor.id,
            firstName: instructor.firstName,
            lastName: instructor.lastName,
            fullName: `${instructor.firstName} ${instructor.lastName}`,
            email: instructor.email,
            avatar: instructor.avatar,
            profileImage: instructor.profileImage || instructor.avatar,
            expertise: instructor.expertise || 'Instructor',
            bio: instructor.bio,
            rating: parseFloat(instructor.rating) || 0,
            reviewCount: instructor.reviewCount || 0,
            isVerified: instructor.isVerified || false,
            courseCount: 0,
            totalLessons: 0,
            totalDuration: '0hr 0min',
            totalStudents: 0,
            createdAt: instructor.createdAt
          };
        }
      })
    );

    // Filter out instructors with no courses only if specific filters are applied
    let filteredInstructors = instructorsWithStats;
    if (category || level || minPrice !== null || maxPrice !== null) {
      filteredInstructors = instructorsWithStats.filter(inst => inst.courseCount > 0);
      console.log(`After filtering: ${filteredInstructors.length} instructors remain`);
    }

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        instructors: filteredInstructors,
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
    console.error('Get instructors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get instructors',
      error: error.message
    });
  }
});

// @route   GET /api/detail-instructors/:id
// @desc    Get single instructor details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const instructorId = req.params.id;
    console.log(`Getting instructor details for: ${instructorId}`);

    const instructor = await User.findOne({
      where: {
        id: instructorId,
        role: 'instructor'
      },
      attributes: [
        'id', 'firstName', 'lastName', 'email', 'avatar', 'profileImage',
        'expertise', 'bio', 'rating', 'reviewCount', 'isVerified', 'phone',
        'createdAt'
      ]
    });

    if (!instructor) {
      console.log(`Instructor not found: ${instructorId}`);
      return res.status(404).json({
        success: false,
        message: 'Instructor not found'
      });
    }

    console.log(`Found instructor: ${instructor.firstName} ${instructor.lastName}`);

    // Get instructor's published courses
    const courses = await Course.findAll({
      where: {
        instructorId: instructor.id,
        status: 'published'
      },
      attributes: [
        'id', 'title', 'slug', 'subtitle', 'description', 'heroImageUrl',
        'level', 'pricing', 'averageRating', 'totalReviews', 'totalEnrollments',
        'accreditedCreditHours', 'accreditedCreditType', 'createdAt'
      ],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: Section,
          as: 'sections',
          attributes: ['id'],
          include: [
            {
              model: Lesson,
              as: 'lessons',
              attributes: ['id', 'duration']
            }
          ]
        },
        {
          model: Enrollment,
          as: 'enrollments',
          attributes: ['id']
        }
      ]
    });

    console.log(`Found ${courses.length} courses for instructor`);

    // Calculate stats
    let totalLessons = 0;
    let totalDuration = 0;
    let totalStudents = 0;

    const coursesWithStats = courses.map(course => {
      const courseLessons = course.sections.reduce((sum, section) => 
        sum + (section.lessons ? section.lessons.length : 0), 0
      );
      
      const courseDuration = course.sections.reduce((sum, section) => 
        sum + (section.lessons ? section.lessons.reduce((lessonSum, lesson) => 
          lessonSum + (lesson.duration || 0), 0
        ) : 0), 0
      );

      const courseStudents = course.enrollments ? course.enrollments.length : 0;

      totalLessons += courseLessons;
      totalDuration += courseDuration;
      totalStudents += courseStudents;

      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        subtitle: course.subtitle,
        description: course.description,
        heroImageUrl: course.heroImageUrl,
        level: course.level,
        pricing: course.pricing,
        averageRating: course.averageRating,
        totalReviews: course.totalReviews,
        totalEnrollments: course.totalEnrollments,
        accreditedCreditHours: course.accreditedCreditHours,
        accreditedCreditType: course.accreditedCreditType,
        category: course.category,
        stats: {
          totalLessons: courseLessons,
          totalDuration: Math.round(courseDuration / 60), // Convert to hours
          sectionsCount: course.sections.length,
          studentCount: courseStudents
        }
      };
    });

    const hours = Math.floor(totalDuration / 60);
    const minutes = totalDuration % 60;

    res.json({
      success: true,
      data: {
        instructor: {
          id: instructor.id,
          firstName: instructor.firstName,
          lastName: instructor.lastName,
          fullName: `${instructor.firstName} ${instructor.lastName}`,
          email: instructor.email,
          avatar: instructor.avatar,
          profileImage: instructor.profileImage || instructor.avatar,
          expertise: instructor.expertise,
          bio: instructor.bio,
          rating: parseFloat(instructor.rating) || 0,
          reviewCount: instructor.reviewCount || 0,
          isVerified: instructor.isVerified,
          phone: instructor.phone,
          createdAt: instructor.createdAt
        },
        courses: coursesWithStats,
        stats: {
          courseCount: courses.length,
          totalLessons,
          totalDuration: `${hours}hr ${minutes}min`,
          totalStudents
        }
      }
    });

  } catch (error) {
    console.error('Get instructor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get instructor',
      error: error.message
    });
  }
});

module.exports = router;