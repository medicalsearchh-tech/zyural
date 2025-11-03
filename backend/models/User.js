const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50]
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [6, 100]
      }
    },
    role: {
      type: DataTypes.ENUM('student', 'instructor', 'admin'),
      defaultValue: 'student'
    },
    status: {
      type: DataTypes.ENUM('active', 'pending', 'suspended', 'deleted'),
      defaultValue: 'pending'
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true
    },
    // NEW INSTRUCTOR-SPECIFIC FIELDS
    expertise: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Instructor expertise/specialization (e.g., "Developer", "Finance Expert")'
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'URL to instructor profile/hero image'
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.00,
      validate: {
        min: 0,
        max: 5
      },
      comment: 'Average instructor rating (0-5)'
    },
    reviewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      },
      comment: 'Total number of reviews received'
    },
    // END NEW INSTRUCTOR FIELDS
    otp: {
      type: DataTypes.STRING(6),
      allowNull: true,
      validate: {
        isNumeric: true,
        len: [6, 6]
      }
    },    
    otpExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
        // Set default status based on role
        if (user.role === 'instructor' && !user.status) {
          user.status = 'pending';
        } else if (!user.status) {
          user.status = 'active'; // Students are active by default
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      }
    }
  });

  User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  User.prototype.getFullName = function() {
    return `${this.firstName} ${this.lastName}`;
  };

  // NEW: Get instructor stats
  User.prototype.getInstructorStats = async function(models) {
    if (this.role !== 'instructor') {
      return null;
    }

    const courses = await models.Course.findAll({
      where: { instructorId: this.id, status: 'published' },
      include: [
        {
          model: models.Section,
          as: 'sections',
          include: [
            {
              model: models.Lesson,
              as: 'lessons'
            }
          ]
        },
        {
          model: models.Enrollment,
          as: 'enrollments'
        }
      ]
    });

    let totalLessons = 0;
    let totalDuration = 0;
    let totalStudents = 0;

    courses.forEach(course => {
      totalStudents += course.enrollments ? course.enrollments.length : 0;
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
    });

    const hours = Math.floor(totalDuration / 60);
    const minutes = totalDuration % 60;

    return {
      courseCount: courses.length,
      totalLessons,
      totalDuration: `${hours}hr ${minutes}min`,
      totalStudents
    };
  };

  User.associate = function(models) {
    // Student enrollments
    User.hasMany(models.Enrollment, {
      foreignKey: 'userId',
      as: 'enrollments'
    });

    // Instructor courses
    User.hasMany(models.Course, {
      foreignKey: 'instructorId',
      as: 'instructor'
    });

    // User payments
    User.hasMany(models.Payment, {
      foreignKey: 'userId',
      as: 'payments'
    });

    // User progress
    User.hasMany(models.Progress, {
      foreignKey: 'userId',
      as: 'progress'
    });

    // User reviews
    User.hasMany(models.Review, {
      foreignKey: 'userId',
      as: 'reviews'
    });

    // Messaging associations
    User.belongsToMany(models.Conversation, {
      through: 'ConversationParticipants',
      foreignKey: 'userId',
      otherKey: 'conversationId',
      as: 'conversations'
    });

    User.hasMany(models.Message, {
      foreignKey: 'senderId',
      as: 'sentMessages'
    });

    User.hasMany(models.Notification, {
      foreignKey: 'userId',
      as: 'notifications'
    });

    User.hasMany(models.Conversation, {
      foreignKey: 'initiatorId',
      as: 'initiatedConversations'
    });

    User.hasMany(models.StudentCertificate, {
      foreignKey: 'studentId',
      as: 'studentCertificates',
      onDelete: 'CASCADE'
    });
  };

  return User;
};