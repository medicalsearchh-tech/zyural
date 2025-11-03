module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 120]
      }
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      }
    },
    subtitle: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    instructorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id'
      }
    },
    specialtyId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Specialties',
        key: 'id'
      }
    },
    level: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
      allowNull: false,
      defaultValue: 'beginner'
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'English'
    },
    duration: {
      type: DataTypes.INTEGER, // in minutes - renamed from 'duration' to match API
      allowNull: false,
      defaultValue: 0
    },
    learningObjectives: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    targetAudience: {
      type: DataTypes.JSON, // Array of audience types
      allowNull: true,
      defaultValue: []
    },
    conflictOfInterest: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        hasConflict: false,
        description: null
      }
    },
    heroImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    heroImagePublicId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    promoVideo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Course Status Management
    status: {
      type: DataTypes.ENUM('draft', 'submitted', 'changes_requested', 'approved', 'published', 'archived'),
      allowNull: false,
      defaultValue: 'draft'
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reviewFeedback: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Accreditation Information
    accreditationRequest: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null
      /*
      Structure:
      {
        creditType: 'CME' | 'CPD',
        creditHours: number,
        accreditationBody: string,
        reviewerNotes: string,
        supportingDocuments: [
          {
            url: string,
            publicId: string,
            originalName: string
          }
        ],
        submittedAt: Date
      }
      */
    },
    accreditationStatus: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: true,
    },
    accreditedCreditHours: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    accreditedCreditType: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    // Pricing Information
    pricing: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        price: 0,
        currency: 'USD',
        accessType: 'one-time-purchase',
        visibility: 'public',
        certPrice: 0
      }
      /*
      Structure:
      {
        price: number,
        currency: string,
        accessType: 'one-time-purchase',
        visibility: 'public' | 'unlisted'
      }
      */
    },
    // SEO Settings
    seoSettings: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        metaTitle: '',
        metaDescription: '',
        keywords: [],
        termsAccepted: false
      }
      /*
      Structure:
      {
        metaTitle: string,
        metaDescription: string,
        keywords: string[],
        termsAccepted: boolean
      }
      */
    },
    // Analytics and Stats
    totalEnrollments: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    totalRevenue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    averageRating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: true,
      validate: {
        min: 0,
        max: 5
      }
    },
    totalReviews: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    // Content completion tracking
    totalLessons: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    totalSections: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    // Featured and promotional
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    featuredAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    tableName: 'Courses',
    timestamps: true,
    indexes: [
      { fields: ['slug'], unique: true },
      { fields: ['instructorId'] },
      { fields: ['categoryId'] },
      { fields: ['specialtyId'] },
      { fields: ['status'] },
      { fields: ['publishedAt'] },
      { fields: ['isFeatured'] },
      { fields: ['createdAt'] }
    ]
  });

  Course.associate = function(models) {
    // Course belongs to instructor
    Course.belongsTo(models.User, {
      foreignKey: 'instructorId',
      as: 'instructor'
    });

    // Course belongs to category
    Course.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });

    // Course belongs to Specialty
    Course.belongsTo(models.Specialty, {
      foreignKey: 'specialtyId',
      as: 'specialty'
    });

    // Course has many sections
    Course.hasMany(models.Section, {
      foreignKey: 'courseId',
      as: 'sections',
      onDelete: 'CASCADE'
    });

    // Course has many enrollments
    Course.hasMany(models.Enrollment, {
      foreignKey: 'courseId',
      as: 'enrollments'
    });

    // Course has many reviews
    Course.hasMany(models.Review, {
      foreignKey: 'courseId',
      as: 'reviews'
    });

    // Course has many quiz
    Course.hasMany(models.Quiz, {
      foreignKey: 'courseId',
      as: 'quizzes'
    });

    // Course has many payments
    Course.hasMany(models.Payment, {
      foreignKey: 'courseId',
      as: 'payments'
    });
    
    Course.hasOne(models.Certificate, {
      foreignKey: 'courseId',
      as: 'certificate'
    });

    Course.hasMany(models.CertificateTemplate, {
      foreignKey: 'courseId',
      as: 'certificateTemplates'
    });

    Course.hasMany(models.SyllabusDocument, {
      foreignKey: 'courseId',
      as: 'syllabusDocuments'
    });
  };

  return Course;
};