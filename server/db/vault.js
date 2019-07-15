const forge = require('node-forge');

const driver = require('./neo4j');

exports.getEncKeySet = async ({ email }) => {
    const session = driver.session();
    const { records = [] } = await session.readTransaction(tx => {
        return tx.run('MATCH (u: User { email: $emailParam, isVerified: true })-[:KEYSET]->(keySet) RETURN keySet', {
            emailParam: email,
        });
    });
    session.close();
    const { encPriKey, encSymKey } = records.length && records[0].get('keySet').properties;
    return { encPriKey: JSON.parse(encPriKey), encSymKey: JSON.parse(encSymKey) };
};

exports.getVaultData = async ({ email }) => {
    const session = driver.session();
    const { records = [] } = await session.readTransaction(tx => {
        return tx.run('MATCH (u: User { email: $emailParam, isVerified: true })-[:VAULT]->(vault) RETURN vault', {
            emailParam: email,
        });
    });
    session.close();
    const { encVaultKey } = records.length && records[0].get('vault').properties;
    return { encVaultKey: JSON.parse(encVaultKey) };
};

exports.saveEncVaultItem = async ({ encDetails, encOverview, email }) => {
    const session = driver.session();
    const { records = [] } = await session.writeTransaction(tx => {
        return tx.run(
            'MATCH (u: User { email: $emailParam, isVerified: true })-[:VAULT]-(v: vault) ' +
                'MERGE (v)-[:PASSWORDS]->(p: passwordCollection) ' +
                'ON CREATE SET p.userId = v.userId, p.lastItem = 1, p.itemPrefix = $itemPrefixParam ' +
                'ON MATCH SET p.lastItem = p.lastItem + 1 ' +
                'WITH p.itemPrefix + p.lastItem AS eid, p ' +
                'CREATE (e: entry { entryId: eid, encDetails: $encDetails, encOverview: $encOverview, createdAt: $createdAtParam }) ' +
                'CREATE (p)-[a:Archive { entryId: eid }]->(e) ' +
                'RETURN e',
            {
                emailParam: email,
                itemPrefixParam: 'item_',
                encDetails: JSON.stringify(encDetails),
                encOverview: JSON.stringify(encOverview),
                createdAtParam: new Date().toJSON(),
            }
        );
    });
    session.close();
    const entry = records.length && records[0].get('e').properties;
    // Parse if needed
    if (entry) {
        return { status: true };
    }
    return { status: false };
};
