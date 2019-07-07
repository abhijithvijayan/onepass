import srpClient from 'secure-remote-password/client';
import { array2hex } from './keyConversion';

/**
 *  Derive verifier from userId, masterpassword & salt
 * @param {String} userId eg: user_9xxbk9_1
 * @param {String} masterPassword
 */

export const computeVerifier = ({ privateKey }) => {
    const privateKeyForSRP = array2hex(privateKey);
    const verifier = srpClient.deriveVerifier(privateKeyForSRP);
    return verifier;
};
