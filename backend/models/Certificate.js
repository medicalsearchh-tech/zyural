// models/Certificate.js
const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Certificate = sequelize.define('Certificate', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
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
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Courses',
        key: 'id'
      }
    },
    templateUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    templatePublicId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Cloudinary public ID for template deletion'
    },
    settings: {
      type: DataTypes.TEXT, // JSON string containing certificate settings
      allowNull: true,
      defaultValue: JSON.stringify({
        showInstructorName: true,
        showCompletionDate: true,
        showCourseTitle: true,
        showStudentName: true,
        fontFamily: 'Arial',
        fontSize: {
          studentName: 36,
          courseTitle: 24,
          completionText: 18,
          instructorName: 16
        },
        colors: {
          primary: '#1a1a1a',
          secondary: '#666666',
          accent: '#007bff'
        },
        positions: {
          studentName: { x: 50, y: 45 },
          courseTitle: { x: 50, y: 60 },
          completionDate: { x: 50, y: 75 },
          instructorName: { x: 50, y: 85 }
        }
      })
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'Certificates',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['courseId'], // One certificate per course
        name: 'unique_course_certificate'
      },
      {
        fields: ['createdBy']
      },
      {
        fields: ['isActive']
      }
    ]
  });

  // Class methods
  Certificate.associate = function(models) {
    // Each certificate belongs to one course
    Certificate.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course',
      onDelete: 'CASCADE'
    });

    // Each certificate belongs to one instructor (creator)
    Certificate.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'instructor',
      onDelete: 'CASCADE'
    });
  };

  // Instance methods
  Certificate.prototype.getSettings = function() {
    try {
      return this.settings ? JSON.parse(this.settings) : {};
    } catch (error) {
      console.error('Error parsing certificate settings:', error);
      return {};
    }
  };

  Certificate.prototype.updateSettings = function(newSettings) {
    const currentSettings = this.getSettings();
    const mergedSettings = { ...currentSettings, ...newSettings };
    this.settings = JSON.stringify(mergedSettings);
    return this.save();
  };

  Certificate.prototype.toJSON = function() {
    const values = { ...this.dataValues };
    
    // Parse settings for easier frontend consumption
    if (values.settings) {
      try {
        values.settings = JSON.parse(values.settings);
      } catch (error) {
        values.settings = {};
      }
    }
    
    return values;
  };

  return Certificate;
};