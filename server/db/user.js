const nanoid = require('nanoid');
const generate = require('nanoid/generate');
const bcrypt = require('bcryptjs');

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
                'ON CREATE SET u.uid = uid, u.name = $nameParam, u.verificationToken = $verificationTokenParam, u.isVerified = $isVerifiedParam, u.createdAt = $createdAtParam ' +
                'ON MATCH SET id.count = id.count - 1, u.name = $nameParam, u.verificationToken = $verificationTokenParam, u.isVerified = $isVerifiedParam, u.createdAt = $createdAtParam ' +
                'RETURN u',
            {
                identifierParam: 'UserCounter',
                userFixedPrefixParam: `user_`,
                userRandomPrefixParam: `${userRandomPrefix}_`,
                emailParam: email,
                nameParam: name,
                verificationTokenParam: verificationToken,
                isVerifiedParam: false,
                createdAtParam: new Date().toJSON(),
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
            'MATCH (u:User { email: $emailParam, verificationToken: $verificationTokenParam }) ' +
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
    // eslint-disable-next-line no-console
    console.log(user);
    return user;
};
