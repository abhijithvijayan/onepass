const generate = require('nanoid/generate');

const driver = require('./neo4j');

exports.createUser = async ({ email, name }) => {
    const session = driver.session();
    const verificationToken = generate('1234567890', 6);
    const userRandomPrefix = generate('1245689abefklprtvxz', 6);
    const { records = [] } = await session.writeTransaction(tx => {
        return tx.run(
            'MERGE (id:UniqueId { identifier: $identifierParam, userFixedPrefix: $userFixedPrefixParam }) ' +
                'ON CREATE SET id.count = 1, id.userRandomPrefix = $userRandomPrefixParam ' +
                'ON MATCH SET id.count = id.count + 1, id.userRandomPrefix = $userRandomPrefixParam ' +
                'WITH id.userFixedPrefix + id.userRandomPrefix + id.count AS uid, id ' +
                'MERGE (u:User { email : $emailParam }) ' +
                'ON CREATE SET u.userId = uid, u.hasDownloadedEmergencyKit = false, u.hasCompletedSignUp = false, u.versionCode = $versionCodeParam, u.name = $nameParam, u.verificationToken = $verificationTokenParam, u.isVerified = $isVerifiedParam, u.server = $serverParam, u._created = $_createdParam ' +
                'ON MATCH SET id.count = id.count - 1, u.pubKey = null, u.hasDownloadedEmergencyKit = false, u.hasCompletedSignUp = false, u.versionCode = $versionCodeParam, u.name = $nameParam, u.verificationToken = $verificationTokenParam, u.isVerified = $isVerifiedParam, u.server = $serverParam, u._created = $_createdParam ' +
                'RETURN u',
            {
                identifierParam: 'User_Counter',
                userFixedPrefixParam: `user_`,
                versionCodeParam: 'A1',
                userRandomPrefixParam: `${userRandomPrefix}_`,
                emailParam: email,
                nameParam: name,
                verificationTokenParam: verificationToken,
                isVerifiedParam: false,
                serverParam: process.env.DEFAULT_DOMAIN,
                _createdParam: new Date().toJSON(),
            }
        );
    });
    session.close();
    const user = records[0].get('u').properties;
    return user;
};

exports.getUserDetails = async ({ email }) => {
    const session = driver.session();
    const { records = [] } = await session.readTransaction(tx => {
        return tx.run('MATCH (u:User { email : $emailParam }) RETURN u', {
            emailParam: email,
        });
    });
    session.close();
    const user = records.length && records[0].get('u').properties;
    return user;
};

exports.verifyUser = async ({ email, verificationToken }) => {
    const session = driver.session();
    const { records = [] } = await session.writeTransaction(tx => {
        return tx.run(
            'MATCH (u:User { email: $emailParam, verificationToken: $verificationTokenParam, isVerified: false  }) ' +
                'SET u.isVerified = true, u.verificationToken = NULL ' +
                'RETURN u',
            {
                emailParam: email,
                verificationTokenParam: verificationToken,
            }
        );
    });
    session.close();
    const user = records.length && records[0].get('u').properties;
    return user;
};

exports.getEncKeySet = async ({ email }) => {
    const session = driver.session();
    const { records = [] } = await session.readTransaction(tx => {
        return tx.run(
            'MATCH (u: User { email: $emailParam, isVerified: true, hasCompletedSignUp: true })' +
                '-[:KEYSET]->(keySet) ' +
                'RETURN keySet',
            {
                emailParam: email,
            }
        );
    });
    session.close();
    if (records.length) {
        const { encPriKey, encSymKey } = records[0].get('keySet').properties;
        return { status: true, encPriKey: JSON.parse(encPriKey), encSymKey: JSON.parse(encSymKey) };
    }
    return { status: false, error: 'Account signup for this account was left incomplete. Please sign up again.' };
};

exports.genEmergencyKit = async ({ email }) => {
    const session = driver.session();
    const { records = [] } = await session.writeTransaction(tx => {
        return tx.run(
            'MATCH (u: User { email: $emailParam, isVerified: true }) ' +
                'SET u.hasDownloadedEmergencyKit = true ' +
                'RETURN u',
            {
                emailParam: email,
            }
        );
    });
    session.close();
    const { hasDownloadedEmergencyKit } = records.length && records[0].get('u').properties;
    if (hasDownloadedEmergencyKit) {
        return { status: true, message: 'Generate Emergency Kit Success' };
    }
    return { status: false, error: 'Account signup for this account was left incomplete. Please sign up again.' };
};

/* ------------------------------------------------------------- */
/*                   // ToDo: REFACTOR
/* ------------------------------------------------------------- */

exports.requestResetPassword = async ({ email }) => {
    const session = driver.session();
    const passwordResetToken = generate('1234567890', 6);
    const passwordResetExpires = Date.now() + 3600000;
    const { records = [] } = await session.writeTransaction(tx => {
        return tx.run(
            'MATCH (u:User { email: $emailParam }) ' +
                'SET u.passwordResetToken = $passwordResetTokenParam, u.passwordResetExpires = $passwordResetExpiresParam ' +
                'RETURN u',
            {
                emailParam: email,
                passwordResetTokenParam: passwordResetToken,
                passwordResetExpiresParam: passwordResetExpires,
            }
        );
    });
    session.close();
    const user = records.length && records[0].get('u').properties;
    return user;
};

exports.validatePasswordRequest = async ({ email, passwordResetToken }) => {
    const session = driver.session();
    const { records = [] } = await session.writeTransaction(tx => {
        return tx.run(
            'MATCH (u:User) ' +
                'WHERE u.email = $emailParam AND u.passwordResetToken = $passwordResetTokenParam AND u.passwordResetExpires > $currentTime ' +
                'SET u.passwordResetToken = NULL, u.passwordResetExpires = NULL ' +
                'RETURN u',
            {
                emailParam: email,
                passwordResetTokenParam: passwordResetToken,
                currentTime: Date.now(),
            }
        );
    });
    session.close();
    const user = records.length && records[0].get('u').properties;
    return user;
};
