const validator = require('express-validator/check');
const { validationResult } = require('express-validator/check');


exports.validationCriterias = [
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

exports.validateBody = (req, res, next) => {
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