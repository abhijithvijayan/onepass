const {
    getVaultData,
    saveEncVaultItem,
    deleteEncVaultItem,
    getVaultItem,
    addOrUpdateFolder,
    getFolderEntry,
} = require('../db/vault');

exports.fetchVaultData = async (req, res) => {
    const { email } = req.user;
    const response = await getVaultData({ email });
    if (response.status) {
        return res.status(200).json({
            encVaultData: response.encVaultData,
            _reported: new Date().getTime(),
        });
    }
    return res.status(403).json({
        error: {
            msg: response.error,
            _reported: new Date().getTime(),
        },
        id: 'vault',
    });
};

exports.addOrUpdateVaultItem = async (req, res) => {
    const { encDetails, encOverview, itemId, _modified } = req.body;
    const { email } = req.user;
    const unitItem = await getVaultItem({ email, itemId });
    // Item exists
    if (unitItem.status && _modified) {
        // Check if item to be modified is synced to the recent in local vault
        const receivedItemModified = new Date(_modified).getTime();
        const existingItemModified = new Date(unitItem.item._modified).getTime();
        if (receivedItemModified !== existingItemModified) {
            return res.status(403).json({
                status: false,
                error: {
                    msg:
                        'Failed to save item. You have an outdated version of vault. Try making changes again after refreshing the vault.',
                    _reported: new Date().getTime(),
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
            _reported: new Date().getTime(),
        });
    }
    return res.status(403).json({
        status: response.status,
        error: {
            msg: response.error,
            _reported: new Date().getTime(),
        },
    });
};

exports.deleteVaultItem = async (req, res) => {
    const { itemId } = req.body;
    const { email } = req.user;
    const response = await deleteEncVaultItem({ email, itemId });
    if (response.status) {
        const { status, item, msg } = response;
        return res.status(200).json({
            status,
            item,
            msg,
            _reported: new Date().getTime(),
        });
    }
    return res.status(403).json({
        status: response.status,
        error: {
            msg: response.error,
            _reported: new Date().getTime(),
        },
    });
};

exports.addOrUpdateFolder = async (req, res) => {
    const { folderName, folderId, _modified } = req.body;
    const { email } = req.user;
    const unitFolder = await getFolderEntry({ email, folderId });
    // Folder already exist
    if (unitFolder.status && _modified) {
        // Check if folder to be modified is synced to the recent in local vault
        const receivedFolderModified = new Date(_modified).getTime();
        const existingFolderModified = new Date(unitFolder.folder._modified).getTime();
        if (receivedFolderModified !== existingFolderModified) {
            return res.status(403).json({
                status: false,
                error: {
                    msg:
                        'Failed to update folder. You have an outdated version of vault. Try making changes again after refreshing the vault.',
                    _reported: new Date().getTime(),
                },
            });
        }
    }
    const response = await addOrUpdateFolder({ email, folderName, folderId });
    if (response.status) {
        let msg;
        const { status, folder } = response;
        // New folder created
        ({ msg } = response);
        // Folder already exists
        if (unitFolder.status) {
            msg = 'Folder updated.';
        }
        return res.status(200).json({
            folder,
            status,
            msg,
            _reported: new Date().getTime(),
        });
    }
    return res.status(403).json({
        status: response.status,
        error: {
            msg: response.error,
            _reported: new Date().getTime(),
        },
    });
};
