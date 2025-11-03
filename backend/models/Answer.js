module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define('Answer', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    timeTaken: {
      type: DataTypes.INTEGER, // in seconds
      allowNull: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    questionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Questions',
        key: 'id'
      }
    }
  });

  Answer.associate = function(models) {
    Answer.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    Answer.belongsTo(models.Question, {
      foreignKey: 'questionId',
      as: 'question'
    });
  };

  return Answer;
};