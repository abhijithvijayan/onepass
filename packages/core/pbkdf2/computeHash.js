import * as sha256 from 'fast-sha256';

/**
 * Perform PBKDF2-HMAC-SHA256 hashing
 * @param {Object}
 */
export const computeHash = ({ uint8MasterPassword, encryptionKeySalt }) =>
    sha256.pbkdf2(uint8MasterPassword, encryptionKeySalt, 100000, 32);
