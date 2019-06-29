import srpClient from 'secure-remote-password/client';

/**
 *  Derive verifier from userId, masterpassword & salt
 * @param {String} userId
 * @param {String} masterPassword
 */

const computeVerifier = (userId, masterPassword) => {
    const salt = srpClient.generateSalt();
    // ToDo: use PBKDF2
    const privateKey = srpClient.derivePrivateKey(salt, userId, masterPassword);
    const verifier = srpClient.deriveVerifier(privateKey);
    return { salt, verifier };
};

export default computeVerifier;
