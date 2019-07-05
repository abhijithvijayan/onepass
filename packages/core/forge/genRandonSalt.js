import forge from 'node-forge';

/**
 * Return 16 byte random crypto salt
 */

export const genRandomSalt = size => {
    return forge.random.getBytesSync(size);
};
