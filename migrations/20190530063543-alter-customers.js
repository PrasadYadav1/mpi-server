'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return [
            queryInterface.changeColumn('customers', 'warehouseId', {
                type: Sequelize.INTEGER,
                allowNull: true
            })
        ]
    },
    down: (queryInterface, Sequelize) => {
        return [
            queryInterface.changeColumn('customers', 'warehouseId', {
                type: Sequelize.INTEGER,
                allowNull: true
            })
        ];
    },
};