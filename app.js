const favicon = require('serve-favicon');
// const logger = require('morgan');
const bodyParser = require('body-parser');
const definition = require('./output_v4.json');

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

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

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
const specs = swaggerJsdoc({definition,apis: ["./routes/*.js"]});
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);
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
