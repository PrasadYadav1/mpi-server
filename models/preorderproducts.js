'use strict';
module.exports = (sequelize, DataTypes) => {
  var preorderproducts = sequelize.define('preorderproducts', {
    preorderId: DataTypes.INTEGER,
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
  preorderproducts.associate = function (model) {
    preorderproducts.belongsTo(model.preorders, {
      foreignKey: 'preorderId',
      targetKey: 'id'
    });
  };
  preorderproducts.associate = function (model) {
    preorderproducts.belongsTo(model.products, {
      foreignKey: 'productId',
      targetKey: 'id'
    });
  };
  return preorderproducts;
};