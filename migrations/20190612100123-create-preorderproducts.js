'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('preorderproducts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      preorderId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'preorders',
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
      orderQuantity: {
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
    return queryInterface.dropTable('preorderproducts');
  }
};