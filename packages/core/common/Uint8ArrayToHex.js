/**
 * convert Uint8Array to `hex`
 * @param {Uint8Array} array
 */

export const array2hex = array =>
    Array.from(array)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
