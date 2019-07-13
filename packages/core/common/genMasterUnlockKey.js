import { xorVectors } from './xorVectors';

/**
 * Generate Master Unlock Key
 * @param {Object}
 */

export const genMasterUnlockKey = ({ hashedKey, intermediateKey }) => {
    // XOR Operation Output To Uint8Array
    const masterUnlockKey = new Uint8Array(xorVectors(hashedKey, intermediateKey));
    return masterUnlockKey;
};
