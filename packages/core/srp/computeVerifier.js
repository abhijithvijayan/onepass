import srpClient from 'secure-remote-password/client';

/**
 *  Derive verifier from userId, masterpassword & salt
 * @param {String} userId eg: user_9xxbk9_1
 * @param {String} masterPassword
 */

export const computeVerifier = ({ privateKey }) => {
    const privateKeyForSRP = privateKey.toString('hex');
    const verifier = srpClient.deriveVerifier(privateKeyForSRP);
    return verifier;
};
