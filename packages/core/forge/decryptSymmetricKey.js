import forge from 'node-forge';

export const retrieveBufferFromHex = hexValue => {
    return forge.util.createBuffer(forge.util.hexToBytes(hexValue));
};

export const decryptSymmetricKey = ({ encryptedSymmetricKey, masterUnlockKey, iv, tag, tagLength }) => {
    const key = forge.util.createBuffer(masterUnlockKey);
    /**
     *  https://github.com/digitalbazaar/forge/issues/135#issuecomment-47609808
     */
    const tagBuffer = retrieveBufferFromHex(tag);
    const encSymKeyBuffer = retrieveBufferFromHex(encryptedSymmetricKey);
    const ivBytes = forge.util.hexToBytes(iv);

    const decipher = forge.cipher.createDecipher('AES-GCM', key);
    decipher.start({
        iv: ivBytes,
        tagLength,
        tag: tagBuffer,
    });
    decipher.update(encSymKeyBuffer);
    const pass = decipher.finish();
    // pass is false if there was a failure (eg: authentication tag didn't match)
    if (pass) {
        // ToDo: Get the original type as output
        const decryptedSymmetricKeyInHex = decipher.output.toHex();
        return { decryptedSymmetricKeyInHex, status: true };
    }
    return { status: false };
};
