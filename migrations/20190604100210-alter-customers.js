'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('customers', 'creditLimit', Sequelize.DOUBLE);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn({
            tableName: 'customers'
        },
            'creditLimit'
        );
    }
};