/* eslint-disable no-console */
import React, { Component } from 'react';
import { generateHashedKey, generateSecretKey, deriveIntermediateKey } from '@onepass/core';

class App extends Component {
    async componentDidMount() {
        /**
            Encryption Keys
        */
        // password key
        const hashedKey = await generateHashedKey();
        console.log('hashed key: ', hashedKey);

        const { accountId, secretKey } = generateSecretKey();
        const intermediateKey = await deriveIntermediateKey(secretKey, accountId);
        console.log('Intermediate key : ', intermediateKey);

        // XOR Operation
        // const XORedKey = bitwise.bits.xor(hashedKey, intermediateKey);
        // // To Uint8Array
        // const masterUnlockKey = new Uint8Array(XORedKey);
        // console.log('master unlock key : ', masterUnlockKey);

        // encryptPrivateKey(masterUnlockKey);

        // // ToDo: Return as JWK object
        // const base64uriKey = keyTobase64uri(masterUnlockKey);
        // console.log('base64uri-encoded MUK : ', base64uriKey);

        // ToDo:
        // 1. Encrypt Private Key with MUK/KEK
        // 1. MUK to JWK (symmetric key : AES-256-GCM) (to store)
        // 3. Decrypting Vault Keys is done with Original Private Key
        // 4. Vault Keys are used to decrypt data

        /**
            Public-Private Keys
        */
        // const publicKey = generateKeypair(); // send to server
        // console.log(publicKey);
    }

    render() {
        return <div>Look at the console!</div>;
    }
}

export default App;
