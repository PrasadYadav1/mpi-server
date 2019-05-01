'use strict';
module.exports = (sequelize, DataTypes) => {
  var categories = sequelize.define(
    'categories',
    {
      industry: DataTypes.STRING,
      name: DataTypes.STRING,
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
      isActive: DataTypes.BOOLEAN,
    });
  categories.associate = function (model) {
    categories.hasMany(model.subcategories, {
      foreignKey: 'categoryId',
      targetKey: 'id'
    });
  };
  return categories;
};
