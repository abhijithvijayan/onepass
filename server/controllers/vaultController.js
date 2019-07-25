const { getVaultData, saveEncVaultItem, deleteEncVaultItem, getVaultItem } = require('../db/vault');

exports.fetchVaultData = async (req, res) => {
    const { email } = req.user;
    const response = await getVaultData({ email });
    if (response.status) {
        return res.status(200).json({
            encVaultData: response.encVaultData,
            reportedAt: new Date().getTime(),
        });
    }
    return res.status(403).json({
        error: {
            msg: response.error,
            reportedAt: new Date().getTime(),
        },
        id: 'vault',
    });
};

exports.addOrUpdateVaultItem = async (req, res) => {
    const { encDetails, encOverview, itemId, modifiedAt } = req.body;
    const { email } = req.user;
    const unitItem = await getVaultItem({ email, itemId });
    // Item exists
    if (unitItem.status && modifiedAt) {
        // Check if item to be modified is synced to the recent in local vault
        const receivedItemModifiedAt = new Date(modifiedAt).getTime();
        const existingItemModifiedAt = new Date(unitItem.item.modifiedAt).getTime();
        if (receivedItemModifiedAt !== existingItemModifiedAt) {
            return res.status(403).json({
                status: false,
                error: {
                    msg:
                        'Failed to save item. You have an outdated version of vault. Try making changes again after refreshing the vault.',
                    reportedAt: new Date().getTime(),
                },
            });
        }
    }
    const response = await saveEncVaultItem({ encDetails, encOverview, email, itemId });
    if (response.status) {
        let msg;
        const { status, item } = response;
        // New item created
        ({ msg } = response);
        // Item already exists
        if (unitItem.status) {
            msg = 'Item updated.';
        }
        return res.status(200).json({
            item,
            status,
            msg,
            reportedAt: new Date().getTime(),
        });
    }
    return res.status(403).json({
        status: response.status,
        error: {
            msg: response.error,
            reportedAt: new Date().getTime(),
        },
    });
};

exports.deleteVaultItem = async (req, res) => {
    const { itemId } = req.body;
    const { email } = req.user;
    const response = await deleteEncVaultItem({ email, itemId });
    if (response.status) {
        const { status, item, message } = response;
        return res.status(200).json({
            status,
            item,
            message,
            reportedAt: new Date().getTime(),
        });
    }
    return res.status(403).json({
        status: response.status,
        error: {
            msg: response.error,
            reportedAt: new Date().getTime(),
        },
    });
};
