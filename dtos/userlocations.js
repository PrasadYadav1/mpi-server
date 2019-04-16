const t = require('tcomb');

const userLocation = t.struct({
  latitude: t.Number,
  longitude: t.Number
});
module.exports = { userLocation };
