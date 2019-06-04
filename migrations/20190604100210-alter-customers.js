'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return [
            queryInterface.changeColumn('customers', 'creditLimit', {
                type: Sequelize.DOUBLE,
                allowNull: true
            })
        ]
    },
    down: (queryInterface, Sequelize) => {
        return [
            queryInterface.changeColumn('customers', 'creditLimit', {
                type: Sequelize.DOUBLE,
                allowNull: true
            })
        ];
    },
};