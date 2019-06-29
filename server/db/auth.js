const driver = require('./neo4j');

exports.saveVerifier = async ({ email, verifier, salt, userId }) => {
    const session = driver.session();
    const { records = [] } = await session.writeTransaction(tx => {
        return tx.run(
            'MATCH (u: User { email: $emailParam, isVerified: true }) ' +
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
