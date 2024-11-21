module.exports = (sequelize , DataTypes) => {
  const Review = sequelize.define('reviews', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: 'reviews'
  })

  Review.associate = (models) => {
    Review.belongsTo(models.Product, {onDelete: 'RESTRICT', onUpdate: 'RESTRICT',foreignKey: 'product_id'})
    Review.belongsTo(models.User)
  }

  return Review;
}