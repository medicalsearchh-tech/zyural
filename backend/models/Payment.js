module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
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
      allowNull: true,
      references: {
        model: 'Courses',
        key: 'id'
      }
    },
    stripePaymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stripeChargeId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD'
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      defaultValue: 'pending'
    },
    paymentType: {
      type: DataTypes.ENUM('course', 'certificate'),
      defaultValue: 'certificate'
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    failureReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    refundReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    indexes: [
      { fields: ['userId'] },
      { fields: ['courseId'] },
      { fields: ['status'] },
      { fields: ['stripePaymentIntentId'] },
      { fields: ['createdAt'] }
    ]
  });

  Payment.associate = function(models) {
    Payment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    Payment.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course'
    });
  };

  return Payment;
};