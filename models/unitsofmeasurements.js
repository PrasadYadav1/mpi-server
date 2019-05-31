'use strict';
module.exports = (sequelize, DataTypes) => {
  var unitsofmeasurements = sequelize.define('unitsofmeasurements', {
    name: DataTypes.STRING,
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
  return unitsofmeasurements;
};