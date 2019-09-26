'use strict';
module.exports = (sequelize, DataTypes) => {
  var uservisitlocation = sequelize.define(
    'uservisitlocations',
    {
      userId: DataTypes.INTEGER,
      warehouseId: DataTypes.INTEGER,
      visit: DataTypes.BOOLEAN,
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
  return uservisitlocation;
};
