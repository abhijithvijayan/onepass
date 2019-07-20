const validator = require('express-validator');
const { validationResult } = require('express-validator');

/* SignUp Form */
exports.signUpValidationCriterias = [
    validator
        .body('email')
        .exists()
        .withMessage('You must provide a valid email address.')
        .isEmail()
        .withMessage('Email address you entered is not valid.')
        .trim()
        .normalizeEmail(),
    validator
        .body('name')
        .exists()
        .withMessage('You must provide your name.'),
];

exports.signUpValidationBody = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsObj = errors.mapped();
        const emailError = errorsObj.email && errorsObj.email.msg;
        const nameError = errorsObj.name && errorsObj.name.msg;
        return res.status(400).json({ error: emailError || nameError });
    }
    return next();
};

/* Email - Verification Token */
exports.emailVerificationCriterias = [
    validator
        .body('email')
        .exists()
        .withMessage('No email address found.')
        .isEmail()
        .withMessage('Invalid email address.')
        .trim()
        .normalizeEmail(),
    validator
        .body('verificationToken')
        .exists()
        .withMessage('No valid verification token.'),
];

exports.emailVerificationBody = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsObj = errors.mapped();
        const emailError = errorsObj.email && errorsObj.email.msg;
        const tokenError = errorsObj.verificationToken && errorsObj.verificationToken.msg;
        return res.status(400).json({ error: emailError || tokenError });
    }
    return next();
};

exports.finalizeAccountValidationCriterias = [
    validator
        .body('email')
        .exists()
        .withMessage('No email address found.')
        .isEmail()
        .withMessage('Invalid email address.')
        .trim()
        .normalizeEmail(),
    validator
        .body('userId')
        .exists()
        .withMessage('No valid userId.'),
    validator
        .body('salt')
        .exists()
        .withMessage('No valid salt.'),
    validator
        .body('verifier')
        .exists()
        .withMessage('No valid verifier.'),
    validator
        .body('encryptionKeys')
        .exists()
        .withMessage('No valid encryption keys.'),
];

exports.finalizeAccountValidationBody = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsObj = errors.mapped();
        const emailError = errorsObj.email && errorsObj.email.msg;
        const userIdError = errorsObj.userId && errorsObj.userId.msg;
        const saltError = errorsObj.salt && errorsObj.salt.msg;
        const verifierError = errorsObj.verifier && errorsObj.verifier.msg;
        const encryptionKeysError = errorsObj.encryptionKeys && errorsObj.encryptionKeys.msg;
        return res
            .status(400)
            .json({ error: emailError || userIdError || saltError || verifierError || encryptionKeysError });
    }
    return next();
};

/* Login Form */
exports.loginValidationCriterias = [
    validator
        .body('email')
        .exists()
        .withMessage('You must provide a valid email address.')
        .isEmail()
        .withMessage('Email address you entered is not valid.')
        .trim()
        .normalizeEmail(),
    validator
        .body('stage')
        .exists()
        .withMessage('No srp stage is specified.'),
];

exports.loginValidationBody = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsObj = errors.mapped();
        const emailError = errorsObj.email && errorsObj.email.msg;
        const stageError = errorsObj.stage && errorsObj.stage.msg;
        return res.status(400).json({ error: emailError || stageError });
    }
    return next();
};

/* ------------------------------------------------------------- */
/*                 // ToDo: REFACTOR Later
/* ------------------------------------------------------------- */

/* Forget Password Form */
exports.resetPasswordFormCriterias = [
    validator
        .body('email')
        .exists()
        .withMessage('You must provide a valid email address.')
        .isEmail()
        .withMessage('Email address you entered is not valid.')
        .trim()
        .normalizeEmail(),
];

exports.resetPasswordFormBody = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsObj = errors.mapped();
        const emailError = errorsObj.email && errorsObj.email.msg;
        return res.status(400).json({ error: emailError });
    }
    return next();
};

/* Email - Password Reset Link */
exports.emailPasswordResetCriterias = [
    validator
        .query('email')
        .exists()
        .withMessage("Link doesn't contain an email address.")
        .isEmail()
        .withMessage("Link doesn't contain a valid email address.")
        .trim()
        .normalizeEmail(),
    validator
        .query('passwordResetToken')
        .exists()
        .withMessage("Link doesn't contain a valid password reset token."),
];

exports.emailPasswordResetBody = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsObj = errors.mapped();
        const emailError = errorsObj.email && errorsObj.email.msg;
        const tokenError = errorsObj.passwordResetToken && errorsObj.passwordResetToken.msg;
        return res.status(400).json({ error: emailError || tokenError });
    }
    return next();
};

exports.changePasswordCriterias = [
    validator
        .body('password', 'New Master Password should be at least 8 chars long.')
        .exists()
        .withMessage('You must supply a new OnePass Master Password.')
        .isLength({ min: 8 }),
];

exports.changePasswordBody = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsObj = errors.mapped();
        const passwordError = errorsObj.password && errorsObj.password.msg;
        return res.status(400).json({ error: passwordError });
    }
    return next();
};
