import forge from 'node-forge';

export const retrieveBufferFromHex = hexValue => {
    return forge.util.createBuffer(forge.util.hexToBytes(hexValue));
};

export const decryptSymmetricKey = ({ encryptedSymmetricKey, masterUnlockKey, iv, tag, tagLength }) => {
    const key = forge.util.createBuffer(masterUnlockKey);
    const decipher = forge.cipher.createDecipher('AES-GCM', key);
    decipher.start({
        iv: forge.util.hexToBytes(iv),
        tagLength,
        tag: retrieveBufferFromHex(tag),
    });
    decipher.update(retrieveBufferFromHex(encryptedSymmetricKey));

    const pass = decipher.finish();
    // pass is false if there was a failure (eg: authentication tag didn't match)
    if (pass) {
        return { decryptedSymmetricKey: decipher.output.getBytes(), status: true };
    }
    return { status: false };
};
