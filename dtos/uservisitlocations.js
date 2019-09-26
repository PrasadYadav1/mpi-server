const t = require('tcomb');

const userVisitLocation = t.struct({
  warehouseId: t.Integer,
  visit: t.Boolean,
  latitude: t.Number,
  longitude: t.Number
});
module.exports = { userVisitLocation };
