const slugify = require('slugify');
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('tags', {
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
    tableName: "tags",
    hooks: {
      beforeValidate: function (tag, options) {
        tag.slug = slugify(tag.name, { lower: true });
      }
    }
  })

  Tag.associate = function (models) {
    Tag.belongsToMany(models.Product, {through: models.ProductTag});
    Tag.hasMany(models.TagImage, {as: 'images'});
  }

  return Tag;
}