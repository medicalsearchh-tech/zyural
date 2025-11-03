module.exports = (sequelize, DataTypes) => {
  const Lesson = sequelize.define('Lesson', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    sectionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Sections',
        key: 'id'
      }
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
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('video', 'pdf', 'quiz', 'link', 'text'),
      allowNull: false
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    duration: {
      type: DataTypes.INTEGER, // in minutes
      allowNull: false,
      defaultValue: 0
    },
    // Content Management
    contentUrl: {
      type: DataTypes.STRING,
      allowNull: true, // Required for video, pdf, link types
    },
    contentPublicId: {
      type: DataTypes.STRING, // For Cloudinary asset management
      allowNull: true,
    },
    contentSize: {
      type: DataTypes.BIGINT, // File size in bytes
      allowNull: true,
    },
    contentMimeType: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    // Text content for text-based lessons
    textContent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Quiz-specific data
    quizData: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null
      /*
      Structure for quiz lessons:
      {
        title: string,
        passPercentage: number (default 70),
        timeLimit: number, // in minutes
        maxAttempts: number,
        randomizeQuestions: boolean,
        questions: [
          {
            id: string,
            stem: string,
            options: string[],
            correctAnswer: number,
            explanation: string,
            points: number
          }
        ]
      }
      */
    },
    // Access Control - renamed from 'freePreview' to match API usage
    freePreview: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    // Video-specific metadata
    videoMetadata: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null
      /*
      Structure:
      {
        resolution: string,
        bitrate: number,
        fps: number,
        thumbnailUrl: string,
        subtitles: [
          {
            language: string,
            url: string
          }
        ]
      }
      */
    },
    // Completion tracking
    completionCriteria: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        type: 'view', // 'view', 'time', 'interaction'
        threshold: 100 // percentage for time-based, or specific value
      }
    }
  }, {
    tableName: 'Lessons', // Fixed table name capitalization
    timestamps: true,
    indexes: [
      { fields: ['sectionId'] },
      { fields: ['sectionId', 'sortOrder'] },
      { fields: ['type'] },
      { fields: ['freePreview'] },
      { fields: ['isPublished'] }
    ]
  });

  Lesson.associate = function(models) {
    Lesson.belongsTo(models.Section, {
      foreignKey: 'sectionId',
      as: 'section'
    });

    Lesson.hasMany(models.Progress, {
      foreignKey: 'lessonId',
      as: 'progress'
    });
  };

  return Lesson;
};