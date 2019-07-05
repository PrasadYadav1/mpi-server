'use strict';
module.exports = (sequelize, DataTypes) => {
  var users = sequelize.define('users', {
    employeeId: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    userName: DataTypes.STRING,
    password: DataTypes.STRING,
    headUserId: DataTypes.INTEGER,
    userRole: DataTypes.STRING,
    designation: DataTypes.STRING,
    avatar: DataTypes.STRING,
    mobileNumber: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    dateOfJoin: DataTypes.DATEONLY,
    address: DataTypes.TEXT,
    warehouseId: DataTypes.INTEGER,
    branchId: DataTypes.INTEGER,
    customerIds: DataTypes.ARRAY(DataTypes.INTEGER)
  });

  return users;
};
