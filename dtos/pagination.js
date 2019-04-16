const t = require('tcomb');
const StringNumber = require('../utils/types').StringNumber;

const Pagination = t.struct({
  pageSize: StringNumber,
  pageIndex: StringNumber
});

module.exports = { Pagination };
