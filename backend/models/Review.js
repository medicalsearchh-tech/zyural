module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
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
    }
  }, {
    indexes: [
      { 
        unique: true, 
        fields: ['userId', 'courseId'] 
      },
      { fields: ['courseId'] },
      { fields: ['rating'] },
      { fields: ['isApproved'] }
    ]
  });

  Review.associate = function(models) {
    Review.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    Review.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course'
    });
  };

  return Review;
};