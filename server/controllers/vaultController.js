const { getVaultData, saveEncVaultItem, deleteEncVaultItem } = require('../db/vault');

exports.fetchVaultData = async (req, res) => {
    const { email } = req.user;
    const response = await getVaultData({ email });
    if (response.status) {
        return res.status(200).json({ encVaultData: response.encVaultData });
    }
    return res.status(403).json({ error: response.error, id: 'vault' });
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
    const { itemId } = req.body;
    const { email } = req.user;
    const response = await deleteEncVaultItem({ email, itemId });
    if (response.status) {
        const { status, item, message } = response;
        return res.status(200).json({ status, item, message });
    }
    return res.status(403).json({ status: response.status, error: response.error });
};
