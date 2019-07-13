import forge from 'node-forge';

const { pki } = forge;

export const decryptPrivateKey = ({ encryptedPrivateKey, decryptedSymmetricKey }) => {
    // decrypts a PEM-formatted, encrypted private key
    const decryptedPrivateKeyInfo = pki.decryptRsaPrivateKey(encryptedPrivateKey, decryptedSymmetricKey);

    return {
        decryptedPrivateKey: decryptedPrivateKeyInfo,
    };
};
