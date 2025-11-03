module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    type: {
      type: DataTypes.ENUM('multiple_choice', 'true_false', 'short_answer'),
      defaultValue: 'multiple_choice'
    },
    options: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    correctAnswer: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: 1
      }
    },
    explanation: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    orderIndex: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    quizId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Quizzes',
        key: 'id'
      }
    }
  });

  Question.associate = function(models) {
    Question.belongsTo(models.Quiz, {
      foreignKey: 'quizId',
      as: 'quiz'
    });

    Question.hasMany(models.Answer, {
      foreignKey: 'questionId',
      as: 'answers'
    });
  };

  return Question;
};