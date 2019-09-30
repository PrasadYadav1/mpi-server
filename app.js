const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const index = require('./routes/index');
const dashboard = require('./routes/dashboard');
const user = require('./routes/user');
const userlocation = require('./routes/userlocation');
const uservisitlocation = require('./routes/uservisitlocation');
const auth = require('./authentication/auth')();
const categories = require('./routes/categories');
const unitsofmeasurements = require('./routes/unitsofmeasurement');
const company = require('./routes/company');
const customer = require('./routes/customer');
const products = require('./routes/product');
const productprices = require('./routes/productprice');
const warehouses = require('./routes/warehouse');
const inventories = require('./routes/inventory');
const stockreceived = require('./routes/stockreceived');
const offers = require('./routes/offer');
const preorders = require('./routes/preorder');
const orders = require('./routes/order');
const app = express();
const argv = require('minimist')(process.argv.slice(2));
const subpath = express();
const swagger = require('swagger-node-express').createNew(subpath);
var methodOverride = require('method-override');
var logs = require('./models').logs;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With,Content-Type, Accept,Authorization');
  next();
});
app.use(logger('dev'));
app.use(bodyParser());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'client')));
app.use('/', index);
app.get('/api-docs', function(req, res) {
  res.sendFile(__dirname + '/dist/index.html');
});
app.use(bodyParser.json());
app.use(auth.initialize());

app.use(methodOverride());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
swagger.setAppHandler(subpath);
app.use(express.static('dist'));
app.use(express.static('dist/clientApp'));
swagger.setApiInfo({
  title: 'MPI API',
  description: 'API to manage Millennium Pharmcon International...',
  termsOfServiceUrl: '',
  contact: 'yourname@something.com',
  license: '',
  licenseUrl: ''
});

app.use('/', index);
app.use('/api/dashboard', dashboard);
app.use('/api/users', user);
app.use('/api/userlocations', userlocation);
app.use('/api/user/visit/locations', uservisitlocation);
app.use('/api/companies', company);
app.use('/api/categories', categories);
app.use('/api/unitsofmeasurements', unitsofmeasurements);

app.use('/api/products', products);
app.use('/api/customers', customer);
app.use('/api/productprices', productprices);
app.use('/api/warehouses', warehouses);
app.use('/api/inventories', inventories);
app.use('/api/stockreceived', stockreceived);
app.use('/api/offers', offers);
app.use('/api/preorders', preorders);
app.use('/api/orders', orders);
// static routes
app.use('/pages/login', index);
app.use('/dashboard', index);
app.use('/list/users', index);
app.use('/forms/usercreate', index);
app.use('/list/users/*/details', index);
app.use('/list/userlocations', index);
app.use('/list/user/visit/locations', index);
app.use('/list/companies', index);
app.use('/list/principal', index);
app.use('/forms/principal/create', index);
app.use('/list/categories', index);
app.use('/list/unitsofmeasurements', index);
app.use('/list/products', index);
app.use('/forms/product/create', index);
app.use('/list/customers', index);
app.use('/forms/customer/create', index);
app.use('/list/customers/*/details', index);
app.use('/list/productprices', index);
app.use('/list/warehouse', index);
app.use('/forms/warehouse/create', index);
app.use('/list/warehouse/*/details', index);
app.use('/list/grn', index);
app.use('/forms/grn', index);
app.use('/list/grn/*/details', index);
app.use('/list/stockreceived', index);
app.use('/list/offers', index);
app.use('/forms/offers/create', index);
app.use('/forms/transactions/preorder', index);
app.use('/forms/transactions/preorder/*/details', index);
app.use('/forms/transactions/order', index);
app.use('/forms/orderdetails/*', index);
app.use('/forms/transactions/invoice', index);
app.use('/forms/invoicedetails/*', index);
app.use('/forms/uom/create', index);
app.use('/hintimages', express.static(__dirname + '/public/images/hintimages'));
app.use('/assets/*', express.static(__dirname + '/public/clientApp/assets'));
app.use('/css', express.static(__dirname + '/public/css/'));

app.use(express.static(path.join(__dirname, 'prod')));
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'prod', 'index.html'));
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

swagger.configureSwaggerPaths('', 'api-docs', '');
const domain = 'localhost';

if (argv.domain !== undefined)
  domain = argv.domain;
else
  console.log(
      'No --domain=xxx specified, taking default hostname "localhost".');

// const applicationUrl = 'http://' + domain + ':' + app.get('port');
const applicationUrl = 'http://' + domain + ':3002';
swagger.configure(applicationUrl, '1.0.0');
// error handler for catalyst errors
function httpclientErrorHandler(err, req, res, next) {
  if (err.response) {
    logs.create({
          status: err.response.status,
          request: null,
          response: null,
          context: 'MPI',
          // message: err.response.data
          message: ''
        })
        .then(x => {
          res.status(500).send({error: err.response.data});
        })
        .catch(error => {
          res.status(500).send({error: err.response.data});
        });
  } else {
    next(err);
  }
}
app.use(httpclientErrorHandler);
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  logs.create({
        status: err.status,
        request: null,
        response: null,
        context: '',
        message: err.message
      })
      .then(x => {
        res.status(err.status || 500);
      })
      .catch(error => {
        res.status(err.status || 500);
      });
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
