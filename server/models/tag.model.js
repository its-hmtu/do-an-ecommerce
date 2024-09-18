const slugify = require('slugify');
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('tags', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    
  })

}