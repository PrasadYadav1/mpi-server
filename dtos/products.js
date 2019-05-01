const t = require('tcomb');
const { StringPositiveInteger } = require('../utils/types')

const productPriceCatalogueParams = t.struct({
    productId: StringPositiveInteger
})

module.exports = {
   productPriceCatalogueParams
}