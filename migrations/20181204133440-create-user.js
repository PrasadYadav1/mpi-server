"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employeeId: { allowNull: false, type: Sequelize.STRING },
      firstName: { allowNull: false, type: Sequelize.STRING },
      lastName: { allowNull: false, type: Sequelize.STRING },
      email: { type: Sequelize.STRING },
      userName: { allowNull: false, type: Sequelize.STRING },
      password: { type: Sequelize.STRING },
      headUserId: { type: Sequelize.INTEGER },
      userRole: { type: Sequelize.STRING },
      designation: { allowNull: false, type: Sequelize.STRING },
      avatar: { allowNull: false, type: Sequelize.STRING },
      mobileNumber: { allowNull: false, type: Sequelize.STRING },
      dateOfJoin: { type: Sequelize.DATE, allowNull: true },
      address: { allowNull: true, type: Sequelize.TEXT },
      warehouseId: { allowNull: true, type: Sequelize.INTEGER },
      branchId: { allowNull: true, type: Sequelize.INTEGER },
      outletIds: { allowNull: true, type: Sequelize.ARRAY(Sequelize.INTEGER) },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      isActive: { type: Sequelize.BOOLEAN }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("users");
  }
};
