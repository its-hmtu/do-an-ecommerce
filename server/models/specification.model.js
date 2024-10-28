module.exports = (sequelize, DataTypes) => {
  const Specification = sequelize.define('specifications', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    brand_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    storage_capacity: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    number_of_cameras: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    camera_resolution: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ram: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    rom: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    battery_capacity: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    processor: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    screen_size: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    operating_system: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    dimensions: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    cable_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    sim_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    manufacture_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    warranty_duration: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    condition: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    phone_model: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'specifications',
    indexes: [
      {
        fields: ['product_id']
      }
    ]
  })

  Specification.associate = (models) => {
    Specification.belongsTo(models.Product, {foreignKey: 'product_id', onDelete: 'cascade', onUpdate: 'cascade'});
    Specification.belongsTo(models.Brand, {foreignKey: 'brand_id', onDelete: 'cascade', onUpdate: 'cascade'});
  }

  return Specification;
}