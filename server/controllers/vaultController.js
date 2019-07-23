const { getEncKeySet, getVaultData, saveEncVaultItem, deleteEncVaultItem } = require('../db/vault');

exports.fetchEncKeys = async (req, res) => {
    const { email } = req.user;
    const response = await getEncKeySet({ email });
    if (response.status) {
        const { encPriKey, encSymKey } = response;
        return res.status(200).json({ encKeySet: { encPriKey, encSymKey } });
    }
    return res.status(403).json({ error: response.error });
};

exports.fetchVaultData = async (req, res) => {
    const { email } = req.user;
    const response = await getVaultData({ email });
    if (response.status) {
        return res.status(200).json({ encVaultData: response.encVaultData });
    }
    return res.status(403).json({ error: response.error });
};

exports.addOrUpdateVaultItem = async (req, res) => {
    const { encDetails, encOverview, itemId } = req.body;
    const { email } = req.user;
    // ToDo: validate item(details and overview content)
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
