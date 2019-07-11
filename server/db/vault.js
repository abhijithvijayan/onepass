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
    const { userId } = records.length && records[0].get('keySet').properties;
    return { userId };
};

exports.getVaultData = async ({ email }) => {
    const session = driver.session();
    const { records = [] } = await session.readTransaction(tx => {
        return tx.run('MATCH (u: User { email: $emailParam, isVerified: true })-[:VAULT]->(vault) RETURN vault', {
            emailParam: email,
        });
    });
    session.close();
    const { userId } = records.length && records[0].get('vault').properties;
    return { userId };
};
