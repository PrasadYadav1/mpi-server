'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productCode: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      companyId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'companies',
          key: 'id'
        }
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'categories',
          key: 'id'
        }
      },
      subCategoryId: {
        type: Sequelize.INTEGER
      },
      units: {
        type: Sequelize.DOUBLE
      },
      unitsofMeasurement: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      classificationName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isValid: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
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
    return queryInterface.dropTable('products');
  }
};
