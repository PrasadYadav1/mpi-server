'use strict';
module.exports = (sequelize, DataTypes) => {
  var offerdiscounts = sequelize.define('offerdiscounts', {
    offerId: DataTypes.INTEGER,
    stockReceivedId: DataTypes.INTEGER,
    discount: DataTypes.STRING,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  });
  offerdiscounts.associate = function (model) {
    offerdiscounts.belongsTo(model.offers, {
      foreignKey: 'offerId',
      targetKey: 'id'
    });
  };
  return offerdiscounts;
};