'use strict';
module.exports = (sequelize, DataTypes) => {
  var targetrevenue = sequelize.define('targetrevenue', {
    assigneeId: DataTypes.INTEGER,
    amount: DataTypes.DOUBLE,
    year: DataTypes.INTEGER,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  }, {
      freezeTableName: true,
      tableName: 'targetrevenue'
    });
  targetrevenue.associate = function (model) {
    targetrevenue.belongsTo(model.users, {
      foreignKey: 'assigneeId',
      targetKey: 'id'
    });
  };
  return targetrevenue;
};