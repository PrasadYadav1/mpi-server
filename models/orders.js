'use strict';
module.exports = (sequelize, DataTypes) => {
  var orders = sequelize.define('orders', {
    orderConfirmed: DataTypes.BOOLEAN,
    orderNumber: DataTypes.STRING,
    customerId: DataTypes.DOUBLE,
    dateOfDelivery: DataTypes.DATEONLY,
    discount: DataTypes.DOUBLE,
    amount: DataTypes.DOUBLE,
    totalAmount: DataTypes.DOUBLE,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  });
  orders.associate = function (model) {
    orders.hasMany(
      model.orderproducts,
      { as: 'orderProducts' },
      {
        foreignKey: 'preorderId',
        targetKey: 'id',
      }
    );
  };
  return orders;
};