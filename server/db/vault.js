const generate = require('nanoid/generate');
const driver = require('./neo4j');

/** Save password item */
exports.saveEncVaultItem = async ({ encDetails, encOverview, email, itemId }) => {
    const session = driver.session();
    const passwordRandomPrefix = generate('1245689abefklprtvxz', 6);
    const { records = [] } = await session.writeTransaction(tx => {
        return tx.run(
            'MATCH (u: User { email: $emailParam, isVerified: true, hasCompletedSignUp: true, hasDownloadedEmergencyKit: true })' +
                '-[:VAULT]-(v: vault) ' +
                'MERGE (v)-[:PASSWORDS]->(pc: passwordCollection) ' +
                'ON CREATE SET pc.userId = v.userId, pc.lastItem = 1, pc.itemPrefix = $itemPrefixParam ' +
                'ON MATCH SET pc.lastItem = pc.lastItem + 1 ' +
                'WITH pc, pc.itemPrefix + $passwordRandomPrefixParam + pc.lastItem AS eid ' +
                'MERGE (p: password { passwordEntryId: $passwordEntryIdParam }) ' +
                'ON CREATE SET p.passwordEntryId = eid, p.encDetails = $encDetails, p.encOverview = $encOverview, p.createdAt = $timeParam, p.modifiedAt = $timeParam ' +
                'ON MATCH SET pc.lastItem = pc.lastItem - 1, p.encDetails = $encDetails, p.encOverview = $encOverview, p.modifiedAt = $timeParam ' +
                'MERGE (pc)-[a: Archive]->(p) ' +
                'RETURN p',
            {
                emailParam: email,
                itemPrefixParam: 'item_',
                passwordRandomPrefixParam: `${passwordRandomPrefix}_`,
                passwordEntryIdParam: itemId !== null ? itemId : '',
                encDetails: JSON.stringify(encDetails),
                encOverview: JSON.stringify(encOverview),
                timeParam: new Date().toJSON(),
            }
        );
    });
    session.close();
    const entry = records.length && records[0].get('p').properties;
    if (entry) {
        const { passwordEntryId, createdAt, modifiedAt } = entry;
        const item = {
            itemId: passwordEntryId,
            createdAt: new Date(createdAt).getTime(),
            modifiedAt: new Date(modifiedAt).getTime(),
            encDetails,
            encOverview,
        };
        const itemObj = Object.assign({}, { [passwordEntryId]: item });
        return { status: true, item: itemObj, msg: 'Item saved to vault.' };
    }
    return { status: false, error: 'Failed to save or update item.' };
};

/** Checks if password item exist already */
exports.getVaultItem = async ({ email, itemId }) => {
    const session = driver.session();
    const { records = [] } = await session.readTransaction(tx => {
        return tx.run(
            'MATCH (u: User { email: $emailParam, isVerified: true, hasCompletedSignUp: true, hasDownloadedEmergencyKit: true }) ' +
                'WITH u, u.userId AS uid ' +
                'MATCH (pc: passwordCollection { userId: uid })-[:Archive]->(p: password { passwordEntryId : $passwordEntryIdParam }) ' +
                'RETURN p',
            {
                emailParam: email,
                passwordEntryIdParam: itemId !== null ? itemId : '',
            }
        );
    });
    session.close();
    const entry = records.length && records[0].get('p').properties;
    if (entry) {
        const { passwordEntryId, createdAt, modifiedAt, encDetails, encOverview } = entry;
        const item = {
            itemId: passwordEntryId,
            createdAt: new Date(createdAt).getTime(),
            modifiedAt: new Date(modifiedAt).getTime(),
            encDetails: JSON.parse(encDetails),
            encOverview: JSON.parse(encOverview),
        };
        return { status: true, item, message: 'Item found.' };
    }
    return { status: false, error: "Item doesn't exist." };
};

/** Delete Password Item */
exports.deleteEncVaultItem = async ({ email, itemId }) => {
    const session = driver.session();
    const { records = [] } = await session.writeTransaction(tx => {
        return tx.run(
            'MATCH (u: User { email: $emailParam, isVerified: true, hasCompletedSignUp: true, hasDownloadedEmergencyKit: true }) ' +
                'WITH u, u.userId AS uid ' +
                'MATCH (pc: passwordCollection { userId: uid })-[:Archive]->(p: password { passwordEntryId : $passwordEntryIdParam }) ' +
                'WITH p, p.passwordEntryId AS pid, p.createdAt AS createdAt ' +
                'DETACH DELETE p ' +
                'RETURN pid, createdAt',
            {
                emailParam: email,
                passwordEntryIdParam: itemId,
            }
        );
    });
    session.close();
    const delEntryId = records.length && records[0].get('pid');
    if (delEntryId) {
        const delCreatedAt = records.length && records[0].get('createdAt');
        const item = { itemId: delEntryId, createdAt: delCreatedAt };
        return { status: true, item, msg: 'Item deleted from vault.' };
    }
    return { status: false, error: "Item doesn't exist or deletion failed" };
};

/** Add/Update Password Item */
exports.addOrUpdateFolder = async ({ email, folderName, folderId }) => {
    const session = driver.session();
    const folderRandomPrefix = generate('1245689abefklprtvxz', 6);
    const { records = [] } = await session.writeTransaction(tx => {
        return tx.run(
            'MATCH (u: User { email: $emailParam, isVerified: true, hasCompletedSignUp: true, hasDownloadedEmergencyKit: true })' +
                '-[:VAULT]-(v: vault) ' +
                'MERGE (v)-[:FOLDERS]->(fc: folderCollection) ' +
                'ON CREATE SET fc.userId = v.userId, fc.lastItem = 1, fc.folderPrefix = $folderPrefixParam ' +
                'ON MATCH SET fc.lastItem = fc.lastItem + 1 ' +
                'WITH fc, fc.folderPrefix + $folderRandomPrefixParam + fc.lastItem AS fid ' +
                'MERGE (f: folder { folderEntryId: $folderIdParam }) ' +
                'ON CREATE SET f.folderEntryId = fid, f.folderName = $folderNameParam, f.createdAt = $timeParam, f.modifiedAt = $timeParam ' +
                'ON MATCH SET fc.lastItem = fc.lastItem - 1, f.folderName = $folderNameParam, f.modifiedAt = $timeParam ' +
                'MERGE (fc)-[a: Archive]->(f) ' +
                'RETURN f',
            {
                emailParam: email,
                folderPrefixParam: 'folder_',
                folderIdParam: folderId !== null ? folderId : '',
                folderRandomPrefixParam: `${folderRandomPrefix}_`,
                folderNameParam: folderName !== null ? folderName : '',
                timeParam: new Date().toJSON(),
            }
        );
    });
    session.close();
    const folderEntry = records.length && records[0].get('f').properties;
    if (folderEntry) {
        const { folderEntryId, createdAt, modifiedAt } = folderEntry;
        const folder = {
            folderId: folderEntryId,
            folderName,
            createdAt: new Date(createdAt).getTime(),
            modifiedAt: new Date(modifiedAt).getTime(),
        };
        const folderObj = Object.assign({}, { [folderEntryId]: folder });
        return { status: true, folder: folderObj, msg: 'Folder created in vault.' };
    }
    return { status: false, error: 'Failed to add folder to vault' };
};

/** Check if folder already exist */
exports.getFolderEntry = async ({ email, folderId }) => {
    const session = driver.session();
    const { records = [] } = await session.readTransaction(tx => {
        return tx.run(
            'MATCH (u: User { email: $emailParam, isVerified: true, hasCompletedSignUp: true, hasDownloadedEmergencyKit: true }) ' +
                'WITH u, u.userId AS uid ' +
                'MATCH (fc: folderCollection { userId: uid })-[:Archive]->(f: folder { folderEntryId : $folderIdParam }) ' +
                'RETURN f',
            {
                emailParam: email,
                folderIdParam: folderId !== null ? folderId : '',
            }
        );
    });
    session.close();
    const folderEntry = records.length && records[0].get('f').properties;
    if (folderEntry) {
        const { folderEntryId, createdAt, modifiedAt } = folderEntry;
        const folder = {
            folderId: folderEntryId,
            createdAt: new Date(createdAt).getTime(),
            modifiedAt: new Date(modifiedAt).getTime(),
        };
        return { status: true, folder, message: 'Folder found.' };
    }
    return { status: false, error: "Folder doesn't exist." };
};

/** Fetch Vault Data */
exports.getVaultData = async ({ email }) => {
    const session = driver.session();
    const { records = [] } = await session.readTransaction(tx => {
        return tx.run(
            'MATCH (u: User { email: $emailParam, isVerified: true, hasCompletedSignUp: true })' +
                '-[:VAULT]->(v: vault) ' +
                'WITH v ' +
                'OPTIONAL MATCH (v)-[r]->()-[:Archive]->(a) ' +
                'RETURN v, r, a',
            {
                emailParam: email,
            }
        );
    });
    session.close();

    if (records.length) {
        let passwordCount = 0;
        let folderCount = 0;
        let passwordObjectList = {};
        let folderObjectList = {};
        const { encVaultKey } = records[0].get('v').properties;
        const encArchiveList = records.map(record => {
            const items = record._fields[2]
                ? {
                      ...record._fields[2].labels,
                      ...record._fields[2].properties,
                  }
                : null;
            if (items) {
                // Password
                if (items['0'] === 'password') {
                    passwordCount += 1;
                    return {
                        encOverview: Object.prototype.hasOwnProperty.call(items, 'encOverview')
                            ? JSON.parse(items.encOverview)
                            : '',
                        encDetails: Object.prototype.hasOwnProperty.call(items, 'encDetails')
                            ? JSON.parse(items.encDetails)
                            : '',
                        createdAt: Object.prototype.hasOwnProperty.call(items, 'createdAt')
                            ? new Date(items.createdAt).getTime()
                            : '',
                        modifiedAt: Object.prototype.hasOwnProperty.call(items, 'modifiedAt')
                            ? new Date(items.modifiedAt).getTime()
                            : '',
                        itemId: Object.prototype.hasOwnProperty.call(items, 'passwordEntryId')
                            ? items.passwordEntryId
                            : '',
                        type: items['0'],
                    };
                }
                // Folder
                if (items['0'] === 'folder') {
                    folderCount += 1;
                    return {
                        folderId: Object.prototype.hasOwnProperty.call(items, 'folderEntryId')
                            ? items.folderEntryId
                            : '',
                        createdAt: Object.prototype.hasOwnProperty.call(items, 'createdAt')
                            ? new Date(items.createdAt).getTime()
                            : '',
                        modifiedAt: Object.prototype.hasOwnProperty.call(items, 'modifiedAt')
                            ? new Date(items.modifiedAt).getTime()
                            : '',
                        folderName: Object.prototype.hasOwnProperty.call(items, 'folderName') ? items.folderName : '',
                        type: items['0'],
                    };
                }
            }
            return {};
        });
        if (passwordCount !== 0) {
            // Array to object
            passwordObjectList = Object.assign(
                {},
                ...encArchiveList.map(item => {
                    if (item.type === 'password') {
                        return { [item.itemId]: item };
                    }
                    return {};
                })
            );
        }
        if (folderCount !== 0) {
            // Array to object
            folderObjectList = Object.assign(
                {},
                ...encArchiveList.map(item => {
                    if (item.type === 'folder') {
                        return { [item.folderId]: item };
                    }
                    return {};
                })
            );
        }
        const encVaultData = {
            encVaultKey: JSON.parse(encVaultKey),
            passwordCount,
            folderCount,
            encArchiveList: {
                items: passwordObjectList,
                folders: folderObjectList,
            },
        };
        return { encVaultData, status: true };
    }
    return { status: false, error: 'Account signup for this account was left incomplete. Please sign up again.' };
};
