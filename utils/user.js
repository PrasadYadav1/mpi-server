const users = require("../models").users

const sequelize = require("sequelize");

const { update } = require("tcomb");

const getRelatedUsers = async (usr, attributesArray) => {
    if (usr.userRole === 'Admin') {
        return await User.findAll({
            attributes: attributesArray,
            where: {
                $and: [
                    { isActive: true },
                    {
                        $or: [
                            { userRole: { $eq: 'Manager' } },
                            { userRole: { $eq: 'SalesAgent' } }
                        ]
                    },
                ]
            },
            raw: true
        });
    } else if (usr.userRole === "Manager") {
        const salesAgents = await users.findAll({
            attributes: attributesArray,
            where: {
                isActive: true,
                headUserId: usr.userId
            },
            raw: true
        });
        return salesAgents;
    } else {
        return [];
    }
};

const getRelatedUsersBySearch = async (usr, attributesArray, searchBy, value) => {
    if (usr.userRole === 'Admin') {
        return await users.findAll({
            attributes: attributesArray,
            where: {
                $and: [
                    { isActive: true },
                    {
                        $or: [
                            { userRole: { $eq: 'Manager' } },
                            { userRole: { $eq: 'SalesAgent' } }
                        ]
                    },
                    {
                        [searchBy]: {
                            $like: `%${value}%`
                        }
                    }
                ]
            },
            raw: true
        });
    } else if (usr.userRole === "Manager") {
        const salesAgents = await users.findAll({
            attributes: attributesArray,
            where: {
                isActive: true,
                headUserId: usr.userId,
                [searchBy]: {
                    $like: `%${value}%`
                }
            },
            raw: true
        });
        return salesAgents;
    } else {
        return [];
    }
};

const getUserUnderAManager = async (managerId, attributesArray, userId) => {
    return await users.findOne({
        attributes: attributesArray,
        where: {
            isActive: true,
            headUserId: managerId,
            id: userId
        },
        raw: true
    });
}

const verifyRole = (userRole, roleName) => {
    return userRole === roleName;
};

module.exports = {
    getRelatedUsers,
    getRelatedUsersBySearch,
    getUserUnderAManager,
    verifyRole
}