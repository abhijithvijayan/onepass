const fs = require('fs');
const path = require('path');
const JWT = require('jsonwebtoken');
const passport = require('passport');
const srp = require('secure-remote-password/server');

const {
    createUser,
    getUserDetails,
    verifyUser,
    getEncKeySet,
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
const genJWTtoken = ({ email, name }) =>
    // ToDo: verify the expiry time
    JWT.sign(
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
exports.authWithJWT = (req, res, next) =>
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(400);
        }
        if (!user) {
            return res.status(401).json({ user, message: info ? info.message : 'Authentication failed' });
        }
        if (user && !user.isVerified) {
            return res.status(400).json({
                error: {
                    msg:
                        'Your email address is not verified. Please check you mailbox or Sign Up again to get the verification link',
                    _reported: new Date().getTime(),
                },
            });
        }
        if (user) {
            req.user = user;
        }
        return next();
    })(req, res, next);

exports.signup = async (req, res) => {
    // ToDo: refactor this to a user object (and collect device object)
    const { email, name } = req.body;
    if (email.length > 64) {
        return res.status(400).json({
            error: {
                msg: 'Maximum length of email id is 64 characters',
                _reported: new Date().getTime(),
            },
        });
    }
    if (name.length > 64) {
        return res.status(400).json({
            error: {
                msg: 'Maximum length of name is 64 characters',
                _reported: new Date().getTime(),
            },
        });
    }
    const user = await getUserDetails({ email });
    if (user && user.isVerified && user.hasCompletedSignUp && user.hasDownloadedEmergencyKit) {
        return res.status(403).json({
            error: {
                msg: 'This email is already registered',
                _reported: new Date().getTime(),
            },
        });
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
    //     return res.status(201).json({
    //         email,
    //         msg: 'Verification email has been sent.',
    //         _reported: new Date().getTime(),
    //     });
    // }
    // return res.status(400).json({
    //     error: {
    //         msg: "Couldn't send verification email. Try again.",
    //         _reported: new Date().getTime(),
    //     },
    // });
    return res.status(201).json({
        email,
        msg: 'Sending Email temporarily disabled.',
        _reported: new Date().getTime(),
    });
};

exports.verify = async (req, res) => {
    const { verificationToken = '', email = '' } = req.body;
    if (verificationToken.length > 6) {
        return res.status(400).json({
            error: {
                msg: 'Verification code must be 6 characters',
                _reported: new Date().getTime(),
            },
        });
    }
    const user = await verifyUser({ email, verificationToken });
    if (user) {
        const { userId, versionCode } = user;
        return res.status(201).json({
            userId,
            email: user.email,
            versionCode,
            _reported: new Date().getTime(),
        });
    }
    return res.status(403).json({
        error: {
            msg: 'Invalid email id or verification code. Please try again.',
            _reported: new Date().getTime(),
        },
    });
};

exports.finalizeAccount = async (req, res) => {
    const { verifier, salt, email, userId, encryptionKeys } = req.body;
    const serverResponse = await saveAccountAuthCredentials({ verifier, salt, email, userId, encryptionKeys });
    if (serverResponse.status) {
        return res.status(201).json({
            status: 'Account signup successful.',
            _reported: new Date().getTime(),
        });
    }
    return res.status(403).json({
        error: {
            msg: 'Account signup failed.',
            _reported: new Date().getTime(),
        },
    });
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
                    return res.status(201).json({
                        userId,
                        salt,
                        serverPublicEphemeral: serverEphemeral.public,
                        _reported: new Date().getTime(),
                    });
                } catch (err) {
                    return res.status(403).json({
                        error: {
                            msg: 'Invalid SRP Verifier.',
                            _reported: new Date().getTime(),
                        },
                    });
                }
            }
            return res.status(403).json({
                error: {
                    msg: 'Account signup for this account was left incomplete. Please sign up again.',
                    _reported: new Date().getTime(),
                },
            });
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
                    return res.status(201).json({
                        serverSessionProof,
                        token,
                        user,
                        _reported: new Date().getTime(),
                    });
                } catch (err) {
                    return res.status(403).json({
                        error: {
                            msg: 'Invalid secret key or master password',
                            _reported: new Date().getTime(),
                        },
                    });
                }
            }
            return res.status(403).json({
                error: {
                    msg: 'Account signup for this account was left incomplete. Please sign up again.',
                    _reported: new Date().getTime(),
                },
            });
        }
        default: {
            return res.status(403).json({
                error: {
                    msg: 'Invalid Request',
                    _reported: new Date().getTime(),
                },
            });
        }
    }
};

exports.fetchEncKeys = async (req, res) => {
    const { email } = req.user;
    const response = await getEncKeySet({ email });
    if (response.status) {
        const { encPriKey, encSymKey } = response;
        return res.status(200).json({
            encKeySet: { encPriKey, encSymKey },
            _reported: new Date().getTime(),
        });
    }
    return res.status(403).json({
        error: {
            msg: response.error,
            _reported: new Date().getTime(),
        },
        id: 'keys',
    });
};

exports.getEmergencyKit = async (req, res) => {
    const { email } = req.user;
    const response = await genEmergencyKit({ email });
    const { status } = response;
    if (status) {
        const { message } = response;
        return res.status(201).json({
            status,
            message,
            _reported: new Date().getTime(),
        });
    }
    const { error } = response;
    return res.status(403).json({
        status,
        error: {
            msg: error,
            _reported: new Date().getTime(),
        },
    });
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
        return res.status(400).json({
            error: {
                msg: 'No account found for this email.',
                _reported: new Date().getTime(),
            },
        });
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
        return res.status(201).json({
            email,
            message: 'Password reset email has been sent.',
            _reported: new Date().getTime(),
        });
    }
    return res.status(400).json({
        error: {
            msg: "Couldn't send password reset email. Try again.",
            _reported: new Date().getTime(),
        },
    });
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
    return res.status(403).json({
        error: {
            msg: 'Invalid email id or password reset token',
            _reported: new Date().getTime(),
        },
    });
};

// ToDo: changePassword method after resetting flags
