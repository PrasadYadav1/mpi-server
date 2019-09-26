'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderConfirmed: {
        type: Sequelize.BOOLEAN
      },
      orderNumber: {
        type: Sequelize.STRING
      },
      customerId: {
        type: Sequelize.INTEGER
      },
      warehouseId: {
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
      isApprovedBy: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('orders');
  }
};
