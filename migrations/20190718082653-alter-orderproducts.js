'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'orderproducts',
      'minSalePrice',
      Sequelize.DOUBLE
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      {
        tableName: 'orderproducts'
      },
      'minSalePrice'
    );
  }
};
