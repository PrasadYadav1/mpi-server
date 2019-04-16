const asyncErrorHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const asyncCatalystLoginErrorHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(err => {
    res.status(404);
  });
};

module.exports = { asyncErrorHandler, asyncCatalystLoginErrorHandler };
