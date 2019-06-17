const driver = require('./neo4j');
const nanoid = require('nanoid');

exports.createUser = ({ email, password }) => {
    return new Promise((resolve, reject) => {
        const session = driver.session();
        const verificationToken = nanoid(40);
        session
            .writeTransaction(tx =>
                tx.run(
                    'MERGE (u:Users { email : $emailParam }) SET u.password = $passwordParam, u.verificationToken = $verificationTokenParam, u.isVerified = $isVerifiedParam, u.createdAt= $createdAtParam  RETURN u', { emailParam: email, passwordParam: password, verificationTokenParam: verificationToken, isVerifiedParam: false, createdAtParam: new Date().toJSON() }
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

exports.verifyUser = ( { email, verificationToken }) => {
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