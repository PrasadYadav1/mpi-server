'use strict';
module.exports = (sequelize, DataTypes) => {
  var productprices = sequelize.define('productprices', {
    productId: DataTypes.INTEGER,
    fromRange: DataTypes.INTEGER,
    toRange: DataTypes.INTEGER,
    price: DataTypes.DOUBLE,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  });
  productprices.associate = function(model) {
    productprices.belongsTo(model.products, {
      foreignKey: 'productId',
      targetKey: 'id'
    });
  };
  return productprices;
};