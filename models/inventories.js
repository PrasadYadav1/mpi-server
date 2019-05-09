'use strict';
module.exports = (sequelize, DataTypes) => {
  var inventories = sequelize.define('inventories', {
    grn: DataTypes.STRING,
    isgrn: DataTypes.BOOLEAN,
    inventoryDate: DataTypes.DATEONLY,
    warehouseId: DataTypes.INTEGER,
    withPo: DataTypes.BOOLEAN,
    orderNumber: DataTypes.STRING,
    companyId: DataTypes.INTEGER,
    description: DataTypes.STRING,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  });
  inventories.associate = function (model) {
    inventories.hasMany(
      model.stockreceiveds,
      { as: 'stockReceiveds' },
      {
        foreignKey: 'inventoryId',
        targetKey: 'id',
      }
    );
  };
  return inventories;
};

