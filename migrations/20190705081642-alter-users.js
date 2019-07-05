'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'branchId', Sequelize.INTEGER);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      {
        tableName: 'users'
      },
      'branchId'
    );
  }
};
