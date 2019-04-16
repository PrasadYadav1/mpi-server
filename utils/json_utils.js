const sequelizeArrayToJsonArray = seqArray =>
  seqArray.map(ttp => ttp.get({ plain: true }));

const sequelizeObjToJsonObj = seqObj => seqObj.get({ plain: true });

module.exports = { sequelizeArrayToJsonArray, sequelizeObjToJsonObj };
