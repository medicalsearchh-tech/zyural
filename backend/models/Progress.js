module.exports = (sequelize, DataTypes) => {
  const Progress = sequelize.define('Progress', {
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
    lessonId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Lessons',
        key: 'id'
      }
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    watchTime: {
      type: DataTypes.INTEGER, // in seconds
      defaultValue: 0
    },
    lastPosition: {
      type: DataTypes.INTEGER, // in seconds for videos
      defaultValue: 0
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    // Additional tracking fields
    firstAccessedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lastAccessedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completionPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00,
      validate: {
        min: 0,
        max: 100
      }
    },
    // Quiz-specific progress
    quizAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    bestQuizScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    quizPassed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'Progress',
    timestamps: true,
    indexes: [
      { 
        unique: true, 
        fields: ['userId', 'lessonId'] 
      },
      { fields: ['userId'] },
      { fields: ['lessonId'] },
      { fields: ['isCompleted'] },
      { fields: ['lastAccessedAt'] }
    ]
  });

  Progress.associate = function(models) {
    Progress.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    Progress.belongsTo(models.Lesson, {
      foreignKey: 'lessonId',
      as: 'lesson'
    });
  };

  // Hook to update enrollment progress when lesson progress changes
  Progress.addHook('afterUpdate', async (progress, options) => {
    if (progress.changed('isCompleted') && progress.isCompleted) {
      await updateEnrollmentProgress(progress.userId, progress.lessonId);
    }
  });

  Progress.addHook('afterCreate', async (progress, options) => {
    if (progress.isCompleted) {
      await updateEnrollmentProgress(progress.userId, progress.lessonId);
    }
  });

  // Helper function to update enrollment progress
  async function updateEnrollmentProgress(userId, lessonId) {
    const { Lesson, Section, Course, Enrollment } = sequelize.models;
    
    // Get the lesson and course information
    const lesson = await Lesson.findByPk(lessonId, {
      include: [{
        model: Section,
        as: 'section',
        include: [{
          model: Course,
          as: 'course'
        }]
      }]
    });

    if (!lesson) return;

    const courseId = lesson.section.course.id;

    // Get total lessons in the course
    const totalLessons = await Lesson.count({
      include: [{
        model: Section,
        as: 'section',
        where: { courseId }
      }]
    });

    // Get completed lessons for this user in this course
    const completedLessons = await Progress.count({
      where: {
        userId,
        isCompleted: true
      },
      include: [{
        model: Lesson,
        as: 'lesson',
        include: [{
          model: Section,
          as: 'section',
          where: { courseId }
        }]
      }]
    });

    // Calculate progress percentage
    const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    // Update enrollment
    const enrollment = await Enrollment.findOne({
      where: { userId, courseId }
    });

    if (enrollment) {
      const updateData = {
        progressPercentage,
        completedLessons,
        lastAccessedAt: new Date()
      };

      // Mark as completed if 100% progress
      if (progressPercentage >= 100 && !enrollment.completedAt) {
        updateData.completedAt = new Date();
      }

      await enrollment.update(updateData);
    }
  }

  return Progress;
};