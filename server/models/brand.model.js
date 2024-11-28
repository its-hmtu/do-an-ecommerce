module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define('brands', {
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'brands'
  });

  Brand.associate = (models) => {
    Brand.hasMany(models.Product, {foreignKey: 'brand_id', onDelete: 'cascade', onUpdate: 'cascade'});
    Brand.hasMany(models.Series, {foreignKey: 'brand_id', onDelete: 'cascade', onUpdate: 'cascade'});
  }

  return Brand;
}