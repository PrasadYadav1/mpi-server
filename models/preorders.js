'use strict';
module.exports = (sequelize, DataTypes) => {
  var preorders = sequelize.define('preorders', {
    transactionId: DataTypes.INTEGER,
    preOrderNumber: DataTypes.STRING,
    productId: DataTypes.INTEGER,
    batchNumber: DataTypes.STRING,
    availableQuantity: DataTypes.DOUBLE,
    orderedQuantity: DataTypes.DOUBLE,
    discount: DataTypes.DOUBLE,
    mrp: DataTypes.DOUBLE,
    amount: DataTypes.DOUBLE,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  });
  preorders.associate = function (model) {
    preorders.belongsTo(model.transactions, {
      foreignKey: 'transactionId',
      targetKey: 'id'
    });
  };
  preorders.associate = function (model) {
    preorders.belongsTo(model.products, {
      foreignKey: 'productId',
      targetKey: 'id'
    });
  };
  return preorders;
};