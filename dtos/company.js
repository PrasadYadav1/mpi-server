const t = require('tcomb');
const types = require('../utils/types');


const companyPost = t.struct({
    name: t.String,
    buildingName: t.String,
    city: t.String,
    province: t.String,
    areaCode: t.String,
    phoneNumber: t.String,
    primaryContactPerson: t.String,
    primaryContactNumber: t.String,
    secondaryContactPerson: t.String,
    secondaryContactNumber: t.String,
    address: t.String,
    description: t.maybe(t.String),
    latitude: t.Number,
    longitude: t.Number

});

module.exports = {
    companyPost
};