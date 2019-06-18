const path = require('path');
const morgan = require('morgan');
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');

const routes = require('./server/routes');
const errorHandlers = require('./server/handlers/errorHandlers');

const dev = process.env.NODE_ENV !== 'production';

require('./server/handlers/passport');

// create our Express app
const app = express();

/* Logger */
if (dev) {
  app.use(morgan('dev'));
}

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(passport.initialize());

app.use('/', routes);

app.use(errorHandlers.notFound);

if (dev) {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);


module.exports = app;