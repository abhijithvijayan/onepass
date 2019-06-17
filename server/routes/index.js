const path = require('path');
const express = require('express');
const router = express.Router();

const { catchErrors } = require('../handlers/errorHandlers');
const user = require('../controllers/userController');
const auth = require('../controllers/authController');
const { 
    signUpValidationCriterias,
    validateSignUpBody,
    emailVerificationCriterias,
    validateVerificationEmailBody
} = require('../controllers/validateBodyController');
const api = require('./api');

router.get('/api/v1/', api.sendStatus);

/* User and authentication routes */
router.post('/api/v1/auth/signup', 
    signUpValidationCriterias, 
    validateSignUpBody,
    catchErrors(auth.signup)
);
router.get('/api/v1/auth/verify:email?:verificationToken?', 
    // emailVerificationCriterias,
    // validateVerificationEmailBody,
    catchErrors(auth.verify),
    api.sendStatus
);



module.exports = router;
