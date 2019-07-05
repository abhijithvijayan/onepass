import bitwise from 'bitwise';

/**
 * Generate MUK
 * @param {Object}
 */

export const genMasterUnlockKey = ({ hashedKey, intermediateKey }) => {
    // XOR Operation
    const XORedKey = bitwise.bits.xor(hashedKey, intermediateKey);
    // To Uint8Array
    const masterUnlockKey = new Uint8Array(XORedKey);
    return masterUnlockKey;
};
