const fs = require('fs');
const path = require('path');
const nanoid = require('nanoid');
const JWT = require('jsonwebtoken');
const passport = require('passport');
const generate = require('nanoid/generate');
const srp = require('secure-remote-password/server');

const { createUser, getUserDetails, verifyUser, requestResetPassword, validatePasswordRequest } = require('../db/user');
const {
    saveAccountCredentials,
    retrieveSRPVerifier,
    saveServerEphemeral,
    retrieveSRPCredentials,
} = require('../db/auth');

/* Email Template and Options */
const transporter = require('../mail/mail');
const { verifyMailText, resetMailText } = require('../mail/text');

const verifyEmailTemplatePath = path.join(__dirname, '../mail/template-verify.html');
const verifyEmailTemplate = fs.readFileSync(verifyEmailTemplatePath, { encoding: 'utf-8' });
const resetEmailTemplatePath = path.join(__dirname, '../mail/template-reset.html');
const resetEmailTemplate = fs.readFileSync(resetEmailTemplatePath, { encoding: 'utf-8' });

/* Function to generate JWT Token */
const genJWTtoken = ({ email, name }) => {
    return JWT.sign(
        {
            iss: 'ApiAuth',
            id: email,
            name,
            iat: new Date().getTime(),
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
        // console.log(user);
        return next();
    })(req, res, next);
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

/* Done */
exports.verify = async (req, res) => {
    const { verificationToken = '', email = '' } = req.body;
    const user = await verifyUser({ email, verificationToken });
    if (user) {
        return res.status(201).json({ userId: user.userId, email: user.email, versionCode: user.versionCode });
    }
    return res.status(403).json({ error: 'Invalid email id or verification code' });
};

// ToDo: Refactor
exports.finalizeAccount = async (req, res) => {
    const { verifier, salt, email, userId, encryptionKeys } = req.body;
    const userAuth = await saveAccountCredentials({ verifier, salt, email, userId, encryptionKeys });
    if (userAuth) {
        return res.status(201).json({ status: 'Account completion successful.' });
    }
    return res.status(403).json({ error: 'Account completion failed.' });
};

// ToDo: Refactor
exports.login = async (req, res) => {
    const { stage, email } = req.body;
    switch (stage) {
        case 'init': {
            const { verifier, salt, userId } = await retrieveSRPVerifier({ email });
            if (salt && verifier && userId) {
                // Compute serverEphemeral
                const serverEphemeral = srp.generateEphemeral(verifier);
                // Store `serverEphemeral.secret`
                await saveServerEphemeral({ serverSecretEphemeral: serverEphemeral.secret, email });
                // Send `salt` and `serverEphemeral.public` to the client
                return res.status(201).json({ userId, salt, serverPublicEphemeral: serverEphemeral.public });
            }
            /**
             * Send a bogus salt, userId & ephemeral value to avoid leaking which users have signed up
             * ToDo: Handle the error when done so
             * (https://github.com/LinusU/secure-remote-password/issues/1#issuecomment-508971375)
             */
            const sampleSalt = nanoid();
            const endSuffix = generate('1234567890', 2);
            const userRandomPrefix = generate('1245689abefklprtvxz', 6);
            const sampleUserId = `user_${userRandomPrefix}_${endSuffix}`;
            const sampleEphemeral = srp.generateEphemeral(sampleSalt);
            return res
                .status(201)
                .json({ userId: sampleUserId, salt: sampleSalt, serverPublicEphemeral: sampleEphemeral.public });
        }
        case 'login': {
            const { clientPublicEphemeral, clientSessionProof } = req.body;
            const { verifier, salt, userId, name, serverSecretEphemeral } = await retrieveSRPCredentials({ email });
            if (verifier && salt && userId && name && serverSecretEphemeral) {
                try {
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
                    return res.status(201).json({ serverSessionProof, token, name });
                } catch (err) {
                    return res.status(403).json({ error: 'Invalid client session proof' });
                }
            }
            return res.status(201).json({ status: 'Account signup was left incomplete.' });
        }
        default: {
            return res.status(403).json({ error: 'Invalid Request' });
        }
    }
};

// ToDo: Get `name`
exports.renewToken = async (req, res) => {
    const { email, name } = req.user;
    const token = genJWTtoken({ email, name });
    return res.status(200).json({ token });
};

// ToDo: Refactor later
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
