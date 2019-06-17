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
      preOrderNumber: {
        type: Sequelize.STRING
      },
      customerId: {
        type: Sequelize.INTEGER
      },
      dateOfDelivery: {
        type: Sequelize.STRING
      },
      discount: {
        type: Sequelize.DOUBLE
      },
      amount: {
        type: Sequelize.DOUBLE
      },
      totalAmount: {
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