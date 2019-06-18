'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('stockreceiveds', 'minSalePrice', Sequelize.DOUBLE);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn({
            tableName: 'stockreceiveds'
        },
            'minSalePrice'
        );
    }
};