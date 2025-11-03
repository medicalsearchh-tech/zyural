module.exports = (sequelize, DataTypes) => {
  const Specialty = sequelize.define('Specialty', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    slug: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id'
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    // Additional fields for better organization
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(7), // For hex color codes
      allowNull: true,
    },
    // Metadata for specialty
    totalCourses: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    featuredOrder: {
      type: DataTypes.INTEGER,
      allowNull: true, // null means not featured
    }
  }, {
    tableName: 'Specialties',
    timestamps: true,
    indexes: [
      { fields: ['slug'], unique: true },
      { fields: ['categoryId'] },
      { fields: ['isActive'] },
      { fields: ['name'] },
      { fields: ['sortOrder'] },
      { fields: ['featuredOrder'] }
    ]
  });

  Specialty.associate = function(models) {
    Specialty.belongsTo(models.Category, { 
      foreignKey: 'categoryId', 
      as: 'category' 
    });
    
    Specialty.hasMany(models.Course, { 
      foreignKey: 'specialtyId', 
      as: 'courses' 
    });
  };

  // Hook to update totalCourses when courses are added/removed
  Specialty.addHook('afterFind', async (result, options) => {
    // This hook can be used to include additional computed data if needed
  });

  return Specialty;
};