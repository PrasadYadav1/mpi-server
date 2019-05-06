const t = require('tcomb');
const types = require('../utils/types');

const email = t.refinement(t.String, s => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(s))
const warehousePost = t.struct({
    name: t.String,
    email: email,
    phoneNumber: t.String,
    warehouseType: t.String,
    primaryWarehouse: t.maybe(t.String),
    province: t.String,
    address: t.String,
    latitude: t.Number,
    longitude: t.Number,
    areaCode: t.String,
    buildingName: t.String,
    city: t.String,
    description: t.maybe(t.String)


});

module.exports = {
    warehousePost
};