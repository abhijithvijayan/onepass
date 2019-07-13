import forge from 'node-forge';

/**
 * Decrypt Vault Key with Private Key
 * @param {32 bytes key} encryptedVaultKey
 * @param {RSA Key} PrivateKey
 */

export const decryptVaultKey = ({ encryptedVaultKey, decryptedPrivateKey }) => {
    // decode base64
    const decodedKey = forge.util.decode64(encryptedVaultKey);
    // decrypt data with a private key using RSAES-OAEP/SHA-256
    const decryptedVaultKey = decryptedPrivateKey.decrypt(decodedKey, 'RSA-OAEP', {
        md: forge.md.sha256.create(),
    });
    return decryptedVaultKey;
};
