const validate = require('./validations').validateRequest;

const reqqueryvalidation = type => (req, res, next) => {
  let result = validate(req.query, type);
  if (result.isValid) next();
  else res.status(400).json(result.errors);
};

const reqpathvalidation = type => (req, res, next) => {
  let result = validate(req.path, type);
  if (result.isValid) next();
  else res.status(400).json(result.errors);
};

const reqpathNewvalidation = type => (req, res, next) => {
  let result = validate(req.params, type);
  if (result.isValid) next();
  else res.status(400).json(result.errors);
};

const reqBodyValidation = type => (req, res, next) => {
  let result = validate(req.body, type);
  if (result.isValid) next();
  else res.status(400).json(result.errors);
};

module.exports = { reqqueryvalidation, reqpathvalidation,reqpathNewvalidation, reqBodyValidation };
