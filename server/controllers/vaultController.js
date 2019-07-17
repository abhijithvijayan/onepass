const { getEncKeySet, getVaultData, saveEncVaultItem } = require('../db/vault');

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

// ToDo: add or edit item
exports.addVaultItem = async (req, res) => {
    const { encDetails, encOverview, email, itemId } = req.body;
    const response = await saveEncVaultItem({ encDetails, encOverview, email, itemId });
    if (response.status) {
        const { status, item } = response;
        return res.status(200).json({ status, item });
    }
    return res.status(403).json({ status: response.status, error: 'Invalid Request' });
};
