const t = require('tcomb');
const types = require('../utils/types');

const offerPost = t.struct({
    offerDate: types.FormatedDate('YYYY-MM-DD'),
    productId: t.Number,
    offerType: t.String,
    imageUrl: t.list(t.String)
});

module.exports = {
    offerPost
};