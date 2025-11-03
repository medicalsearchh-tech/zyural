module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
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
    type: {
      type: DataTypes.ENUM(
        'message',
        'course_approved',
        'course_rejected',
        'course_changes_requested',
        'new_enrollment',
        'payment_received',
        'review_posted',
        'announcement',
        'system'
      ),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'URL to redirect when notification is clicked'
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Additional data like courseId, messageId, etc.'
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    priority: {
      type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
      defaultValue: 'normal'
    }
  }, {
    timestamps: true,
    indexes: [
      {
        fields: ['userId', 'isRead']
      },
      {
        fields: ['userId', 'createdAt']
      },
      {
        fields: ['type']
      }
    ]
  });

  Notification.associate = function(models) {
    Notification.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return Notification;
};