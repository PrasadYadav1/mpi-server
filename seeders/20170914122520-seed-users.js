'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('users', [
			{
				employeeId: "A-01",
				firstName: 'admin',
				lastName: '',
				email: 'admin@gmail.com',
				userName: 'admin',
				password: '$2a$10$PAEJN4ijFXT6tnm3QPo1lOADa4XU7Sre15srGS0XUjmgPFpLeTEOm',
				headUserId: null,
				userRole: 'Admin',
				designation: 'Admin',
				avatar: '',
				mobileNumber: '9966126757',
				dateOfJoin: new Date(),
				address: "JNTU",
				createdAt: new Date(),
				updatedAt: new Date(),
				isActive: true,
			},
			{
				employeeId: "P-02",
				firstName: 'praveen',
				lastName: 'kambli',
				email: 'praveen@gmail.com',
				userName: 'praveen',
				password: '$2a$10$PAEJN4ijFXT6tnm3QPo1lOADa4XU7Sre15srGS0XUjmgPFpLeTEOm',
				headUserId: 1,
				userRole: 'ZonalManager',
				designation: 'Manager',
				avatar: '',
				mobileNumber: '9966126757',
				dateOfJoin: new Date(),
				address: "JNTU",
				createdAt: new Date(),
				updatedAt: new Date(),
				isActive: true,
			},
			{
				employeeId: "K-03",
				firstName: 'krish',
				lastName: 'inturi',
				email: 'krish@gmail.com',
				userName: 'krish',
				password: '$2a$10$PAEJN4ijFXT6tnm3QPo1lOADa4XU7Sre15srGS0XUjmgPFpLeTEOm',
				headUserId: 2,
				userRole: 'RegionalManager',
				designation: 'RegionalManager',
				avatar: '',
				mobileNumber: '9966126757',
				dateOfJoin: new Date(),
				address: "JNTU",
				createdAt: new Date(),
				updatedAt: new Date(),
				isActive: true,
			},

			{
				employeeId: "K-04",
				firstName: 'vamsi',
				lastName: 'sama',
				email: 'vamsi@gmail.com',
				userName: 'vamsi',
				password: '$2a$10$PAEJN4ijFXT6tnm3QPo1lOADa4XU7Sre15srGS0XUjmgPFpLeTEOm',
				headUserId: 2,
				userRole: 'SalesAgent',
				designation: 'SalesAgent',
				avatar: '',
				mobileNumber: '9966126757',
				dateOfJoin: new Date(),
				address: "JNTU",
				createdAt: new Date(),
				updatedAt: new Date(),
				isActive: true,
			},
		]);
	},

	down: (queryInterface, Sequelize) => {
		/*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
	},
};
