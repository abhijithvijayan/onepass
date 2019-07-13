/* eslint-disable no-bitwise */

/**
 * Outputs XOR operation between two arrays
 * @param {Array, Array}
 */

export const xorVectors = (a, b) => {
    const length = Math.min(a.length, b.length);
    const res = new Array(length);
    for (let i = 0; i < length; i += 1) {
        res[i] = a[i] ^ b[i];
    }
    return res;
};
