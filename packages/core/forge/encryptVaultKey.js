import forge from 'node-forge';

/**
 * Encrypt Vault Key with Public Key
 * @param {32 bytes key} data
 * @param {RSA Key} publicKey
 */

export const encryptVaultKey = ({ vaultKey, publicKey }) => {
    const data = vaultKey;
    // encrypt data with a public key using RSAES-OAEP/SHA-256
    return publicKey.encrypt(data, 'RSA-OAEP', {
        md: forge.md.sha256.create(),
    });
};
