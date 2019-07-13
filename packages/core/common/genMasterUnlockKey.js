/* eslint-disable no-bitwise */

/**
 * Outputs XOR operation between two arrays
 * @param {Array, Array}
 */

function xorVectors(a, b) {
    const length = Math.min(a.length, b.length);
    const res = new Array(length);
    for (let i = 0; i < length; i += 1) {
        res[i] = a[i] ^ b[i];
    }
    return res;
}

/**
 * Generate Master Unlock Key
 * @param {Object}
 */

export const genMasterUnlockKey = ({ hashedKey, intermediateKey }) => {
    // XOR Operation Output To Uint8Array
    const masterUnlockKey = new Uint8Array(xorVectors(hashedKey, intermediateKey));
    return masterUnlockKey;
};
