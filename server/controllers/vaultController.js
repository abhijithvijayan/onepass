const { getEncKeySet, getVaultData } = require('../db/vault');

exports.fetchEncKeys = async (req, res) => {
    const { email } = req.body;
    const encKeySet = await getEncKeySet({ email });
    if (encKeySet) {
        return res.status(200).json({ encKeySet });
    }
    return res.status(403).json({ error: 'Invalid Request' });
};

exports.fetchVaultData = async (req, res) => {
    const { email } = req.body;
    const encVaultData = await getVaultData({ email });
    if (encVaultData) {
        return res.status(200).json({ encVaultData });
    }
    return res.status(403).json({ error: 'Invalid Request' });
};
