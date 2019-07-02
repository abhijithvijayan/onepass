const driver = require('./neo4j');

exports.saveVerifier = async ({ verifier, salt, email, userId }) => {
    const session = driver.session();
    const { records = [] } = await session.writeTransaction(tx => {
        return tx.run(
            'MATCH (u: User { email: $emailParam, accountId : $accountIdParam, isVerified: true }) ' +
                'MERGE (a: auth { accountId : $accountIdParam })<-[:SRP]-(u) ' +
                'ON CREATE SET a.createdAt = $createdAtParam, a.verifier = $verifierParam, a.salt = $saltParam ' +
                'ON MATCH SET a.updatedAt = $updatedAtParam, a.verifier = $verifierParam, a.salt = $saltParam ' +
                'RETURN a',
            {
                emailParam: email,
                accountIdParam: userId,
                createdAtParam: new Date().toJSON(),
                updatedAtParam: new Date().toJSON(),
                verifierParam: verifier,
                saltParam: salt,
            }
        );
    });
    session.close();
    const userAuth = records.length && records[0].get('a').properties;
    return userAuth;
};

exports.retrieveSRPVerifier = async ({ email }) => {
    const session = driver.session();
    const { records = [] } = await session.readTransaction(tx => {
        return tx.run('MATCH (u: User { email: $emailParam, isVerified: true })-->(auth) RETURN auth', {
            emailParam: email,
        });
    });
    session.close();
    const { salt, verifier, accountId } = records.length && records[0].get('auth').properties;
    return { salt, verifier, accountId };
};

exports.saveServerEphemeral = async ({ serverSecretEphemeral, email }) => {
    const session = driver.session();
    await session.writeTransaction(tx => {
        return tx.run(
            'MATCH (u: User { email: $emailParam, isVerified: true })-->(auth) ' +
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
        return tx.run('MATCH (u: User { email: $emailParam, isVerified: true })-->(auth) RETURN auth', {
            emailParam: email,
        });
    });
    session.close();
    const { salt, verifier, accountId, serverSecretEphemeral } = records.length && records[0].get('auth').properties;
    return { salt, verifier, accountId, serverSecretEphemeral };
};
