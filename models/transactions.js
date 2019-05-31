'use strict';
module.exports = (sequelize, DataTypes) => {
  var transactions = sequelize.define('transactions', {
    transactionNumber: DataTypes.STRING,
    transactionDate: DataTypes.DATEONLY,
    customerId: DataTypes.INTEGER,
    address: DataTypes.STRING,
    dateOfDelivery: DataTypes.DATEONLY,
    description: DataTypes.STRING,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  });
  transactions.associate = function (model) {
    transactions.hasMany(
      model.preorders,
      { as: 'preOrders' },
      {
        foreignKey: 'transactionId',
        targetKey: 'id',
      }
    );
  };
  return transactions;
};