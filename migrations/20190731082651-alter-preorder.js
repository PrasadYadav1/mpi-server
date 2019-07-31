'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('preorders', 'isApproved', Sequelize.BOOLEAN),
      queryInterface.addColumn('preorders', 'isApprovedBy', Sequelize.INTEGER)
    ];
  },
  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn(
        {
          tableName: 'preorders'
        },
        'isApproved'
      ),
      queryInterface.removeColumn(
        {
          tableName: 'preorders'
        },
        'isApprovedBy'
      )
    ];
  }
};
