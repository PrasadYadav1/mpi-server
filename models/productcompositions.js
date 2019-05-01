'use strict';
module.exports = (sequelize, DataTypes) => {
  var productcompositions = sequelize.define('productcompositions', {
    productId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    dosageValue: DataTypes.DOUBLE,
    dosageType: DataTypes.STRING,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  });
  productcompositions.associate = function(model) {
    productcompositions.belongsTo(model.products, {
      foreignKey: 'productId',
      targetKey: 'id'
    });
  };
  return productcompositions;
};