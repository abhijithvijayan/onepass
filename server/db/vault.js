const generate = require('nanoid/generate');
const driver = require('./neo4j');

exports.getVaultData = async ({ email }) => {
    const session = driver.session();
    const { records = [] } = await session.readTransaction(tx => {
        return tx.run(
            'MATCH (u: User { email: $emailParam, isVerified: true, hasCompletedSignUp: true })' +
                '-[:VAULT]->(v: vault) ' +
                'WITH v ' +
                'OPTIONAL MATCH path = (v)-[:PASSWORDS]->()-[:Archive]->() ' +
                'RETURN v, path',
            {
                emailParam: email,
            }
        );
    });
    session.close();

    if (records.length) {
        let itemsCount = 0;
        let encArchiveObjectList = {};
        const { encVaultKey } = records[0].get('v').properties;
        const encArchiveList = records.map(record => {
            const item = record._fields[1]
                ? {
                      ...record._fields[1].end.properties,
                  }
                : null;
            if (item) {
                itemsCount += 1;
                return {
                    encOverview: Object.prototype.hasOwnProperty.call(item, 'encOverview')
                        ? JSON.parse(item.encOverview)
                        : '',
                    encDetails: Object.prototype.hasOwnProperty.call(item, 'encDetails')
                        ? JSON.parse(item.encDetails)
                        : '',
                    createdAt: Object.prototype.hasOwnProperty.call(item, 'createdAt')
                        ? new Date(item.createdAt).getTime()
                        : '',
                    modifiedAt: Object.prototype.hasOwnProperty.call(item, 'modifiedAt')
                        ? new Date(item.modifiedAt).getTime()
                        : '',
                    itemId: Object.prototype.hasOwnProperty.call(item, 'entryId') ? item.entryId : '',
                };
            }
            return {};
        });
        if (itemsCount !== 0) {
            // Array to object
            encArchiveObjectList = Object.assign(
                {},
                ...encArchiveList.map(item => {
                    return { [item.itemId]: item };
                })
            );
        }
        const encVaultData = {
            encVaultKey: JSON.parse(encVaultKey),
            itemsCount,
            encArchiveList: encArchiveObjectList,
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
            'MATCH (u: User { email: $emailParam, isVerified: true, hasCompletedSignUp: true })-[:VAULT]-(v: vault) ' +
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
    const { records = [] } = await session.writeTransaction(tx => {
        return tx.run(
            'MATCH (u: User { email: $emailParam, isVerified: true, hasCompletedSignUp: true }) ' +
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
            'MATCH (u: User { email: $emailParam, isVerified: true, hasCompletedSignUp: true }) ' +
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
        return { status: true, item, message: 'Item deleted from vault.' };
    }
    return { status: false, error: "Item doesn't exist or deletion failed" };
};
