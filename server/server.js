// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

const next = require('next');
const morgan = require('morgan');
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');

require('./handlers/passport');

const api = require('./api');
const auth = require('./controllers/authController');
const vault = require('./controllers/vaultController');
const { catchErrors } = require('./handlers/errorHandlers');
const {
    signUpValidationCriterias,
    signUpValidationBody,
    loginValidationCriterias,
    loginValidationBody,
    emailVerificationCriterias,
    emailVerificationBody,
    resetPasswordFormCriterias,
    resetPasswordFormBody,
    emailPasswordResetCriterias,
    emailPasswordResetBody,
    changePasswordCriterias,
    changePasswordBody,
    createPasswordEntryCriterias,
    createPasswordEntryBody,
} = require('./controllers/validateBodyController');

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT, 10) || 4000;

const nextApp = next({ dev, dir: '../packages/web' });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
    const server = express();

    /* Logger */
    if (dev) {
        server.use(morgan('dev'));
    }
    // Takes the raw requests and turns them into usable properties on req.body
    server.use(bodyParser.json());
    server.use(
        bodyParser.urlencoded({
            extended: true,
        })
    );
    server.use(passport.initialize());

    /* ---------------------------------------- */
    /* -------------- View routes ------------- */
    /* ---------------------------------------- */

    server.get('/api/v1/', api.sendStatus);

    server.get('/', (req, res) => {
        return nextApp.render(req, res, '/');
    });

    /* ---------------------------------------- */
    /* ---- User and Authentication routes ---- */
    /* ---------------------------------------- */

    /* User Signup */
    server.post(
        '/api/v1/auth/signup',
        signUpValidationCriterias,
        signUpValidationBody,
        catchErrors(auth.signup)
        // ToDo: alert to check mailbox
    );
    /* User Login */
    server.post('/api/v1/auth/login', loginValidationCriterias, loginValidationBody, auth.login);
    /* Email - Verification */
    server.post(
        '/api/v1/auth/verify',
        emailVerificationCriterias,
        emailVerificationBody,
        // middleware
        catchErrors(auth.verify),
        // ToDo: alert email verified
        api.sendStatus
    );
    /* Forget Password Form submission */
    server.post(
        '/api/v1/auth/reset',
        resetPasswordFormCriterias,
        resetPasswordFormBody,
        catchErrors(auth.requestPasswordReset),
        // ToDo: alert to check mailbox
        api.sendStatus
    );
    /* Email - Password Reset */
    server.get(
        '/api/v1/auth/reset:email?:passwordResetToken?',
        emailPasswordResetCriterias,
        emailPasswordResetBody,
        // middleware
        catchErrors(auth.resetPasswordValidation),
        // ToDo: change password action (redo encryption of every password collection)
        api.sendStatus
    );
    server.post(
        '/api/v1/auth/updatePassword',
        changePasswordCriterias,
        changePasswordBody,
        // ToDo: Change password
        api.sendStatus
    );

    /* ---------------------------------------- */
    /* --------- Vault Archive Routes --------- */
    /* ---------------------------------------- */

    server.post(
        '/api/v1/vault/createPasswordEntry',
        createPasswordEntryCriterias,
        createPasswordEntryBody,
        catchErrors(vault.createPasswordEntry),
        api.sendStatus
    );

    /* ---------------------------------------- */
    /* ---------- Ends Custom Routes ---------- */
    /* ---------------------------------------- */

    server.get('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(port, err => {
        if (err) throw err;
        // eslint-disable-next-line no-console
        console.log(`> Express running on http://localhost:${port}`);
    });
});
