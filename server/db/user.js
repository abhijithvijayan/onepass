const nanoid = require('nanoid');
const bcrypt = require('bcryptjs');

const driver = require('./neo4j');

exports.createUser = ({ email, password }) => {
    return new Promise(async (resolve, reject) => {
        const session = driver.session();
        const salt = await bcrypt.genSalt(13);
        const hash = await bcrypt.hash(password, salt);
        const verificationToken = nanoid(40);
        session
            .writeTransaction(tx =>
                tx.run(
                    'MERGE (u:Users { email : $emailParam }) SET u.password = $passwordParam, u.verificationToken = $verificationTokenParam, u.isVerified = $isVerifiedParam, u.createdAt= $createdAtParam  RETURN u', { emailParam: email, passwordParam: hash, verificationTokenParam: verificationToken, isVerifiedParam: false, createdAtParam: new Date().toJSON() }
                )
            )
            .then(function (res) {
                session.close();
                const user = res.records[0].get('u').properties;          
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
                    'MATCH (u:Users { email : $emailParam }) RETURN u', { emailParam: email }
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
                    'MATCH (u:Users { email: $emailParam, verificationToken: $verificationTokenParam }) SET u.isVerified = true, u.verificationToken = NULL RETURN u', { emailParam: email, verificationTokenParam: verificationToken }
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
                    'MATCH (u:Users { email: $emailParam }) SET u.passwordResetToken = $passwordResetTokenParam, u.passwordResetExpires = $passwordResetExpiresParam RETURN u', { emailParam: email, passwordResetTokenParam : passwordResetToken, passwordResetExpiresParam: passwordResetExpires }
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
                    'MATCH (u:Users) WHERE u.email = $emailParam AND u.passwordResetToken = $passwordResetTokenParam AND u.passwordResetExpires > $currentTime SET u.passwordResetToken = NULL, u.passwordResetExpires = NULL RETURN u', { emailParam: email, passwordResetTokenParam: passwordResetToken, currentTime: Date.now() }
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