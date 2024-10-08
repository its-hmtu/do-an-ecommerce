const { Op } = require('sequelize')
const slugify = require('slugify')

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('products', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    product_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    base_price: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false
    },
    product_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    total_in_stock: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }, 
    main_image_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    product_colors: {
      type: DataTypes.JSON,
      allowNull: true
    },
    product_sizes: {
      type: DataTypes.JSON,
      allowNull: true
    },
    availability: {
      type: DataTypes.ENUM('in-stock', 'out-of-stock'),
      allowNull: false,
      defaultValue: 'in-stock'
    }
  }, {
    timestamps: true,
    tableName: 'products',
    indexes: [
      {
        fields: ['slug']
      }
    ],
    hooks: {
      beforeValidate: (product, options) => {
        product.slug = slugify(product.product_name, { lower: true })
      }
    }
  })

  Product.associate = (models) => {
    Product.addScope('defaultScope', {
      include: [
        {
          required: false,
          model: models.ProductImage,
          as: 'images',
          attributes: ['id', 'file_path'],
          where: {
            product_id: {
              [Op.ne]: null
            }
          }
        }
      ]
    }, { override: true });

    Product.hasMany(models.Review);
    Product.hasMany(models.ProductImage, {as: 'images', foreignKey: 'product_id'});
    Product.belongsToMany(models.Category, {
      through: models.ProductCategory,
      foreignKey: 'product_id',
      otherKey: 'category_id'
    });

    Product.hasMany(models.Option, {foreignKey: 'product_id', onDelete: 'cascade', onUpdate: 'cascade'});
    Product.hasMany(models.Stock, {foreignKey: 'product_id', onDelete: 'cascade', onUpdate: 'cascade'});
  }

  return Product;
}