const driver = require('./neo4j');

exports.addPasswordEntry = ({ email, sitename, username, password, url }) => {
    return new Promise((resolve, reject) => {
        const session = driver.session();
        // ToDo: encrypt username and password with node-forge
        session
            .writeTransaction(tx => 
                // ToDo: Refactor
                // Current: find password collection with email and inject into it
                tx.run(
                    'MATCH (p: PasswordCollection { email: $emailParam }) CREATE (e: PasswordEntry { sitename: $sitenameParam, username: $usernameParam, password: $passwordParam, url: $urlParam, createdAt: $createdAtParam }) CREATE (p)-[:ARCHIVE]->(e) RETURN e',
                    {
                        emailParam: email,
                        sitenameParam: sitename,
                        usernameParam: username,
                        passwordParam: password,
                        urlParam: url,
                        createdAtParam: new Date().toJSON(),
                    }
                )
            )
            .then(function (res) {
                session.close();
                const entry = res.records[0].get('e').properties;          
                return resolve(entry);
            })
            .catch(err => reject(err));
    })
};