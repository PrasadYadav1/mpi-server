'use strict';
module.exports = (sequelize, DataTypes) => {
  var subcategories = sequelize.define(
    'subcategories',
    {
      categoryId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
      isActive: DataTypes.BOOLEAN,
    });
  subcategories.associate = function (model) {
    subcategories.belongsTo(model.categories, {
      foreignKey: 'categoryId',
      targetKey: 'id'
    });
  };
  return subcategories;
};
