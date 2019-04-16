'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('targetrevenue', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			year: {
				allowNull: false,
				type: Sequelize.INTEGER,
			},
			amount: {
				allowNull: false,
				type: Sequelize.DOUBLE,
			},
			assigneeId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: 'users',
					key: 'id'
				}
			},
			createdBy: {
				allowNull: false,
				type: Sequelize.INTEGER,
			},
			updatedBy: {
				allowNull: false,
				type: Sequelize.INTEGER,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			isActive: {
				type: Sequelize.BOOLEAN,
			},
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('targetrevenue');
	},
};
