'use strict';
module.exports = (sequelize, DataTypes) => {
  var orders = sequelize.define('orders', {
    orderConfirmed: DataTypes.BOOLEAN,
    orderNumber: DataTypes.STRING,
    customerId: DataTypes.INTEGER,
    warehouseId: DataTypes.INTEGER,
    dateOfDelivery: DataTypes.DATEONLY,
    discount: DataTypes.DOUBLE,
    amount: DataTypes.DOUBLE,
    totalAmount: DataTypes.DOUBLE,
    isApproved: DataTypes.BOOLEAN,
    isApprovedBy: DataTypes.INTEGER,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  });
  orders.associate = function(model) {
    orders.hasMany(
      model.orderproducts,
      { as: 'orderProducts' },
      {
        foreignKey: 'orderId',
        targetKey: 'id'
      }
    );
  };
  return orders;
};
