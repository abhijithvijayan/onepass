const nanoid = require('nanoid');
const bcrypt = require('bcryptjs');

const driver = require('./neo4j');

exports.createUser = ({ email, password }) => {
    return new Promise(async (resolve, reject) => {
        const session = driver.session();
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);
        const verificationToken = nanoid(40);
        session
            .writeTransaction(tx =>
                tx.run(
                    'MERGE (id:UniqueId { identifier: $identifierParam, userPrefix: $userPrefixParam }) ' + 
                    'ON CREATE SET id.count = 1 ' +
                    'ON MATCH SET id.count = id.count + 1 ' +
                    'WITH id.userPrefix + id.count AS uid, id ' +  
                    'MERGE (u:User { email : $emailParam }) ' +
                    'ON CREATE SET u.uid = uid, u.password = $passwordParam, u.verificationToken = $verificationTokenParam, u.isVerified = $isVerifiedParam, u.createdAt = $createdAtParam ' + 
                    'ON MATCH SET id.count = id.count - 1, u.password = $passwordParam, u.verificationToken = $verificationTokenParam, u.isVerified = $isVerifiedParam, u.createdAt = $createdAtParam ' + 
                    'RETURN u',
                    { 
                        identifierParam: 'UserCounter',
                        userPrefixParam: 'user_',
                        emailParam: email, 
                        passwordParam: passwordHash, 
                        verificationTokenParam: verificationToken, 
                        isVerifiedParam: false, 
                        createdAtParam: new Date().toJSON() 
                    }
                )
            )
            .then(function (res) {
                session.close();
                const user = res.records.length && res.records[0].get('u').properties;                                   
                // console.log(user);
                return resolve(user);
            })
            .catch(err => reject(err));
    })
};

exports.getUserDetails = ({ email }) => {
    return new Promise((resolve, reject) => {
        const session = driver.session();
        session
            .readTransaction(tx => 
                tx.run(
                    'MATCH (u:User { email : $emailParam }) ' + 
                    'RETURN u', 
                    { 
                        emailParam: email 
                    }
                )    
            )
            .then(function (res) {
                session.close();
                const user = res.records.length && res.records[0].get('u').properties;
                return resolve(user);
            })
            .catch(err => reject(err));
    })
};

exports.verifyUser = ({ email, verificationToken }) => {
    return new Promise((resolve, reject) => {
        const session = driver.session();
        session
            .writeTransaction(tx => 
                tx.run(
                    'MATCH (u:User { email: $emailParam, verificationToken: $verificationTokenParam }) ' + 
                    'SET u.isVerified = true, u.verificationToken = NULL ' + 
                    'RETURN u', 
                    { 
                        emailParam: email, 
                        verificationTokenParam: verificationToken 
                    }
                )
            )
            .then(function (res) {
                session.close();
                const user = res.records.length && res.records[0].get('u').properties;
                return resolve(user);
            })
            .catch(err => reject(err));
    })
};

exports.requestResetPassword = ({ email }) => {
    return new Promise((resolve, reject) => {
        const session = driver.session();
        const passwordResetToken = nanoid(40);
        const passwordResetExpires = Date.now() + 3600000;
        session
            .writeTransaction(tx =>
                tx.run(
                    'MATCH (u:User { email: $emailParam }) ' +
                    'SET u.passwordResetToken = $passwordResetTokenParam, u.passwordResetExpires = $passwordResetExpiresParam ' + 
                    'RETURN u', 
                    { 
                        emailParam: email, 
                        passwordResetTokenParam : passwordResetToken,
                         passwordResetExpiresParam: passwordResetExpires
                    }
                )    
            )
            .then(function (res) {
                session.close();
                const user = res.records.length && res.records[0].get('u').properties;
                return resolve(user);
            })
            .catch(err => reject(err));
    })
};

exports.validatePasswordRequest = ({ email, passwordResetToken }) => {
    return new Promise((resolve, reject) => {
        const session = driver.session();
        session
            .writeTransaction(tx =>
                tx.run(
                    'MATCH (u:User) ' +
                    'WHERE u.email = $emailParam AND u.passwordResetToken = $passwordResetTokenParam AND u.passwordResetExpires > $currentTime ' +
                    'SET u.passwordResetToken = NULL, u.passwordResetExpires = NULL ' +
                    'RETURN u', 
                    { 
                        emailParam: email, 
                        passwordResetTokenParam: passwordResetToken, 
                        currentTime: Date.now() 
                    }
                )
            )
            .then(function (res) {
                session.close();
                const user = res.records.length && res.records[0].get('u').properties;
                console.log(user);
                return resolve(user);
            })
            .catch(err => reject(err));
    })
};