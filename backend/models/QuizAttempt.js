module.exports = (sequelize, DataTypes) => {
  const QuizAttempt = sequelize.define('QuizAttempt', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    quizId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    totalQuestions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    correctCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    completedAt: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'QuizAttempts',
    timestamps: true
  });

  QuizAttempt.associate = function(models) {
    QuizAttempt.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
      targetKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'NO ACTION'
    });

    QuizAttempt.belongsTo(models.Quiz, {
      as: 'quiz',
      foreignKey: 'quizId',
      targetKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'NO ACTION'
    });

    QuizAttempt.hasMany(models.QuizAttemptAnswer, {
      as: 'answers',
      foreignKey: 'attemptId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };

  return QuizAttempt;
};