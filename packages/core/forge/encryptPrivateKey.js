import forge from 'node-forge';

const { pki } = forge;

/**
 * Encrypt Private Key With Symmetric Key
 * @param {RSA key} privateKey
 * @param {base64uri key} symmetricKey
 */

export const encryptPrivateKey = ({ privateKey, symmetricKey }) => {
    // convert a Forge private key to an ASN.1 RSAPrivateKey
    const rsaPrivateKey = pki.privateKeyToAsn1(privateKey);
    // wrap an RSAPrivateKey ASN.1 object in a PKCS#8 ASN.1 PrivateKeyInfo
    const privateKeyInfo = pki.wrapRsaPrivateKey(rsaPrivateKey);
    // encrypts a PrivateKeyInfo and outputs an EncryptedPrivateKeyInfo
    const encryptedPrivateKey = pki.encryptPrivateKeyInfo(privateKeyInfo, symmetricKey, {
        algorithm: 'aes256',
    });
    return encryptedPrivateKey;
};
