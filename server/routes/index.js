const path = require('path');
const express = require('express');
const router = express.Router();

const api = require('./api');
const { catchErrors } = require('../handlers/errorHandlers');
const auth = require('../controllers/authController');
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
} = require('../controllers/validateBodyController');


router.get('/api/v1/', api.sendStatus);

/* ---------------------------------------- */
/* ---- User and Authentication routes ---- */
/* ---------------------------------------- */

/* User Signup */
router.post('/api/v1/auth/signup', 
    signUpValidationCriterias, 
    signUpValidationBody,
    catchErrors(auth.signup),
    // ToDo: alert to check mailbox
);
/* User Login */
router.post('/api/v1/auth/login',
    loginValidationCriterias,
    loginValidationBody,
    api.sendStatus
);
/* Email - Verification */
router.get('/api/v1/auth/verify:email?:verificationToken?', 
    emailVerificationCriterias,
    emailVerificationBody,
    catchErrors(auth.verify),
    // ToDo: alert email verified
    api.sendStatus
);
/* Forget Password Form submission */
router.post('/api/v1/auth/reset',
    resetPasswordFormCriterias,
    resetPasswordFormBody,
    catchErrors(auth.requestPasswordReset),
    // ToDo: alert to check mailbox
    api.sendStatus
)
/* Email - Password Reset */
router.get('/api/v1/auth/reset:email?:passwordResetToken?',
    emailPasswordResetCriterias,
    emailPasswordResetBody,
    catchErrors(auth.resetPasswordValidation),
    // ToDo: change password action
    api.sendStatus
);
router.post('/api/v1/auth/updatePassword',
    changePasswordCriterias,
    changePasswordBody,
    // ToDo: Change password
    api.sendStatus
);

module.exports = router;
