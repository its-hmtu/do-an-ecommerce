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
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    slug: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: 'categories',
    hooks: {
      beforeValidate: function (category, options) {
        category.slug = slugify(category.name, { lower: true });
      }
    },
    indexes: [
      {
        fields: ['slug']
      }
    ],
  });

  Category.associate = (models) => {
    Category.hasMany(models.CategoryImage, {as: 'images', foreignKey: 'category_id'});
    Category.hasMany(models.Product, {foreignKey: 'category_id', onDelete: "CASCADE"});
  }
  return Category;
}