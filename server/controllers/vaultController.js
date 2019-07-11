const { getEncKeySet, getVaultData } = require('../db/vault');

exports.fetchEncKeys = async (req, res) => {
    const { email } = req.body;
    const keySet = await getEncKeySet({ email });
    if (keySet) {
        return res.status(200).json({ keySet });
    }
    return res.status(403).json({ error: 'Invalid Request' });
};

exports.fetchVaultData = async (req, res) => {
    const { email } = req.body;
    const vaultData = await getVaultData({ email });
    if (vaultData) {
        return res.status(200).json({ vaultData });
    }
    return res.status(403).json({ error: 'Invalid Request' });
};
