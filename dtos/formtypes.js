const t = require('tcomb');
const { StringPositiveInteger } = require('../utils/types');

const pathParam = t.struct({
  id: StringPositiveInteger
});
module.exports = { pathParam };
