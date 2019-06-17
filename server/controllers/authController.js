const { createUser } = require('../db/user');

exports.signup = async (req, res) => {
    const { email, password } = req.body;
    if (password.length > 64) {
        return res.status(400).json({ error: "Maximum length of Master Password is 64 characters"});
    }
    if (email.length > 64) {
        return res.status(400).json({ error: "Maximum length of email id is 64 characters"});
    }
    /* ToDo: query db for existing sign up
             if verfied return error status
    */
    const newUser = await createUser({ email, password });
    res.json({ status: 'registered' });
    /* ToDo: send a verification token and link to email */
};