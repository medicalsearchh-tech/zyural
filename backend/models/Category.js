module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Categories',
        key: 'id'
      }
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    // Additional fields for better categorization
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    color: {
      type: DataTypes.STRING(7), // For hex color codes
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    tableName: 'Categories',
    timestamps: true,
    indexes: [
      { fields: ['slug'], unique: true },
      { fields: ['name'], unique: true },
      { fields: ['parentId'] },
      { fields: ['isActive'] },
      { fields: ['sortOrder'] }
    ]
  });

  Category.associate = function(models) {
    Category.hasMany(models.Course, {
      foreignKey: 'categoryId',
      as: 'courses'
    });
    
    Category.hasMany(models.Specialty, { 
      foreignKey: 'categoryId', 
      as: 'specialties' 
    });
    
    // Self-referencing associations for parent/child categories
    Category.belongsTo(Category, { 
      foreignKey: 'parentId', 
      as: 'parent' 
    });
    
    Category.hasMany(Category, { 
      foreignKey: 'parentId', 
      as: 'subcategories' 
    });
  };

  return Category;
};