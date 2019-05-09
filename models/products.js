'use strict';
module.exports = (sequelize, DataTypes) => {
	var products = sequelize.define('products', {
		name: DataTypes.STRING,
		companyId: DataTypes.INTEGER,
		categoryId: DataTypes.INTEGER,
		subCategoryId: DataTypes.INTEGER,
		units: DataTypes.DOUBLE,
		unitsofMeasurement: DataTypes.STRING,
		description: DataTypes.STRING,
		createdBy: DataTypes.INTEGER,
		updatedBy: DataTypes.INTEGER,
		isActive: DataTypes.BOOLEAN,
	});
	products.associate = function (model) {
		products.hasMany(
			model.productprices,
			{ as: 'productPrices' },
			{
				foreignKey: 'productId',
				targetKey: 'id',
			}
		);
	};
	products.associate = function (model) {
		products.hasMany(model.stockreceiveds, {
			foreignKey: 'productId',
			targetKey: 'id'
		});
	};
	return products;
};
