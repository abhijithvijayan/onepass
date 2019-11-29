// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

const next = require('next');
const morgan = require('morgan');
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

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
    finalizeAccountValidationCriterias,
    finalizeAccountValidationBody,
    addOrUpdateItemCriterias,
    addOrUpdateItemBody,
    deleteItemCriterias,
    deleteItemBody,
    createOrUpdateFolderCriterias,
    createOrUpdateFolderBody,
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
    server.use(cookieParser());
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

    server.get('/api/v1/', auth.authWithJWT, api.sendStatus);

    server.get('/', (req, res) => nextApp.render(req, res, '/'));

    server.get('/login', (req, res) => nextApp.render(req, res, '/login'));

    server.get('/signup', (req, res) => nextApp.render(req, res, '/signup'));

    server.get('/vault', (req, res) => nextApp.render(req, res, '/vault'));

    server.get('/about', (req, res) => nextApp.render(req, res, '/about'));

    server.get('/logout', (req, res) => nextApp.render(req, res, '/logout'));

    /* ---------------------------------------- */
    /* ---- User and Authentication routes ---- */
    /* ---------------------------------------- */

    /* User Signup */
    server.post('/api/v1/auth/signup', signUpValidationCriterias, signUpValidationBody, catchErrors(auth.signup));

    /* Email - Verification */
    server.post('/api/v1/auth/verify', emailVerificationCriterias, emailVerificationBody, catchErrors(auth.verify));

    /* Save SRP Verifier and Salt */
    server.post(
        '/api/v1/account/activate',
        finalizeAccountValidationCriterias,
        finalizeAccountValidationBody,
        catchErrors(auth.finalizeAccount)
    );

    /* User Login */
    server.post('/api/v1/auth/login', loginValidationCriterias, loginValidationBody, catchErrors(auth.login));

    /* Get Initial Emergency Kit */
    server.get('/api/v1/auth/login.getEmergencyKit', auth.authWithJWT, catchErrors(auth.getEmergencyKit));

    server.get('/api/v1/account/keysets', auth.authWithJWT, catchErrors(auth.fetchEncKeys));

    /* ---------------------------------------- */
    /* ------------- Vault routes ------------- */
    /* ---------------------------------------- */

    server.get('/api/v1/vault/getVaultData', auth.authWithJWT, catchErrors(vault.fetchVaultData));

    server.post(
        '/api/v1/vault/addOrUpdateItem',
        addOrUpdateItemCriterias,
        addOrUpdateItemBody,
        auth.authWithJWT,
        catchErrors(vault.addOrUpdateVaultItem)
    );

    server.post(
        '/api/v1/vault/addOrUpdateFolder',
        createOrUpdateFolderCriterias,
        createOrUpdateFolderBody,
        auth.authWithJWT,
        catchErrors(vault.addOrUpdateFolder)
    );

    server.post(
        '/api/v1/vault/deleteItem',
        deleteItemCriterias,
        deleteItemBody,
        auth.authWithJWT,
        catchErrors(vault.deleteVaultItem)
    );

    /* ---------------------------------------- */
    /* ------------ REFACTOR ROUTES ----------- */
    /* ---------------------------------------- */
    // // ToDo: add verificationcriterias to body
    // server.post('/api/v1/auth/renew.token', auth.authWithJWT, catchErrors(auth.renewToken));

    /* Forget Password Form submission */
    // // ToDo Route
    // server.post(
    //     '/api/v1/auth/reset',
    //     resetPasswordFormCriterias,
    //     resetPasswordFormBody,
    //     catchErrors(auth.requestPasswordReset),
    //     // ToDo: alert to check mailbox
    //     api.sendStatus
    // );

    // /* Email - Password Reset */
    // // ToDo Route
    // server.get(
    //     '/api/v1/auth/reset:email?:passwordResetToken?',
    //     emailPasswordResetCriterias,
    //     emailPasswordResetBody,
    //     // middleware
    //     catchErrors(auth.resetPasswordValidation),
    //     // ToDo: change password action (redo encryption of every password collection)
    //     api.sendStatus
    // );

    /* ---------------------------------------- */
    /* ---------- Ends Custom Routes ---------- */
    /* ---------------------------------------- */

    server.get('*', (req, res) => handle(req, res));

    server.listen(port, err => {
        if (err) throw err;
        // eslint-disable-next-line no-console
        console.log(`> Express running on http://localhost:${port}`);
    });
});
