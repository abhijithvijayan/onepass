const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./server/routes');
const errorHandlers = require('./server/handlers/errorHandlers');


// create our Express app
const app = express();

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/', routes);

app.use(errorHandlers.notFound);

if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);


module.exports = app;