module.exports = (sequelize, DataTypes) => {
  const Quiz = sequelize.define('Quiz', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 200]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    timeLimit: {
      type: DataTypes.INTEGER, // in minutes
      allowNull: true
    },
    passingScore: {
      type: DataTypes.INTEGER,
      defaultValue: 70,
      validate: {
        min: 0,
        max: 100
      }
    },
    maxAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
      validate: {
        min: 1
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    // ADD SECTION ID
    sectionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Sections',
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
    instructorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    // Additional quiz configuration
    randomizeQuestions: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    showCorrectAnswers: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    allowReview: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    // Quiz metadata
    totalQuestions: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalPoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    // Scheduling
    availableFrom: {
      type: DataTypes.DATE,
      allowNull: true
    },
    availableUntil: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'Quizzes',
    timestamps: true,
    indexes: [
      { fields: ['courseId'] },
      { fields: ['sectionId'] }, // ADD SECTION INDEX
      { fields: ['instructorId'] },
      { fields: ['isActive'] },
      { fields: ['availableFrom'] },
      { fields: ['availableUntil'] }
    ]
  });

  Quiz.associate = function(models) {
    Quiz.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course'
    });

    // ADD SECTION ASSOCIATION
    Quiz.belongsTo(models.Section, {
      foreignKey: 'sectionId',
      as: 'section'
    });

    Quiz.belongsTo(models.User, {
      foreignKey: 'instructorId',
      as: 'instructor'
    });

    Quiz.hasMany(models.Question, {
      foreignKey: 'quizId',
      as: 'questions',
      onDelete: 'CASCADE'
    });

    Quiz.hasMany(models.QuizAttempt, {
      foreignKey: 'quizId',
      as: 'attempts',
      onDelete: 'CASCADE'
    });
  };

  return Quiz;
};