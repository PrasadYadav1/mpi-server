'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('preorders', 'amount', Sequelize.DOUBLE);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn({
            tableName: 'preorders'
        },
            'amount'
        );
    }
};