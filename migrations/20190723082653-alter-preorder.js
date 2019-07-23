'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'preorders',
      'digitalSignature',
      Sequelize.BLOB('long')
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      {
        tableName: 'preorders'
      },
      'digitalSignature'
    );
  }
};
