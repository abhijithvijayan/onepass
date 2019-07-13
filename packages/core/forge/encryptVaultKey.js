import forge from 'node-forge';

/**
 * Encrypt Vault Key with Public Key
 * @param {32 bytes key} data
 * @param {RSA Key} publicKey
 *
 * Output
 * {
 *      alg,
 *      kty,
 *      key
 * }
 */

export const encryptVaultKey = ({ vaultKey, publicKey }) => {
    const data = vaultKey;
    // encrypt data with a public key using RSAES-OAEP/SHA-256
    const encryptedVaultKey = publicKey.encrypt(data, 'RSA-OAEP', {
        md: forge.md.sha256.create(),
    });

    const encVaultKeySet = {
        alg: 'RSA-OAEP-256',
        kty: 'RSA',
        key: forge.util.encode64(encryptedVaultKey),
    };
    return encVaultKeySet;
};
