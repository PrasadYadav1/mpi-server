'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return [
            queryInterface.addColumn('customers', 'creditLimit', {
                type: Sequelize.DOUBLE,
                allowNull: true
            })
        ]
    },
    down: (queryInterface, Sequelize) => {
        return [
            queryInterface.removeColumn('customers', 'creditLimit', {
                type: Sequelize.DOUBLE,
                allowNull: true
            })
        ];
    },
};