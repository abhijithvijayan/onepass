const fs = require('fs');
const path = require('path');
const nanoid = require('nanoid');
const JWT = require('jsonwebtoken');
const passport = require('passport');
const generate = require('nanoid/generate');
const srp = require('secure-remote-password/server');

const {
    createUser,
    getUserDetails,
    verifyUser,
    genEmergencyKit,
    requestResetPassword,
    validatePasswordRequest,
} = require('../db/user');
const {
    saveAccountAuthCredentials,
    retrieveSRPVerifier,
    saveServerEphemeral,
    retrieveSRPCredentials,
} = require('../db/auth');
const { isAdmin } = require('../utils');

/* Email Template and Options */
const transporter = require('../mail/mail');
const { verifyMailText, resetMailText } = require('../mail/text');

const verifyEmailTemplatePath = path.join(__dirname, '../mail/template-verify.html');
const verifyEmailTemplate = fs.readFileSync(verifyEmailTemplatePath, { encoding: 'utf-8' });
const resetEmailTemplatePath = path.join(__dirname, '../mail/template-reset.html');
const resetEmailTemplate = fs.readFileSync(resetEmailTemplatePath, { encoding: 'utf-8' });

/* Function to generate JWT Token */
const genJWTtoken = ({ email, name }) => {
    // ToDo: verify the expiry time
    return JWT.sign(
        {
            iss: 'ApiAuth',
            id: email,
            iat: new Date().getTime(),
            name,
            isAdmin: isAdmin(email),
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

exports.authWithJWT = (req, res, next) => {
    return passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(400);
        }
        if (!user) {
            return res.status(401).json({ user, message: info ? info.message : 'Authentication failed' });
        }
        if (user && !user.isVerified) {
            return res.status(400).json({
                error:
                    'Your email address is not verified. Please check you mailbox or Sign Up again to get the verification link',
            });
        }
        if (user) {
            req.user = user;
        }
        return next();
    })(req, res, next);
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
    if (user && user.isVerified && user.hasCompletedSignUp) {
        return res.status(403).json({ error: 'This email is already registered' });
    }
    const newUser = await createUser({ email, name });
    // ToDo: Restore
    /* Handle Verification email */
    // const mail = await transporter.sendMail({
    //     from: process.env.MAIL_FROM || process.env.MAIL_USER,
    //     to: newUser.email,
    //     subject: `Verification code: ${newUser.verificationToken}`,
    //     text: verifyMailText.replace(/{{verification}}/gim, newUser.verificationToken),
    //     html: verifyEmailTemplate.replace(/{{verification}}/gim, newUser.verificationToken),
    // });
    // if (mail.accepted.length) {
    //     return res.status(201).json({ email, message: 'Verification email has been sent.' });
    // }
    // return res.status(400).json({ error: "Couldn't send verification email. Try again." });
    return res.status(201).json({ email, message: 'Sending Email temporarily disabled.' });
};

exports.verify = async (req, res) => {
    const { verificationToken = '', email = '' } = req.body;
    if (verificationToken.length > 6) {
        return res.status(400).json({ error: 'Verification code must be 6 characters' });
    }
    const user = await verifyUser({ email, verificationToken });
    if (user) {
        return res.status(201).json({ userId: user.userId, email: user.email, versionCode: user.versionCode });
    }
    return res.status(403).json({ error: 'Invalid email id or verification code' });
};

exports.finalizeAccount = async (req, res) => {
    const { verifier, salt, email, userId, encryptionKeys } = req.body;
    const serverResponse = await saveAccountAuthCredentials({ verifier, salt, email, userId, encryptionKeys });
    if (serverResponse.status) {
        return res.status(201).json({ status: 'Account signup successful.' });
    }
    return res.status(403).json({ error: 'Account signup failed.' });
};

exports.login = async (req, res) => {
    const { stage, email } = req.body;
    switch (stage) {
        case 'init': {
            const { verifier, salt, userId } = await retrieveSRPVerifier({ email });
            if (salt && verifier && userId) {
                try {
                    // Compute serverEphemeral
                    const serverEphemeral = srp.generateEphemeral(verifier);
                    // Store `serverEphemeral.secret`
                    await saveServerEphemeral({ serverSecretEphemeral: serverEphemeral.secret, email });
                    // Send `salt` and `serverEphemeral.public` to the client
                    return res.status(201).json({ userId, salt, serverPublicEphemeral: serverEphemeral.public });
                } catch (err) {
                    return res.status(403).json({ error: 'Invalid SRP Verifier.' });
                }
            }
            return res.status(403).json({ error: 'Account signup was left incomplete.' });
        }
        case 'login': {
            const { clientPublicEphemeral = '', clientSessionProof = '' } = req.body;
            const { verifier, salt, user, serverSecretEphemeral } = await retrieveSRPCredentials({ email });
            if (verifier && salt && user && serverSecretEphemeral) {
                try {
                    const { userId, name } = user;
                    const serverSession = srp.deriveSession(
                        serverSecretEphemeral,
                        clientPublicEphemeral,
                        salt,
                        userId,
                        verifier,
                        clientSessionProof
                    );
                    const serverSessionProof = serverSession.proof;
                    const token = genJWTtoken({ email, name });
                    return res.status(201).json({ serverSessionProof, token, user });
                } catch (err) {
                    return res.status(403).json({ error: 'Invalid secret key or master password' });
                }
            }
            return res.status(403).json({ error: 'Account signup was left incomplete.' });
        }
        default: {
            return res.status(403).json({ error: 'Invalid Request' });
        }
    }
};

exports.getEmergencyKit = async (req, res) => {
    const { email } = req.user;
    const response = await genEmergencyKit({ email });
    const { status } = response;
    if (status) {
        const { message } = response;
        return res.status(201).json({ status, message });
    }
    const { error } = response;
    return res.status(403).json({ status, error });
};

/* ------------------------------------------------------------- */
/*                 // ToDo: REFACTOR Later
/* ------------------------------------------------------------- */

// ToDo: Get `name`
exports.renewToken = async (req, res) => {
    const { email, name } = req.user;
    const token = genJWTtoken({ email, name });
    return res.status(200).json({ token });
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

// ToDo: Refactor
/* Reset the passwordResetToken and timer */
exports.resetPasswordValidation = async (req, res, next) => {
    const { email, name, passwordResetToken } = req.query;
    const user = await validatePasswordRequest({ email, passwordResetToken });
    if (user) {
        // generate some new token for other api after this middleware
        // ToDo: Get `name`
        const token = genJWTtoken({ name, email });
        req.user = { token };
        return next();
    }
    return res.status(403).json({ error: 'Invalid email id or password reset token' });
};

// ToDo: changePassword method after resetting flags
