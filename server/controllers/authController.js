const fs = require('fs');
const path = require('path');
const nanoid = require('nanoid');
const JWT = require('jsonwebtoken');
const srp = require('secure-remote-password/server');

const { createUser, getUserDetails, verifyUser, requestResetPassword, validatePasswordRequest } = require('../db/user');
const { saveVerifier, retrieveSRPVerifier, saveServerEphemeral } = require('../db/auth');

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

/* Done */
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

/* Done */
exports.verify = async (req, res) => {
    const { verificationToken = '', email = '' } = req.body;
    const user = await verifyUser({ email, verificationToken });
    if (user) {
        // generate some new token for other api request after this
        // const token = genToken(user);
        // req.user = { token };
        return res.status(201).json({ userId: user.accountId, email: user.email, version: user.versionCode });
    }
    return res.status(403).json({ error: 'Invalid email id or verification code' });
};

/* Done */
exports.saveSRPVerifier = async (req, res) => {
    const { verifier, salt, email, userId } = req.body;
    const userAuth = await saveVerifier({ verifier, salt, email, userId });
    if (userAuth) {
        return res.status(201).json({ status: 'ok' });
    }
    return res.status(403).json({ error: 'SRP Verifier not saved.' });
};

// ToDo: Refactor
exports.login = async (req, res) => {
    const { stage } = req.body;
    switch (stage) {
        case 1: {
            const { email } = req.body;
            const { verifier, salt } = await retrieveSRPVerifier({ email });
            if (salt && verifier) {
                // Compute serverEphemeral
                const serverEphemeral = srp.generateEphemeral(verifier);
                // Store `serverEphemeral.secret`
                await saveServerEphemeral({ serverSecretEphemeral: serverEphemeral.secret, email });
                // Send `salt` and `serverEphemeral.public` to the client
                return res.status(201).json({ email, salt, serverPublicEphemeral: serverEphemeral.public });
            }
            const sampleSalt = nanoid();
            const sampleEphemeral = srp.generateEphemeral(sampleSalt);
            // Send a bogus salt and ephemeral value to avoid leaking which users have signed up
            return res.status(201).json({ email, salt: sampleSalt, serverPublicEphemeral: sampleEphemeral.public });
        }
        default: {
            return res.status(403).json({ error: 'Invalid Request' });
        }
    }
    // if (user && !user.isVerified) {
    //     return res.status(400).json({
    //         error:
    //             'Your email address is not verified. Please check you mailbox or Sign Up again to get the verification link',
    //     });
    // }
};

// ToDo: Refactor
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

// ToDo: Refactor
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
