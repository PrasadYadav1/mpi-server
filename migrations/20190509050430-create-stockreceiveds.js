'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('stockreceiveds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      inventoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'inventories',
          key: 'id'
        }
      },
      productId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'products',
          key: 'id'
        }
      },
      batchNumber: {
        type: Sequelize.STRING
      },
      unitofMeasurement: {
        type: Sequelize.STRING
      },
      dateOfManufacture: {
        type: Sequelize.DATEONLY
      },
      expiryDate: {
        type: Sequelize.DATEONLY
      },
      receivedQuantity: {
        type: Sequelize.DOUBLE
      },
      price: {
        type: Sequelize.DOUBLE
      },
      minSalePrice: {
        type: Sequelize.DOUBLE
      },
      mrp: {
        type: Sequelize.DOUBLE
      },
      amount: {
        type: Sequelize.DOUBLE
      },
      createdBy: {
        type: Sequelize.INTEGER
      },
      updatedBy: {
        type: Sequelize.INTEGER
      },
      isActive: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('stockreceiveds');
  }
};
