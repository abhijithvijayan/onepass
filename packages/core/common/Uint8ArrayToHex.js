/**
 * convert Uint8Array to `hex`
 * @param {Uint8Array} array
 */

export const array2hex = array => {
    return Array.from(array)
        .map(b => {
            return b.toString(16).padStart(2, '0');
        })
        .join('');
};
