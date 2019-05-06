const t = require('tcomb');
const types = require('../utils/types');

const email = t.refinement(t.String, s => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(s))
const customerPost = t.struct({
    name: t.String,
    customerType: t.String,
    buildingName: t.String,
    city: t.String,
    province: t.String,
    areaCode: t.String,
    phoneNumber: t.String,
    primaryContactPerson: t.String,
    primaryContactNumber: t.String,
    primaryEmail: email,
    secondaryContactPerson: t.String,
    secondaryContactNumber: t.String,
    secondaryEmail: email,
    address: t.String,
    description: t.maybe(t.String),
    latitude: t.Number,
    longitude: t.Number
});

module.exports = {
    customerPost
};