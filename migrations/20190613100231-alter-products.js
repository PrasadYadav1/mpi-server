'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('products', 'productCode', Sequelize.STRING);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn({
            tableName: 'products'
        },
            'productCode'
        );
    }
};