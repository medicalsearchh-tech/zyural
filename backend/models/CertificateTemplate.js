// models/CertificateTemplate.js
const { DataTypes, Op } = require('sequelize'); // ADD Op import

module.exports = (sequelize) => {
  const CertificateTemplate = sequelize.define('CertificateTemplate', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 255]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: true, // Can be global template or course-specific
      references: {
        model: 'Courses',
        key: 'id'
      }
    },
    // Template Design Configuration
    designConfig: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        canvas: {
          width: 1200,
          height: 850,
          backgroundColor: '#FFFFFF',
          backgroundImage: null
        },
        elements: []
      }
    },
    // Dynamic Fields Configuration
    dynamicFields: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        studentName: { enabled: true, required: true, label: 'Student Name' },
        courseTitle: { enabled: true, required: true, label: 'Course Title' },
        completionDate: { enabled: true, required: true, label: 'Completion Date' },
        certificateNumber: { enabled: true, required: true, label: 'Certificate Number' },
        instructorName: { enabled: false, required: false, label: 'Instructor Name' },
        creditHours: { enabled: false, required: false, label: 'Credit Hours' },
        creditType: { enabled: false, required: false, label: 'Credit Type' },
        accreditationBody: { enabled: false, required: false, label: 'Accreditation Body' },
        issueDate: { enabled: false, required: false, label: 'Issue Date' },
        customFields: []
      }
    },
    // Template Settings
    backgroundImageUrl: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    backgroundImagePublicId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    previewImageUrl: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    // Pricing Information
    certificatePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 25.00,
      validate: {
        min: 0
      }
    },
    // Status Management
    status: {
      type: DataTypes.ENUM('draft', 'active', 'archived'),
      defaultValue: 'draft'
    },
    isGlobal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, {
    tableName: 'CertificateTemplates',
    timestamps: true,
    indexes: [
      { 
        unique: true, 
        fields: ['courseId'],
        where: {
          courseId: { [Op.ne]: null } // FIXED: Use imported Op instead of DataTypes.Op
        },
        name: 'unique_course_template'
      },
      { fields: ['courseId'] },
      { fields: ['createdBy'] },
      { fields: ['status'] },
      { fields: ['isGlobal'] }
    ]
  });

  // ==================== UPDATED ASSOCIATIONS ====================
  CertificateTemplate.associate = function(models) {
    // Course association
    CertificateTemplate.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course',
      onDelete: 'CASCADE'
    });

    // Creator association
    CertificateTemplate.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });

    // UPDATED: Changed from IssuedCertificate to StudentCertificate
    CertificateTemplate.hasMany(models.StudentCertificate, {
      foreignKey: 'templateId',
      as: 'issuedCertificates'
    });

    // NEW: Association with Certificate model for legacy support
    CertificateTemplate.hasOne(models.Certificate, {
      foreignKey: 'courseId',
      sourceKey: 'courseId',
      as: 'legacyCertificate',
      constraints: false
    });
  };

  // ==================== ENHANCED INSTANCE METHODS ====================
  
  CertificateTemplate.prototype.addElement = function(element) {
    const designConfig = this.designConfig || { elements: [] };
    designConfig.elements.push({
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...element
    });
    this.designConfig = designConfig;
    return this.save();
  };

  CertificateTemplate.prototype.updateElement = function(elementId, updates) {
    const designConfig = this.designConfig || { elements: [] };
    const elementIndex = designConfig.elements.findIndex(el => el.id === elementId);
    if (elementIndex !== -1) {
      designConfig.elements[elementIndex] = { ...designConfig.elements[elementIndex], ...updates };
      this.designConfig = designConfig;
      return this.save();
    }
    return Promise.resolve(this);
  };

  CertificateTemplate.prototype.removeElement = function(elementId) {
    const designConfig = this.designConfig || { elements: [] };
    designConfig.elements = designConfig.elements.filter(el => el.id !== elementId);
    this.designConfig = designConfig;
    return this.save();
  };

  // NEW: Method to validate template before publishing
  CertificateTemplate.prototype.validateForPublishing = function() {
    const errors = [];
    const warnings = [];

    // Check required dynamic fields are placed on template
    const dynamicFields = this.dynamicFields || {};
    const designElements = this.designConfig?.elements || [];

    if (dynamicFields.studentName && dynamicFields.studentName.required) {
      const hasStudentNameField = designElements.some(el => 
        el.fieldType === 'studentName'
      );
      if (!hasStudentNameField) {
        errors.push('Student name field is required but not placed on template');
      }
    }

    if (dynamicFields.courseTitle && dynamicFields.courseTitle.required) {
      const hasCourseTitleField = designElements.some(el => 
        el.fieldType === 'courseTitle'
      );
      if (!hasCourseTitleField) {
        errors.push('Course title field is required but not placed on template');
      }
    }

    if (dynamicFields.certificateNumber && dynamicFields.certificateNumber.required) {
      const hasCertificateNumberField = designElements.some(el => 
        el.fieldType === 'certificateNumber'
      );
      if (!hasCertificateNumberField) {
        errors.push('Certificate number field is required but not placed on template');
      }
    }

    // Check for background image
    if (!this.backgroundImageUrl) {
      warnings.push('No background image set for template');
    }

    // Check if template has elements
    if (designElements.length === 0) {
      warnings.push('Template has no elements placed');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  // NEW: Method to activate template
  CertificateTemplate.prototype.activate = function() {
    this.status = 'active';
    return this.save();
  };

  // NEW: Method to archive template
  CertificateTemplate.prototype.archive = function() {
    this.status = 'archived';
    return this.save();
  };

  // NEW: Method to get template statistics
  CertificateTemplate.prototype.getStats = async function() {
    const issuedCount = await sequelize.models.StudentCertificate.count({
      where: { templateId: this.id }
    });
    
    return {
      issuedCount,
      isActive: this.status === 'active',
      hasBackground: !!this.backgroundImageUrl,
      elementCount: this.designConfig?.elements?.length || 0
    };
  };

  // ==================== CLASS METHODS ====================
  
  CertificateTemplate.findActiveByCourse = function(courseId) {
    return this.findOne({
      where: {
        courseId,
        status: 'active'
      }
    });
  };

  CertificateTemplate.findGlobalTemplates = function() {
    return this.findAll({
      where: {
        isGlobal: true,
        status: 'active'
      }
    });
  };

  // NEW: Find template for certificate generation
  CertificateTemplate.findForCertificateGeneration = function(courseId) {
    return this.findOne({
      where: {
        [Op.or]: [
          { courseId, status: 'active' },
          { isGlobal: true, status: 'active' }
        ]
      },
      order: [
        // Prefer course-specific templates over global ones
        [sequelize.literal('CASE WHEN "courseId" IS NOT NULL THEN 0 ELSE 1 END'), 'ASC'],
        ['version', 'DESC']
      ]
    });
  };

  return CertificateTemplate;
};