module.exports = (sequelize, DataTypes) => {
  const QuizAttemptAnswer = sequelize.define(
    "QuizAttemptAnswer",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      attemptId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      questionId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      selectedAnswerId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      isCorrect: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      pointsEarned: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "QuizAttemptAnswers",
      timestamps: true,
      indexes: [
        { fields: ["attemptId"] },
        { fields: ["questionId"] },
        { fields: ["selectedAnswerId"] },
      ],
      uniqueKeys: {
        unique_attempt_question: {
          fields: ["attemptId", "questionId"],
        },
      },
    }
  );

  QuizAttemptAnswer.associate = (models) => {
    QuizAttemptAnswer.belongsTo(models.QuizAttempt, {
      foreignKey: "attemptId",
      as: "attempt",
    });
    QuizAttemptAnswer.belongsTo(models.Question, {
      foreignKey: "questionId",
      as: "question",
    });
    QuizAttemptAnswer.belongsTo(models.Answer, {
      foreignKey: "selectedAnswerId",
      as: "selectedAnswer",
    });
  };

  return QuizAttemptAnswer;
};