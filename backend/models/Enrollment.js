module.exports = (sequelize, DataTypes) => {
  const Enrollment = sequelize.define('Enrollment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Courses',
        key: 'id'
      }
    },
    enrolledAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    progressPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00,
      validate: {
        min: 0,
        max: 100
      }
    },
    lastAccessedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    certificateIssued: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    certificateUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    // Additional fields for better tracking
    totalTimeSpent: {
      type: DataTypes.INTEGER, // in minutes
      allowNull: false,
      defaultValue: 0
    },
    completedLessons: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    // Payment reference (if paid course)
    paymentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Payments',
        key: 'id'
      }
    },
    enrollmentSource: {
      type: DataTypes.ENUM('direct', 'coupon', 'bulk', 'free'),
      allowNull: false,
      defaultValue: 'direct'
    }
  }, {
    tableName: 'Enrollments',
    timestamps: true,
    indexes: [
      { 
        unique: true, 
        fields: ['userId', 'courseId'] 
      },
      { fields: ['userId'] },
      { fields: ['courseId'] },
      { fields: ['enrolledAt'] },
      { fields: ['isActive'] },
      { fields: ['progressPercentage'] }
    ]
  });

  Enrollment.associate = function(models) {
    Enrollment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    Enrollment.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course'
    });

    Enrollment.belongsTo(models.Payment, {
      foreignKey: 'paymentId',
      as: 'payment'
    });
  };

  return Enrollment;
};