'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('useractivities', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			userId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'users',
					key: 'id',
				}
			},
			activityType: {
				type: Sequelize.STRING,
			},
			description: {
				type: Sequelize.TEXT,
			},
			createdBy: {
				type: Sequelize.INTEGER,
			},
			updatedBy: {
				type: Sequelize.INTEGER,
			},
			isActive: {
				type: Sequelize.BOOLEAN,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('useractivities');
	},
};
