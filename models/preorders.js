'use strict';
module.exports = (sequelize, DataTypes) => {
  var preorders = sequelize.define('preorders', {
    preOrderNumber: DataTypes.STRING,
    customerId: DataTypes.DOUBLE,
    dateOfDelivery: DataTypes.DATEONLY,
    discount: DataTypes.DOUBLE,
    totalAmount: DataTypes.DOUBLE,
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