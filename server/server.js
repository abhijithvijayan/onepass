// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

const express = require('express');
const next = require('next');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const bodyParser = require('body-parser');

const routes = require('./routes');
const errorHandlers = require('./handlers/errorHandlers');

require('./handlers/passport');

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT, 10) || 4000;

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
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

  app.listen(port, err => {
    if (err) throw err
    console.log(`> Express running on http://localhost:${port}`)
  });

});