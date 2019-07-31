'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('orders', 'isApproved', Sequelize.BOOLEAN),
      queryInterface.addColumn('orders', 'isApprovedBy', Sequelize.INTEGER)
    ];
  },
  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn(
        {
          tableName: 'orders'
        },
        'isApproved'
      ),
      queryInterface.removeColumn(
        {
          tableName: 'orders'
        },
        'isApprovedBy'
      )
    ];
  }
};
