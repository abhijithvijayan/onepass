const { getEncKeySet, getVaultData, saveEncVaultItem, deleteEncVaultItem } = require('../db/vault');

exports.fetchEncKeys = async (req, res) => {
    const { email } = req.query;
    const encKeySet = await getEncKeySet({ email });
    if (encKeySet) {
        return res.status(200).json({ encKeySet });
    }
    return res.status(403).json({ error: 'Invalid Request' });
};

exports.fetchVaultData = async (req, res) => {
    const { email } = req.query;
    const encVaultData = await getVaultData({ email });
    if (encVaultData) {
        return res.status(200).json({ encVaultData });
    }
    return res.status(403).json({ error: 'Invalid Request' });
};

exports.addOrUpdateVaultItem = async (req, res) => {
    const { encDetails, encOverview, email, itemId } = req.body;
    const response = await saveEncVaultItem({ encDetails, encOverview, email, itemId });
    if (response.status) {
        const { status, item, message } = response;
        return res.status(200).json({ status, item, message });
    }
    return res.status(403).json({ status: response.status, error: response.error });
};

exports.deleteVaultItem = async (req, res) => {
    const { email, itemId } = req.body;
    const response = await deleteEncVaultItem({ email, itemId });
    if (response.status) {
        const { status, item, message } = response;
        return res.status(200).json({ status, item, message });
    }
    return res.status(403).json({ status: response.status, error: response.error });
};
