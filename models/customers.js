'use strict';
module.exports = (sequelize, DataTypes) => {
  var customers = sequelize.define(
    'customers',
    {
      customerNumber: DataTypes.STRING,
      name: DataTypes.STRING,
      warehouseId: DataTypes.ARRAY(DataTypes.INTEGER),
      customerType: DataTypes.STRING,
      buildingName: DataTypes.STRING,
      city: DataTypes.STRING,
      province: DataTypes.STRING,
      areaCode: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      primaryContactPerson: DataTypes.STRING,
      primaryContactNumber: DataTypes.STRING,
      primaryEmail: DataTypes.STRING,
      secondaryContactPerson: DataTypes.STRING,
      secondaryContactNumber: DataTypes.STRING,
      secondaryEmail: DataTypes.STRING,
      address: DataTypes.STRING,
      creditLimit: DataTypes.DOUBLE,
      description: DataTypes.STRING,
      latitude: DataTypes.DOUBLE,
      longitude: DataTypes.DOUBLE,
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
      isActive: DataTypes.BOOLEAN
    },
    {
      classMethods: {
        associate: function(models) {
          // associations can be defined here
        }
      }
    }
  );
  return customers;
};
