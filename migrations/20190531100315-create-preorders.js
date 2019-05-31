'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('preorders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transactionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'transactions',
          key: 'id'
        }
      },
      preOrderNumber: {
        type: Sequelize.STRING
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
      availableQuantity: {
        type: Sequelize.DOUBLE
      },
      orderedQuantity: {
        type: Sequelize.DOUBLE
      },
      discount: {
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
    return queryInterface.dropTable('preorders');
  }
};