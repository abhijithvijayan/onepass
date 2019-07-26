const generate = require('nanoid/generate');
const driver = require('./neo4j');

exports.getVaultData = async ({ email }) => {
    const session = driver.session();
    const { records = [] } = await session.readTransaction(tx => {
        return tx.run(
            'MATCH (u: User { email: $emailParam, isVerified: true, hasCompletedSignUp: true })' +
                '-[:VAULT]->(v: vault) ' +
                'WITH v ' +
                'OPTIONAL MATCH fRoute = (v)-[r]->()-[:Archive]->(a) ' +
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
                if (items['0'] === 'entry') {
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
                        itemId: Object.prototype.hasOwnProperty.call(items, 'entryId') ? items.entryId : '',
                        type: 'password',
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
                        type: 'folder',
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

exports.saveEncVaultItem = async ({ encDetails, encOverview, email, itemId }) => {
    const session = driver.session();
    const vaultItemRandomPrefix = generate('1245689abefklprtvxz', 6);
    const { records = [] } = await session.writeTransaction(tx => {
        return tx.run(
            'MATCH (u: User { email: $emailParam, isVerified: true, hasCompletedSignUp: true, hasDownloadedEmergencyKit: true })' +
                '-[:VAULT]-(v: vault) ' +
                'MERGE (v)-[:PASSWORDS]->(p: passwordCollection) ' +
                'ON CREATE SET p.userId = v.userId, p.lastItem = 1, p.itemPrefix = $itemPrefixParam ' +
                'ON MATCH SET p.lastItem = p.lastItem + 1 ' +
                'WITH p.itemPrefix + $vaultItemRandomPrefixParam + p.lastItem AS eid, p ' +
                'MERGE (e: entry { entryId: $entryIdParam }) ' +
                'ON CREATE SET e.entryId = eid, e.encDetails = $encDetails, e.encOverview = $encOverview, e.createdAt = $timeParam, e.modifiedAt = $timeParam ' +
                'ON MATCH SET p.lastItem = p.lastItem - 1, e.encDetails = $encDetails, e.encOverview = $encOverview, e.modifiedAt = $timeParam ' +
                'MERGE (p)-[a: Archive]->(e) ' +
                'RETURN e',
            {
                emailParam: email,
                itemPrefixParam: 'item_',
                vaultItemRandomPrefixParam: `${vaultItemRandomPrefix}_`,
                entryIdParam: itemId !== null ? itemId : '',
                encDetails: JSON.stringify(encDetails),
                encOverview: JSON.stringify(encOverview),
                timeParam: new Date().toJSON(),
            }
        );
    });
    session.close();
    const entry = records.length && records[0].get('e').properties;
    if (entry) {
        const { entryId, createdAt, modifiedAt } = entry;
        const item = {
            itemId: entryId,
            createdAt: new Date(createdAt).getTime(),
            modifiedAt: new Date(modifiedAt).getTime(),
            encDetails,
            encOverview,
        };
        const itemObj = Object.assign({}, { [entryId]: item });
        return { status: true, item: itemObj, msg: 'Item saved to vault.' };
    }
    return { status: false, error: 'Failed to save or update item.' };
};

exports.getVaultItem = async ({ email, itemId }) => {
    const session = driver.session();
    const { records = [] } = await session.readTransaction(tx => {
        return tx.run(
            'MATCH (u: User { email: $emailParam, isVerified: true, hasCompletedSignUp: true, hasDownloadedEmergencyKit: true }) ' +
                'WITH u, u.userId AS uid ' +
                'MATCH (p: passwordCollection { userId: uid })-[:Archive]->(e: entry { entryId : $itemIdParam }) ' +
                'RETURN e',
            {
                emailParam: email,
                itemIdParam: itemId !== null ? itemId : '',
            }
        );
    });
    session.close();
    const entry = records.length && records[0].get('e').properties;
    if (entry) {
        const { entryId, createdAt, modifiedAt, encDetails, encOverview } = entry;
        const item = {
            itemId: entryId,
            createdAt: new Date(createdAt).getTime(),
            modifiedAt: new Date(modifiedAt).getTime(),
            encDetails: JSON.parse(encDetails),
            encOverview: JSON.parse(encOverview),
        };
        return { status: true, item, message: 'Item found.' };
    }
    return { status: false, error: "Item doesn't exist." };
};

exports.deleteEncVaultItem = async ({ email, itemId }) => {
    const session = driver.session();
    const { records = [] } = await session.writeTransaction(tx => {
        return tx.run(
            'MATCH (u: User { email: $emailParam, isVerified: true, hasCompletedSignUp: true, hasDownloadedEmergencyKit: true }) ' +
                'WITH u, u.userId AS uid ' +
                'MATCH (p: passwordCollection { userId: uid })-[:Archive]->(e: entry { entryId : $itemIdParam }) ' +
                'WITH e, e.entryId AS eid, e.createdAt AS createdAt ' +
                'DETACH DELETE e ' +
                'RETURN eid, createdAt',
            {
                emailParam: email,
                itemIdParam: itemId,
            }
        );
    });
    session.close();
    const delEntryId = records.length && records[0].get('eid');
    if (delEntryId) {
        const delCreatedAt = records.length && records[0].get('createdAt');
        const item = { itemId: delEntryId, createdAt: delCreatedAt };
        return { status: true, item, msg: 'Item deleted from vault.' };
    }
    return { status: false, error: "Item doesn't exist or deletion failed" };
};

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
                'WITH fc.folderPrefix + $folderRandomPrefixParam + fc.lastItem AS fid, fc ' +
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
