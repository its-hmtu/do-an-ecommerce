const slugify = require('slugify');

module.exports = (sequelize, DataTypes) => {
  const Series = sequelize.define('series', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    series_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    timestamps: true,
    table: 'series'
  });

  Series.associate = (models) => {
    Series.hasMany(models.Product, {
      foreignKey: 'series_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      as: 'product_series'
    });
  };

  Series.beforeValidate((series, options) => {
    series.slug = slugify(series.series_name, {
      lower: true,
      strict: true
    });
  });

  return Series;
}