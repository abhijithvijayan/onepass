const driver = require('./neo4j');

exports.createUser = ({ email, password }) => {
    return new Promise((resolve, reject) => {
        const session = driver.session();
        session
            .writeTransaction(tx =>
                tx.run(
                    'MERGE (u:Users { email : $emailParam }) SET u.password = $passwordParam, u.isVerified = $isVerifiedParam, u.createdAt= $createdAtParam  RETURN u', { emailParam: email, passwordParam: password, isVerifiedParam: false, createdAtParam: new Date().toJSON() }
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