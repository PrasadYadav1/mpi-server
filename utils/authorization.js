const verifyRoles = (rolesArray, userRole)  => rolesArray.some(r => r === userRole)
module.exports = { verifyRoles };
