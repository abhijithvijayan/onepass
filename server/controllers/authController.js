const fs = require('fs');
const path = require('path');
const JWT = require('jsonwebtoken');
const passport = require('passport');

const { createUser, getUserDetails, verifyUser, requestResetPassword, validatePasswordRequest } = require('../db/user');

/* Email Template and Options */
const transporter = require('../mail/mail');
const { verifyMailText, resetMailText } = require('../mail/text');

const verifyEmailTemplatePath = path.join(__dirname, '../mail/template-verify.html');
const verifyEmailTemplate = fs.readFileSync(verifyEmailTemplatePath, { encoding: 'utf-8' });
const resetEmailTemplatePath = path.join(__dirname, '../mail/template-reset.html');
const resetEmailTemplate = fs.readFileSync(resetEmailTemplatePath, { encoding: 'utf-8' });

/* Function to generate JWT Token */
const genToken = user => {
    return JWT.sign(
        {
            iss: 'ApiAuth',
            id: user.email,
            iat: new Date().getTime(),
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

exports.signup = async (req, res) => {
    const { email, name } = req.body;
    if (email.length > 64) {
        return res.status(400).json({ error: 'Maximum length of email id is 64 characters' });
    }
    if (name.length > 64) {
        return res.status(400).json({ error: 'Maximum length of name is 64 characters' });
    }
    const user = await getUserDetails({ email });
    if (user && user.isVerified) {
        return res.status(403).json({ error: 'This email is already registered' });
    }
    const newUser = await createUser({ email, name });
    /* Handle Verification email */
    const mail = await transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.MAIL_USER,
        to: newUser.email,
        subject: `Verification code: ${newUser.verificationToken}`,
        text: verifyMailText.replace(/{{verification}}/gim, newUser.verificationToken),
        html: verifyEmailTemplate.replace(/{{verification}}/gim, newUser.verificationToken),
    });
    if (mail.accepted.length) {
        return res.status(201).json({ email, message: 'Verification email has been sent.' });
    }
    return res.status(400).json({ error: "Couldn't send verification email. Try again." });
};

exports.verify = async (req, res, next) => {
    const { verificationToken = '', email = '' } = req.query;
    const user = await verifyUser({ email, verificationToken });
    if (user) {
        // generate some new token for other api request after this
        const token = genToken(user);
        req.user = { token };
        return next();
    }
    return res.status(403).json({ error: 'Invalid email id or verification code' });
};

exports.login = (req, res) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                user,
                error: info ? info.message : 'Login failed',
            });
        }
        if (user && !user.isVerified) {
            return res.status(400).json({
                error:
                    'Your email address is not verified. Please check you mailbox or Sign Up again to get the verification link',
            });
        }
        req.login(user, { session: false }, err => {
            if (err) {
                res.send(err);
            }
            // generate token and return it
            const token = genToken(user);
            return res.status(200).json({ token });
        });
    })(req, res);
};

exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    const user = await requestResetPassword({ email });
    if (!user) {
        return res.status(400).json({ error: 'No account found for this email.' });
    }
    /* Handle Password Reset email */
    const mail = await transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.MAIL_USER,
        to: user.email,
        subject: 'Reset your OnePass Master Password',
        text: resetMailText.replace(/{{reset}}/gim, user.passwordResetToken),
        html: resetEmailTemplate.replace(/{{reset}}/gim, user.passwordResetToken),
    });
    if (mail.accepted.length) {
        return res.status(201).json({ email, message: 'Password reset email has been sent.' });
    }
    return res.status(400).json({ error: "Couldn't send password reset email. Try again." });
};

/* Reset the passwordResetToken and timer */
exports.resetPasswordValidation = async (req, res, next) => {
    const { email, passwordResetToken } = req.query;
    const user = await validatePasswordRequest({ email, passwordResetToken });
    if (user) {
        // generate some new token for other api after this middleware
        const token = genToken(user);
        req.user = { token };
        return next();
    }
    return res.status(403).json({ error: 'Invalid email id or password reset token' });
};

// ToDo: changePassword method after resetting flags
