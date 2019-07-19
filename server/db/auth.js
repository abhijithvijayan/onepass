const driver = require('./neo4j');

/**
 * SIGNUP Functions
 */

exports.saveAccountCredentials = async ({ verifier, salt, email, userId, encryptionKeys }) => {
    const { pubKey = '', encPriKey = '', encSymKey = '', encVaultKey = '' } = encryptionKeys;
    const session = driver.session();
    const { records = [] } = await session.writeTransaction(tx => {
        return tx.run(
            'MATCH (u: User { email: $emailParam, userId : $userIdParam, isVerified: true }) ' +
                'MERGE (a: auth { userId : $userIdParam })<-[:SRP]-(u) ' +
                'SET u.hasCompletedSignUp = true, u.pubKey = $pubKeyParam, a.createdAt = $createdAtParam, a.verifier = $verifierParam, a.salt = $saltParam ' +
                'MERGE (v: vault { userId : $userIdParam })<-[:VAULT]-(u) ' +
                'SET v.encVaultKey = $encVaultKeyParam, v.createdAt = $createdAtParam ' +
                'MERGE (k: keySet { userId : $userIdParam })<-[:KEYSET]-(u) ' +
                'SET k.encPriKey = $encPriKeyParam, k.encSymKey = $encSymKeyParam, k.createdAt = $createdAtParam ' +
                'RETURN a',
            {
                emailParam: email,
                userIdParam: userId,
                pubKeyParam: JSON.stringify(pubKey),
                encPriKeyParam: JSON.stringify(encPriKey),
                encSymKeyParam: JSON.stringify(encSymKey),
                encVaultKeyParam: JSON.stringify(encVaultKey),
                createdAtParam: new Date().toJSON(),
                verifierParam: verifier,
                saltParam: salt,
            }
        );
    });
    session.close();
    const user = records.length && records[0].get('a').properties;
    if (user) {
        return { status: true, user };
    }
    return { status: false };
};

/**
 * LOGIN Functions
 */

exports.retrieveSRPVerifier = async ({ email }) => {
    const session = driver.session();
    const { records = [] } = await session.readTransaction(tx => {
        return tx.run('MATCH (u: User { email: $emailParam, isVerified: true })-[:SRP]->(auth) RETURN auth', {
            emailParam: email,
        });
    });
    session.close();
    const { salt, verifier, userId } = records.length && records[0].get('auth').properties;
    return { salt, verifier, userId };
};

exports.saveServerEphemeral = async ({ serverSecretEphemeral, email }) => {
    const session = driver.session();
    await session.writeTransaction(tx => {
        return tx.run(
            'MATCH (u: User { email: $emailParam, isVerified: true })-[:SRP]->(auth) ' +
                'SET auth.serverSecretEphemeral = $serverSecretEphemeralParam ' +
                'RETURN auth',
            {
                emailParam: email,
                serverSecretEphemeralParam: serverSecretEphemeral,
            }
        );
    });
    session.close();
};

exports.retrieveSRPCredentials = async ({ email }) => {
    const session = driver.session();
    const { records = [] } = await session.readTransaction(tx => {
        return tx.run('MATCH (u: User { email: $emailParam, isVerified: true })-[:SRP]->(auth) RETURN auth, u', {
            emailParam: email,
        });
    });
    session.close();
    const { salt, verifier, userId, serverSecretEphemeral } = records.length && records[0].get('auth').properties;
    const { name, hasDownloadedEmergencyKit, server } = records.length && records[0].get('u').properties;
    const user = { userId, name, email, hasDownloadedEmergencyKit, server };
    return { salt, verifier, user, serverSecretEphemeral };
};
