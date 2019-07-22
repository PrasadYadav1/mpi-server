'use strict';
module.exports = (sequelize, DataTypes) => {
  var preorders = sequelize.define('preorders', {
    preorderConfirmed: DataTypes.BOOLEAN,
    preOrderNumber: DataTypes.STRING,
    customerId: DataTypes.DOUBLE,
    dateOfDelivery: DataTypes.DATEONLY,
    discount: DataTypes.DOUBLE,
    amount: DataTypes.DOUBLE,
    totalAmount: DataTypes.DOUBLE,
    digitalSignature:DataTypes.BLOB('long'),
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  });
  preorders.associate = function (model) {
    preorders.hasMany(
      model.preorderproducts,
      { as: 'preorderProducts' },
      {
        foreignKey: 'preorderId',
        targetKey: 'id',
      }
    );
  };
  return preorders;
};