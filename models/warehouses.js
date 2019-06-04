'use strict';
module.exports = (sequelize, DataTypes) => {
  var warehouses = sequelize.define('warehouses', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    warehouseType: DataTypes.STRING,
    primaryWarehouseId: DataTypes.INTEGER,
    province: DataTypes.STRING,
    address: DataTypes.STRING,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    areaCode: DataTypes.STRING,
    buildingName: DataTypes.STRING,
    city: DataTypes.STRING,
    description: DataTypes.STRING,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  }, {
      classMethods: {
        associate: function (models) {
          // associations can be defined here
        }
      }
    });
  return warehouses;
};