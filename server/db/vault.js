const forge = require('node-forge');
const driver = require('./neo4j');

exports.addPasswordEntry = ({ email, sitename, username, password, url }) => {
    return new Promise((resolve, reject) => {
        const session = driver.session();
        const iv = forge.random.getBytesSync(16);
        const salt = forge.random.getBytesSync(128);
        // ToDo: encrypt with masterpassword (username and password)
        const key = forge.pkcs5.pbkdf2('masterpassword', salt, 4, 32);
        const cipher = forge.cipher.createCipher('AES-CBC', key);
        cipher.start({iv: iv});
        cipher.update(forge.util.createBuffer(password));
        cipher.finish();
        session
            .writeTransaction(tx => 
                // ToDo: Refactor
                // Current: find password collection with email and inject into it
                tx.run(
                    'MATCH (p: PasswordCollection { email: $emailParam }) CREATE (e: PasswordEntry { sitename: $sitenameParam, username: $usernameParam, password: $passwordParam, salt: $saltParam, iv: $ivParam, url: $urlParam, createdAt: $createdAtParam }) CREATE (p)-[:ARCHIVE]->(e) RETURN e',
                    {
                        emailParam: email,
                        sitenameParam: sitename,
                        usernameParam: username,
                        urlParam: url,
                        createdAtParam: new Date().toJSON(),
                        passwordParam: forge.util.encode64(cipher.output.getBytes()),
                        saltParam: forge.util.encode64(salt),
                        ivParam: forge.util.encode64(iv)
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