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

const nextApp = next({ dev, dir: '../packages/web' });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
    const app = express();

    /* Logger */
    if (dev) {
        app.use(morgan('dev'));
    }

    // Takes the raw requests and turns them into usable properties on req.body
    app.use(bodyParser.json());
    app.use(
        bodyParser.urlencoded({
            extended: true,
        })
    );

    app.use(passport.initialize());

    app.use('/', routes);

    app.get('*', (req, res) => {
        return handle(req, res);
    });

    app.listen(port, err => {
        if (err) throw err;
        // eslint-disable-next-line no-console
        console.log(`> Express running on http://localhost:${port}`);
    });
});
