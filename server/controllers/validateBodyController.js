const validator = require('express-validator/check');
const { validationResult } = require('express-validator/check');

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
      .body('password', 'Master Password must be at least 8 chars long.')
      .exists()
      .withMessage('You must supply a secure Master Password.')
      .isLength({ min: 8 }),
    validator
      .body('confirmPassword', 'Passwords do not match')
      .exists()
      .withMessage('You must confirm the Master Password')
      .custom((value, { req }) => (value === req.body.password)),
];

exports.signUpValidationBody = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsObj = errors.mapped();
    const emailError = errorsObj.email && errorsObj.email.msg;
    const passwordError = errorsObj.password && errorsObj.password.msg;
    const confirmPasswordError = errorsObj.confirmPassword && errorsObj.confirmPassword.msg;
    return res.status(400).json({ error: emailError || passwordError || confirmPasswordError });
  }
  return next();
};

/* Email - Verification Link */
exports.emailVerificationCriterias = [
    validator
      .query('email')
      .exists()
      .withMessage('Link doesn\'t contain an email address.')
      .isEmail()
      .withMessage('Link doesn\'t contain a valid email address.')
      .trim()
      .normalizeEmail(),
    validator
      .query('verificationToken')
      .exists()
      .withMessage('Link doesn\'t contain a valid verification token.')
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
}

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
}

/* Email - Password Reset Link */
exports.emailPasswordResetCriterias = [
  validator
    .query('email')
    .exists()
    .withMessage('Link doesn\'t contain an email address.')
    .isEmail()
    .withMessage('Link doesn\'t contain a valid email address.')
    .trim()
    .normalizeEmail(),
  validator
    .query('passwordResetToken')
    .exists()
    .withMessage('Link doesn\'t contain a valid password reset token.')
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
}