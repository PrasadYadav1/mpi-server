'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'preorderproducts',
      'minSalePrice',
      Sequelize.DOUBLE
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      {
        tableName: 'preorderproducts'
      },
      'minSalePrice'
    );
  }
};
