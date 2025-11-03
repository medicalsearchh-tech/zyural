module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define('Conversation', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    initiatorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      comment: 'User who started the conversation (usually admin)'
    },
    lastMessageAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    lastMessagePreview: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    timestamps: true,
    indexes: [
      {
        fields: ['initiatorId']
      },
      {
        fields: ['lastMessageAt']
      }
    ]
  });

  Conversation.associate = function(models) {
    // Initiator of conversation
    Conversation.belongsTo(models.User, {
      foreignKey: 'initiatorId',
      as: 'initiator'
    });

    // Many-to-many relationship with users (participants)
    Conversation.belongsToMany(models.User, {
      through: 'ConversationParticipants',
      foreignKey: 'conversationId',
      otherKey: 'userId',
      as: 'participants'
    });

    // Messages in conversation
    Conversation.hasMany(models.Message, {
      foreignKey: 'conversationId',
      as: 'messages',
      onDelete: 'CASCADE'
    });
  };

  return Conversation;
};