import srpClient from 'secure-remote-password/client';

/**
 *  Derive verifier from userId, masterpassword & salt
 * @param {String} userId eg: user_9xxbk9_1
 * @param {String} masterPassword
 */

export const array2hex = array => {
    return Array.from(array)
        .map(b => {
            return b.toString(16).padStart(2, '0');
        })
        .join('');
};

export const computeVerifier = ({ privateKey }) => {
    const verifier = srpClient.deriveVerifier(privateKey);
    return verifier;
};
