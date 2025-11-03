module.exports = (sequelize, DataTypes) => {
  const ContactMessage = sequelize.define('ContactMessage', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    subject: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 200]
      }
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [10, 5000]
      }
    },
    status: {
      type: DataTypes.ENUM('new', 'read', 'replied', 'archived'),
      defaultValue: 'new'
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    repliedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'ContactMessages',
    timestamps: true,
    indexes: [
      {
        fields: ['email']
      },
      {
        fields: ['status']
      },
      {
        fields: ['createdAt']
      }
    ]
  });

  return ContactMessage;
};