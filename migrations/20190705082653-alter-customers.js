'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'customers',
      'customerNumber',
      Sequelize.STRING
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      {
        tableName: 'customers'
      },
      'customerNumber'
    );
  }
};
