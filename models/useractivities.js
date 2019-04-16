'use strict';
module.exports = (sequelize, DataTypes) => {
	var useractivities = sequelize.define('useractivities', {
		userId: DataTypes.INTEGER,
		activityType: DataTypes.STRING,
		description: DataTypes.TEXT,
		createdBy: DataTypes.INTEGER,
		updatedBy: DataTypes.INTEGER,
		isActive: DataTypes.BOOLEAN,
	}, {
			freezeTableName: true,
			tableName: 'useractivities'
		});
	useractivities.associate = function (models) {
		useractivities.belongsTo(models.users, {
			foreignKey: 'userId',
			targetKey: 'id',
		});
	};
	return useractivities;
};
