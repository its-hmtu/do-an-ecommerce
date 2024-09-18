const slugify = require('slugify');
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('categories', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date()
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date()
    }
  }, {
    timestamps: false,
    tableName: 'categories',
    indexes: [
      {
        fields: ['slug']
      }
    ],
    hooks: {
      beforeValidate: (category, options) => {
        category.slug = slugify(category.category_name, { lower: true })
      }
    }
  });

  Category.associate = (models) => {
    Category.hasMany(models.CategoryImage, {as: 'images'});
    Category.belongsToMany(models.Product, {through: models.ProductCategory});
  }

  return Category;
}