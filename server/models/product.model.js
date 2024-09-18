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
    price: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false
    },
    product_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    stock: {
      type: DataTypes.INTEGER(11),
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
          attributes: ['id', 'file_path']
        }
      ]
    }, { override: true });

    Product.hasMany(models.Review);
    Product.hasMany(models.ProductImage, {as: 'images'});
    Product.belongsToMany(models.Category, {
      through: models.ProductCategory,
      foreignKey: 'product_id',
      otherKey: 'category_id'
    });

    Product.belongsToMany(models.Tag, {
      through: models.ProductTag,
      foreignKey: 'product_id',
      otherKey: 'tag_id'
    });
  }

  return Product;
}