module.exports = (sequelize, DataTypes) => {
  const SyllabusDocument = sequelize.define('SyllabusDocument', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
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
    // File information
    originalFileName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    filePublicId: {
      type: DataTypes.STRING, // Cloudinary public ID
      allowNull: true
    },
    fileSize: {
      type: DataTypes.BIGINT, // in bytes
      allowNull: false
    },
    fileType: {
      type: DataTypes.STRING(50), // pdf, doc, docx
      allowNull: false
    },
    mimeType: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    // Processing status
    processingStatus: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
      allowNull: false,
      defaultValue: 'pending'
    },
    processingError: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    // Extracted content
    extractedText: {
      type: DataTypes.TEXT('long'), // Full text extracted from document
      allowNull: true
    },
    extractedStructure: {
      type: DataTypes.JSON,
      allowNull: true
      /*
      Structure:
      {
        totalPages: number,
        sections: [
          {
            title: string,
            pageNumber: number,
            content: string,
            lessons: [
              {
                title: string,
                content: string,
                duration: number
              }
            ]
          }
        ]
      }
      */
    },
    // Metadata
    documentMetadata: {
      type: DataTypes.JSON,
      allowNull: true
      /*
      Structure:
      {
        pageCount: number,
        author: string,
        createdDate: string,
        modifiedDate: string,
        wordCount: number,
        language: string
      }
      */
    },
    // AI/ML processing results
    aiProcessingResults: {
      type: DataTypes.JSON,
      allowNull: true
      /*
      Structure:
      {
        confidence: number,
        detectedSections: number,
        detectedLessons: number,
        suggestedDuration: number,
        keywords: string[]
      }
      */
    },
    // Applied to course
    isAppliedToCourse: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    appliedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'SyllabusDocuments',
    timestamps: true,
    indexes: [
      { fields: ['courseId'] },
      { fields: ['instructorId'] },
      { fields: ['processingStatus'] },
      { fields: ['isAppliedToCourse'] },
      { fields: ['createdAt'] }
    ]
  });

  SyllabusDocument.associate = function(models) {
    SyllabusDocument.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course'
    });

    SyllabusDocument.belongsTo(models.User, {
      foreignKey: 'instructorId',
      as: 'instructor'
    });
  };

  return SyllabusDocument;
};