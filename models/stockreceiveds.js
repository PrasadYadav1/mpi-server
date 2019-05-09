'use strict';
module.exports = (sequelize, DataTypes) => {
  var stockreceiveds = sequelize.define('stockreceiveds', {
    inventoryId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    batchNumber: DataTypes.STRING,
    unitofMeasurement: DataTypes.STRING,
    dateOfManufacture: DataTypes.DATEONLY,
    expiryDate: DataTypes.DATEONLY,
    receivedQuantity: DataTypes.DOUBLE,
    price: DataTypes.DOUBLE,
    mrp: DataTypes.DOUBLE,
    amount: DataTypes.DOUBLE,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  });
  stockreceiveds.associate = function (model) {
    stockreceiveds.belongsTo(model.inventories, {
      foreignKey: 'inventoryId',
      targetKey: 'id'
    });
  };
  stockreceiveds.associate = function (model) {
    stockreceiveds.belongsTo(model.products, {
      foreignKey: 'productId',
      targetKey: 'id'
    });
  };
  return stockreceiveds;
};