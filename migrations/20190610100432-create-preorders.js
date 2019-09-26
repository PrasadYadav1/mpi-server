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
      preorderConfirmed: {
        type: Sequelize.BOOLEAN
      },
      preOrderNumber: {
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
      isApproved: {
        type: Sequelize.BOOLEAN
      },
      isApprovedBy: {
        type: Sequelize.INTEGER
      },
      totalAmount: {
        type: Sequelize.DOUBLE
      },
      digitalSignature: {
        type: Sequelize.BLOB('long')
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
