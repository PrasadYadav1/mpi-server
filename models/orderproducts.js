'use strict';
module.exports = (sequelize, DataTypes) => {
  var orderproducts = sequelize.define('orderproducts', {
    orderId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    batchNumber: DataTypes.STRING,
    availableQuantity: DataTypes.DOUBLE,
    orderQuantity: DataTypes.DOUBLE,
    discount: DataTypes.DOUBLE,
    rate: DataTypes.DOUBLE,
    mrp: DataTypes.DOUBLE,
    totalAmount: DataTypes.DOUBLE,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  });
  orderproducts.associate = function (model) {
    orderproducts.belongsTo(model.preorders, {
      foreignKey: 'orderId',
      targetKey: 'id'
    });
  };
  orderproducts.associate = function (model) {
    orderproducts.belongsTo(model.products, {
      foreignKey: 'productId',
      targetKey: 'id'
    });
  };
  return orderproducts;
};