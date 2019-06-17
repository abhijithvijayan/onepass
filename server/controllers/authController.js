const fs = require('fs');
const path = require('path');

const { createUser, getUserDetails, verifyUser } = require('../db/user');

/* Email Template and Options */
const transporter = require('../mail/mail');
const { verifyMailText } = require('../mail/text');
const verifyEmailTemplatePath = path.join(__dirname, '../mail/template-verify.html');
const verifyEmailTemplate = fs
  .readFileSync(verifyEmailTemplatePath, { encoding: 'utf-8' })
  .replace(/{{domain}}/gm, process.env.DEFAULT_DOMAIN);


exports.signup = async (req, res) => {
    const { email, password } = req.body;
    if (password.length > 64) {
        return res.status(400).json({ error: "Maximum length of Master Password is 64 characters"});
    }
    if (email.length > 64) {
        return res.status(400).json({ error: "Maximum length of email id is 64 characters"});
    }
    const user = await getUserDetails({ email });
    if (user && user.isVerified) {
        return res.status(403).json({ error: 'This email is already registered'});
    }
    const newUser = await createUser({ email, password });
    /* Handle Verification email */
    const text = verifyMailText.replace(/{{domain}}/gim, process.env.DEFAULT_DOMAIN);
    const mail = await transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.MAIL_USER,
        to: newUser.email,
        subject: 'Verify your OnePass account',
        text: text.replace(/{{verification}}/gim, `api/v1/auth/verify?email=${newUser.email}&verificationToken=${newUser.verificationToken}`),
        html: verifyEmailTemplate.replace(/{{verification}}/gim, `api/v1/auth/verify?email=${newUser.email}&verificationToken=${newUser.verificationToken}`),
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
        // generate some new token for other api
        return next();
    }
    return res.status(403).json({ error: 'Invalid email id or verification code'});
};