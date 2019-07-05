const t = require('tcomb');

const productPost = t.struct({
  name: t.String,
  companyId: t.Integer,
  categoryId: t.Integer,
  subCategoryId: t.maybe(t.Integer),
  units: t.Number,
  unitsofMeasurement: t.String,
  description: t.maybe(t.String),
  classificationName: t.String
});

module.exports = {
  productPost
};
