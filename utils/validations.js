const t = require('tcomb');
const tvalidation = require('tcomb-validation');

const validateRequest = (reqBody, type) => {
  let result = tvalidation.validate(reqBody, type);
  return {
    isValid: result.isValid(),
    errors: result.errors.map(x => x.message)
  };
};

module.exports = { validateRequest };
