const { Op } = require("sequelize");
const slugify = require("slugify");

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "products",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      product_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      brand_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      product_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      base_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      special_base_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      special_base_price_percentage: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      total_in_stock: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      main_image_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      product_colors: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      product_sizes: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      availability: {
        type: DataTypes.ENUM("in-stock", "out-of-stock"),
        allowNull: false,
        defaultValue: "in-stock",
      },
      views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      featured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      sales: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      series_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: "products",
      indexes: [
        {
          fields: ["slug"],
        },
      ],
      hooks: {
        beforeValidate: (product, options) => {
          const cleanedName = product.product_name.replace(/[^\w\s]/gi, "");
          product.slug = slugify(cleanedName, { lower: true });
        },
      },
    }
  );

  Product.associate = (models) => {
    // Product.addScope('defaultScope', {
    //   include: [
    //     {
    //       required: false,
    //       model: models.ProductImage,
    //       as: 'images',
    //       attributes: ['id', 'file_path'],
    //       where: {
    //         product_id: {
    //           [Op.ne]: null
    //         }
    //       }
    //     }
    //   ]
    // }, { override: true });

    Product.hasMany(models.Review, {
      foreignKey: "product_id",
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Product.hasMany(models.ProductImage, {
      as: "images",
      foreignKey: "product_id",
    });
    Product.belongsToMany(models.Category, {
      through: models.ProductCategory,
      foreignKey: "product_id",
      otherKey: "category_id",
    });

    Product.hasMany(models.Option, {
      foreignKey: "product_id",
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Product.hasMany(models.Stock, {
      foreignKey: "product_id",
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Product.hasOne(models.Specification, {
      as: "specification",
      foreignKey: "product_id",
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Product.belongsTo(models.Brand, {
      foreignKey: "brand_id",
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Product.hasMany(models.Discount, {
      foreignKey: "product_id",
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    Product.belongsTo(models.Series, {
      foreignKey: "series_id",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
      as: "product_series",
    });
    Product.hasMany(models.CartItem, {
      foreignKey: "product_id",
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  };

  return Product;
};
