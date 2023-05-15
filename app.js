const favicon = require('serve-favicon');
// const logger = require('morgan');
const bodyParser = require('body-parser');

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
// swagger api
const swaggerInstall = require('./util/swagger')
const {error} = require("swagger-node-express");
swaggerInstall(app)

// Configure view engine and views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware for logging
app.use(logger('dev'));

// Middleware for parsing JSON and urlencoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware for parsing cookies
app.use(cookieParser());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers for handling requests
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Middleware for handling 404 errors
app.use(function(req, res, next) {
  next(createError(404));
});

// Middleware for handling errors
app.use(function(err, req, res, next) {
  // Set locals for rendering error page
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render error page
  res.status(err.status || 500);
  res.render('error');
});

// Export app for use in other modules
module.exports = app;
