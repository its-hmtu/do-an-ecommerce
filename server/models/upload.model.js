module.exports = (sequelize, DataTypes) => {
  const Upload = sequelize.define('uploads', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }, 
    file_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    file_size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    original_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mime_type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: 'uploads'
  })

  Upload.associate = (models) => {
    Upload.belongsTo(models.Product, {foreignKey: 'product_id', onDelete: 'cascade'})
    Upload.belongsTo(models.Category, {foreignKey: 'category_id', onDelete: 'cascade'})
    Upload.belongsTo(models.User, {foreignKey: 'user_id',onDelete: 'cascade'})
  }

  return Upload;
}