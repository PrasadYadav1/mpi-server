const t = require('tcomb');
const types = require('../utils/types');

const userSearch = t.struct({
  searchBy: t.maybe(t.enums.of(['firstName', 'lastName'])),
  searchByValue: t.maybe(t.String)
});

const userPost = t.struct({
  firstName: t.String,
  lastName: t.String,
  email: t.String,
  password: t.String,
  userRole: t.enums.of(['ZonalManager', 'RegionalManager', 'SalesAgent']),
  userName: t.String,
  password: t.String,
  mobileNumber: t.String,
  address: t.String,
  dateOfJoin: types.FormatedDate('YYYY-MM-DD'),
  employeeId: t.String
});

const userPathParm = t.struct({
  userId: types.StringPositiveInteger
});

const userType = t.struct({
  type: t.enums.of(['All', 'ZonalManager', 'RegionalManager', 'SalesAgent'])
});

const userTypeQuery = t.struct({
  searchText: t.maybe(t.String),
  userStatus: t.maybe(t.enums.of(['All', 'Active', 'Deactive']))
});

const managerAssign = t.struct({
  managerId: t.Integer
});

const usersListQueryParams = t.struct({
  pageSize: types.StringNumber,
  pageIndex: types.StringNumber,
  propertyName: t.maybe(t.enums.of(['name', 'employeeId', 'supervisor', 'role'])),
  propertyValue: t.maybe(t.String)
});

const userStatusChangeQueryParams = t.struct({
  status: t.enums.of(['Activate', 'Deactivate']),
});
const userUpdateBody = t.struct({
  firstName: t.String,
  lastName: t.String,
  email: t.String,
  userName: t.String,
  employeeId: t.String,
  mobileNumber: t.String,
  dateOfJoin: types.FormatedDate('YYYY-MM-DD')
});

const newManagerAssign = t.struct({
  managerId: types.StringPositiveInteger,
  newManagerId: types.StringPositiveInteger
});

module.exports = {
  userSearch,
  userPathParm,
  userPost,
  userType,
  managerAssign,
  usersListQueryParams,
  userStatusChangeQueryParams,
  userUpdateBody,
  newManagerAssign,
  userTypeQuery
};
