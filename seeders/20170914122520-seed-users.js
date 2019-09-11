'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        employeeId: 'A-01',
        firstName: 'admin',
        lastName: '',
        email: 'admin@gmail.com',
        userName: 'admin',
        password:
          '$2a$10$PAEJN4ijFXT6tnm3QPo1lOADa4XU7Sre15srGS0XUjmgPFpLeTEOm',
        headUserId: null,
        userRole: 'admin',
        designation: 'Admin',
        avatar: '',
        mobileNumber: '9966126757',
        dateOfJoin: new Date(),
        address: 'JNTU',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      },
      {
        employeeId: 'V-02',
        firstName: 'venkat',
        lastName: '',
        email: 'venkat@gmail.com',
        userName: 'venkat',
        password:
          '$2a$10$PAEJN4ijFXT6tnm3QPo1lOADa4XU7Sre15srGS0XUjmgPFpLeTEOm',
        headUserId: 1,
        userRole: 'bm',
        designation: 'Branch Manager',
        avatar: '',
        mobileNumber: '9966126757',
        dateOfJoin: new Date(),
        address: 'JNTU',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      },
      {
        employeeId: 'C-03',
        firstName: 'Chandu',
        lastName: '',
        email: 'chandu@gmail.com',
        userName: 'chandu',
        password:
          '$2a$10$PAEJN4ijFXT6tnm3QPo1lOADa4XU7Sre15srGS0XUjmgPFpLeTEOm',
        headUserId: 2,
        userRole: 'pharmacist',
        designation: 'Pharmacist',
        avatar: '',
        mobileNumber: '9966126757',
        dateOfJoin: new Date(),
        address: 'JNTU',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      },
      {
        employeeId: 'P-04',
        firstName: 'praveen',
        lastName: 'kambli',
        email: 'praveen@gmail.com',
        userName: 'praveen',
        password:
          '$2a$10$PAEJN4ijFXT6tnm3QPo1lOADa4XU7Sre15srGS0XUjmgPFpLeTEOm',
        headUserId: 3,
        userRole: 'bfo',
        designation: 'Branch financial officer',
        avatar: '',
        mobileNumber: '9966126757',
        dateOfJoin: new Date(),
        address: 'JNTU',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      },
      {
        employeeId: 'K-05',
        firstName: 'krish',
        lastName: 'inturi',
        email: 'krish@gmail.com',
        userName: 'krish',
        password:
          '$2a$10$PAEJN4ijFXT6tnm3QPo1lOADa4XU7Sre15srGS0XUjmgPFpLeTEOm',
        headUserId: 4,
        userRole: 'ss',
        designation: 'Sales Supervisor',
        avatar: '',
        mobileNumber: '9966126757',
        dateOfJoin: new Date(),
        address: 'JNTU',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      },

      {
        employeeId: 'K-06',
        firstName: 'vamsi',
        lastName: 'sama',
        email: 'vamsi@gmail.com',
        userName: 'vamsi',
        password:
          '$2a$10$PAEJN4ijFXT6tnm3QPo1lOADa4XU7Sre15srGS0XUjmgPFpLeTEOm',
        headUserId: 5,
        userRole: 'SalesAgent',
        designation: 'SalesAgent',
        avatar: '',
        mobileNumber: '9966126757',
        dateOfJoin: new Date(),
        address: 'JNTU',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
