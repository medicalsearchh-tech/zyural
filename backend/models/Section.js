module.exports = (sequelize, DataTypes) => {
  const Section = sequelize.define('Section', {
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
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Courses',
        key: 'id'
      }
    },
    // Section metadata
    isPublished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    // Calculated fields (updated by triggers/hooks)
    totalLessons: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    totalDuration: {
      type: DataTypes.INTEGER, // in minutes
      allowNull: false,
      defaultValue: 0
    },
    hasQuiz: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'Sections',
    timestamps: true,
    indexes: [
      { fields: ['courseId'] },
      { fields: ['courseId', 'sortOrder'] },
      { fields: ['isPublished'] }
    ]
  });

  Section.associate = function(models) {
    Section.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course'
    });

    Section.hasMany(models.Lesson, {
      foreignKey: 'sectionId',
      as: 'lessons',
      onDelete: 'CASCADE'
    });

    Section.hasMany(models.Quiz, {
      foreignKey: 'sectionId',
      as: 'quizzes',
      onDelete: 'CASCADE'
    });
  };

  // Hooks to update calculated fields
  Section.addHook('afterCreate', async (section, options) => {
    await updateSectionStats(section.id);
  });

  Section.addHook('afterUpdate', async (section, options) => {
    await updateSectionStats(section.id);
  });

  Section.addHook('afterDestroy', async (section, options) => {
    // Update course stats when section is deleted
    const { Course } = sequelize.models;
    const course = await Course.findByPk(section.courseId);
    if (course) {
      await updateCourseStats(course.id);
    }
  });

  // Helper function to update section statistics
  async function updateSectionStats(sectionId) {
    const { Lesson, Quiz } = sequelize.models;
    
    const section = await Section.findByPk(sectionId);
    if (!section) return;

    const lessons = await Lesson.findAll({
      where: { sectionId },
      attributes: ['duration', 'type']
    });

    const quizzes = await Quiz.findAll({
      where: { sectionId },
      attributes: ['id']
    });

    const totalLessons = lessons.length;
    const totalDuration = lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0);
    const hasQuiz = quizzes.length > 0; // Update to check actual quizzes

    await section.update({
      totalLessons,
      totalDuration,
      hasQuiz
    });

    // Update parent course stats
    await updateCourseStats(section.courseId);
  }

  // Helper function to update course statistics
  async function updateCourseStats(courseId) {
    const { Course } = sequelize.models;
    
    const sections = await Section.findAll({
      where: { courseId },
      include: [{
        model: sequelize.models.Lesson,
        as: 'lessons',
        attributes: ['duration']
      }]
    });

    const totalSections = sections.length;
    let totalLessons = 0;
    let totalDuration = 0;

    sections.forEach(section => {
      totalLessons += section.lessons.length;
      totalDuration += section.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0);
    });

    await Course.update({
      totalSections,
      totalLessons,
      duration: totalDuration
    }, {
      where: { id: courseId }
    });
  }

  return Section;
};