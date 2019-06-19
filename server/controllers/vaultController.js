const {
    addPasswordEntry,
} = require('../db/vault');


// ToDo: Authenticate with JWT and get email to attach to DB
exports.createPasswordEntry = async (req, res) => {
    // temporary workaround for testing | id, email 
    // ToDo: Use jwt auth and get useremail and id
    const { id, email, sitename, username = '', password = '', url = '' } = req.body;
    const entry = await addPasswordEntry({ id, email, sitename, username, password, url });
    if (entry) {
        // success
        return res.status(200).json({ message: "Site successfully added to the vault." });
    }
    return res.status(400).json({ error: "Couldn't add a site. Try again." });
};