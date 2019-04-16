'use strict';
module.exports = (sequelize, DataTypes) => {
  var logs = sequelize.define('logs', {
    status: DataTypes.INTEGER,
    request: DataTypes.STRING,
    response: DataTypes.STRING,
    context: DataTypes.STRING,
    message: DataTypes.STRING
  }, {
      classMethods: {
        associate: function (models) {
          // associations can be defined here
        }
      }
    });
  return logs;
};