const forge = require('node-forge');

const driver = require('./neo4j');

const encryptString = (username, password) => {
    const iv = forge.random.getBytesSync(16);
    const salt = forge.random.getBytesSync(128);
    // ToDo: encrypt with masterpassword
    const key = forge.pkcs5.pbkdf2('masterpasswordhash', salt, 4, 32);
    const passwordCipher = forge.cipher.createCipher('AES-CBC', key);
    passwordCipher.start({iv: iv});
    passwordCipher.update(forge.util.createBuffer(password));
    passwordCipher.finish();
    const usernameCipher = forge.cipher.createCipher('AES-CBC', key);
    usernameCipher.start({iv: iv});
    usernameCipher.update(forge.util.createBuffer(username));
    usernameCipher.finish();
    return {
        iv, salt, passwordCipher, usernameCipher
    };
}

exports.addPasswordEntry = ({ id, email, sitename, username, password, url }) => {
    return new Promise((resolve, reject) => {
        const session = driver.session();
        const { iv, salt, passwordCipher, usernameCipher } = encryptString(username, password);
        session
            .writeTransaction(tx =>                
                tx.run(
                    'MATCH (u: User { email: $emailParam }) ' + 
                    'MERGE (p: PasswordCollection { userId : $userIdParam })<-[:PASSWORDS]-(u) ' + 
                    'CREATE (e: PasswordEntry { sitename: $sitenameParam, username: $usernameParam, password: $passwordParam, salt: $saltParam, iv: $ivParam, url: $urlParam, createdAt: $createdAtParam }) ' + 
                    'CREATE (p)-[a:Archive]->(e) ' + 
                    'RETURN e',
                    {
                        emailParam: email,
                        userIdParam: id,
                        sitenameParam: sitename,
                        urlParam: url,
                        createdAtParam: new Date().toJSON(),
                        usernameParam: forge.util.encode64(usernameCipher.output.getBytes()),
                        passwordParam: forge.util.encode64(passwordCipher.output.getBytes()),
                        saltParam: forge.util.encode64(salt),
                        ivParam: forge.util.encode64(iv)
                    }
                )
            )
            .then(function (res) {
                session.close();
                const entry = res.records.length && res.records[0].get('e').properties;          
                return resolve(entry);
            })
            .catch(err => reject(err));
    })
};