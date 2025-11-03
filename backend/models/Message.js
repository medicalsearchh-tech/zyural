module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    conversationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Conversations',
        key: 'id'
      }
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 5000]
      }
    },
    attachments: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Array of attachment objects with fileName, fileUrl, fileType, fileSize'
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deletedBy: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Array of user IDs who deleted this message'
    }
  }, {
    timestamps: true,
    indexes: [
      {
        fields: ['conversationId', 'createdAt']
      },
      {
        fields: ['senderId']
      },
      {
        fields: ['isRead']
      }
    ]
  });

  Message.associate = function(models) {
    Message.belongsTo(models.Conversation, {
      foreignKey: 'conversationId',
      as: 'conversation'
    });

    Message.belongsTo(models.User, {
      foreignKey: 'senderId',
      as: 'sender'
    });
  };

  return Message;
};