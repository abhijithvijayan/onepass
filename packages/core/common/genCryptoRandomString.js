import cryptoRandomString from 'crypto-random-string';

/**
 * Return random sequence of string from custom character selection
 * @param {Integer} length
 */

export const genCryptoRandomString = length =>
    cryptoRandomString({ length, characters: 'ABCDEFGHJKLMNPQRSTVWXYZ23456789' });
