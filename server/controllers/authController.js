const { createUser, getUserDetails } = require('../db/user');

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
    return res.status(200).json({ status: 'Registered successfully', verified: newUser.isVerified });
    /* ToDo: send a verification token and link to email */
};