'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return [
            queryInterface.changeColumn('products', 'classificationName', {
                type: Sequelize.STRING,
                allowNull: true
            })
        ]
    },
    down: (queryInterface, Sequelize) => {
        return [
            queryInterface.changeColumn('products', 'classificationName', {
                type: Sequelize.STRING,
                allowNull: true
            })
        ];
    },
};