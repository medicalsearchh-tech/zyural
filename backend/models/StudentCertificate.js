// models/StudentCertificate.js
const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const StudentCertificate = sequelize.define('StudentCertificate', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true
    },
    
    enrollmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Enrollments',
        key: 'id'
      }
    },
    templateId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'CertificateTemplates',
        key: 'id'
      }
    },
    paymentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Payments',
        key: 'id'
      }
    },
    
    // === EXISTING FIELDS (UPDATED) ===
    certificateId: {
      type: DataTypes.UUID,
      allowNull: true, // Now optional since we use templateId
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
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
    
    // === ENHANCED IDENTIFICATION FIELDS ===
    certificateNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    verificationCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    
    // === CERTIFICATE CONTENT FIELDS ===
    studentName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    courseTitle: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    instructorName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    
    // === DATE FIELDS ===
    completionDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    issueDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    
    // === ACCREDITATION FIELDS ===
    creditHours: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    creditType: {
      type: DataTypes.ENUM('CME', 'CPD'),
      allowNull: true
    },
    accreditationBody: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    accreditationId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    
    // === CERTIFICATE FILES ===
    certificateImageUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    certificateImagePublicId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    certificatePdfUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    certificatePdfPublicId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    
    // === STATUS MANAGEMENT ===
    status: {
      type: DataTypes.ENUM('pending', 'generated', 'downloaded', 'issued', 'revoked'),
      allowNull: false,
      defaultValue: 'pending'
    },
    isValid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    
    // === TRACKING FIELDS ===
    downloadedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    issuedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    
    // === ADDITIONAL DATA ===
    metadata: {
      type: DataTypes.TEXT, // JSON string for additional data
      allowNull: true
    },
    
    // === TIMESTAMPS ===
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
    tableName: 'StudentCertificates',
    timestamps: true,
    indexes: [
      // {
      //   unique: true,
      //   fields: ['templateId', 'studentId', 'courseId'],
      //   name: 'unique_student_certificate_per_course'
      // },
      {
        unique: true,
        fields: ['certificateNumber']
      },
      {
        unique: true,
        fields: ['verificationCode']
      },
      {
        fields: ['studentId']
      },
      {
        fields: ['courseId']
      },
      {
        fields: ['enrollmentId']
      },
      {
        fields: ['templateId']
      },
      {
        fields: ['paymentId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['isValid']
      },
      {
        fields: ['issuedAt']
      }
    ]
  });

  // ==================== ENHANCED ASSOCIATIONS ====================
  StudentCertificate.associate = function(models) {
    // Primary template association (NEW)
    StudentCertificate.belongsTo(models.CertificateTemplate, {
      foreignKey: 'templateId',
      as: 'template',
      onDelete: 'CASCADE'
    });

    // Enrollment association (NEW)
    StudentCertificate.belongsTo(models.Enrollment, {
      foreignKey: 'enrollmentId',
      as: 'enrollment',
      onDelete: 'CASCADE'
    });

    // Payment association (NEW)
    StudentCertificate.belongsTo(models.Payment, {
      foreignKey: 'paymentId',
      as: 'payment',
      onDelete: 'SET NULL'
    });

    // Legacy certificate association (keep for backward compatibility)

    StudentCertificate.belongsTo(models.User, {
      foreignKey: 'studentId',
      as: 'student',
      onDelete: 'CASCADE'
    });

    StudentCertificate.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course',
      onDelete: 'CASCADE'
    });
  };

  // ==================== ENHANCED INSTANCE METHODS ====================
  
  StudentCertificate.prototype.generateCertificateNumber = function() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CERT-${timestamp}-${random}`;
  };

  StudentCertificate.prototype.generateVerificationCode = function() {
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `VERIFY-${random}`;
  };

  StudentCertificate.prototype.markAsDownloaded = function() {
    this.downloadedAt = new Date();
    this.status = 'downloaded';
    return this.save();
  };

  StudentCertificate.prototype.markAsGenerated = function() {
    this.status = 'generated';
    return this.save();
  };

  StudentCertificate.prototype.markAsIssued = function() {
    this.status = 'issued';
    return this.save();
  };

  StudentCertificate.prototype.invalidate = function() {
    this.isValid = false;
    return this.save();
  };

  StudentCertificate.prototype.getMetadata = function() {
    try {
      return this.metadata ? JSON.parse(this.metadata) : {};
    } catch (error) {
      console.error('Error parsing certificate metadata:', error);
      return {};
    }
  };

  StudentCertificate.prototype.updateMetadata = function(newMetadata) {
    const currentMetadata = this.getMetadata();
    const mergedMetadata = { ...currentMetadata, ...newMetadata };
    this.metadata = JSON.stringify(mergedMetadata);
    return this.save();
  };

  StudentCertificate.prototype.getCertificateUrl = function() {
    // Prefer PDF over image, fallback to image
    return this.certificatePdfUrl || this.certificateImageUrl;
  };

  // ==================== ENHANCED TOJSON ====================
  StudentCertificate.prototype.toJSON = function() {
    const values = { ...this.dataValues };
    
    // Parse metadata for easier frontend consumption
    if (values.metadata) {
      try {
        values.metadata = JSON.parse(values.metadata);
      } catch (error) {
        values.metadata = {};
      }
    }
    
    // Add computed property for frontend
    values.certificateUrl = this.getCertificateUrl();
    
    return values;
  };

  // ==================== CLASS METHODS ====================
  StudentCertificate.findByVerificationCode = function(verificationCode) {
    return this.findOne({
      where: { verificationCode, isValid: true },
      include: [
        { association: 'template' },
        { association: 'course' },
        { association: 'student' }
      ]
    });
  };

  StudentCertificate.findByCertificateNumber = function(certificateNumber) {
    return this.findOne({
      where: { certificateNumber, isValid: true },
      include: [
        { association: 'template' },
        { association: 'course' },
        { association: 'student' }
      ]
    });
  };

  return StudentCertificate;
};