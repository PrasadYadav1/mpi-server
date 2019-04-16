'use strict';
module.exports = (sequelize, DataTypes) => {
  var userlocation = sequelize.define(
    'userlocations',
    {
      userId: DataTypes.INTEGER,
      latitude: DataTypes.DOUBLE,
      longitude: DataTypes.DOUBLE,
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
      isActive: DataTypes.BOOLEAN
    },
    {
      classMethods: {
        associate: function (models) {
          // associations can be defined here
        }
      }
    }
  );
  return userlocation;
};
