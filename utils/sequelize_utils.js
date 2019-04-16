const sequelize = require('sequelize');

const ntEqual = val =>  ({ $ne: val })
const grtOrEqual = val => ({$gte: val})
const lessOrEqual = val => ({$lte: val})
const equal = val =>  ({ $eq: val })

const getSqlize =  (config) => {
   return new sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: "postgres"
  });
} 

module.exports = {ntEqual,grtOrEqual,lessOrEqual,equal, getSqlize}




