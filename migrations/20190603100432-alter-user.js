'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return [
            queryInterface.changeColumn('users', 'warehouseId', {
                type: Sequelize.INTEGER,
                allowNull: true
            }),
            queryInterface.changeColumn('users', 'customerIds', {
                type: Sequelize.ARRAY(Sequelize.INTEGER),
                allowNull: true
            })
        ]
    },
    down: (queryInterface, Sequelize) => {
        return [
            queryInterface.changeColumn('users', 'warehouseId', {
                type: Sequelize.INTEGER,
                allowNull: true
            }),
            queryInterface.changeColumn('users', 'customerIds', {
                type: Sequelize.ARRAY(Sequelize.INTEGER),
                allowNull: true
            })
        ];
    },
};