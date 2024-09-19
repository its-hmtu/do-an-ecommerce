module.exports = (sequelize, DataTypes) => {
  const Upload = sequelize.define('uploads', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    },
    create_at: {
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
    tableName: 'uploads'
  })

  Upload.associate = (models) => {
    Upload.belongsTo(models.Tag, {onDelete: 'cascade'})
    Upload.belongsTo(models.Product, {foreignKey: 'product_id', onDelete: 'cascade'})
    Upload.belongsTo(models.Category, {onDelete: 'cascade'})
    Upload.belongsTo(models.User, {foreignKey: 'user_id',onDelete: 'cascade'})
  }

  return Upload;
}