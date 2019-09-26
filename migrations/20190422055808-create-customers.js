'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      customerNumber: {
        type: Sequelize.STRING
      },
      warehouseId: {
        allowNull: true,
        type: Sequelize.ARRAY(Sequelize.INTEGER)
      },
      customerType: {
        type: Sequelize.STRING
      },
      buildingName: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      province: {
        type: Sequelize.STRING
      },
      areaCode: {
        type: Sequelize.STRING
      },
      phoneNumber: {
        type: Sequelize.STRING
      },
      primaryContactPerson: {
        type: Sequelize.STRING
      },
      primaryContactNumber: {
        type: Sequelize.STRING
      },
      primaryEmail: {
        type: Sequelize.STRING
      },
      secondaryContactPerson: {
        type: Sequelize.STRING
      },
      secondaryContactNumber: {
        type: Sequelize.STRING
      },
      secondaryEmail: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      latitude: {
        type: Sequelize.DOUBLE
      },
      longitude: {
        type: Sequelize.DOUBLE
      },
      creditLimit: {
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
    return queryInterface.dropTable('customers');
  }
};
