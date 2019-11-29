import forge from 'node-forge';

/**
 * Return random byte crypto salt
 * @param {Integer} size
 */

export const genRandomSalt = size => forge.random.getBytesSync(size);
