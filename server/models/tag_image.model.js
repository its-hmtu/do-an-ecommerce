const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const TagImage = sequelize.define('tag_images', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    tag_id: {
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
    timestamps: false,
    tableName: "uploads",
    defaultScope: {
      where: {
        tag_id: {
          [Op.ne]: null
        }
      }
    }
  });

  TagImage.associate = (models) => {
    TagImage.belongsTo(models.Tag, {onDelete: 'cascade'})
  }

  return TagImage;
}