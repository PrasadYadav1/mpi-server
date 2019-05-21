'use strict';
module.exports = (sequelize, DataTypes) => {
  var offers = sequelize.define('offers', {
    offerDate: DataTypes.DATEONLY,
    productId: DataTypes.INTEGER,
    offerType: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  });
  offers.associate = function (model) {
    offers.belongsTo(model.products, {
      foreignKey: 'productId',
      targetKey: 'id'
    });
  };
  return offers;
};