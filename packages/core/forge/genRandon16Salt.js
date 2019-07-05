import forge from 'node-forge';

/**
 * Return 16 byte random crypto salt
 */

export const genRandom16Salt = () => {
    return forge.random.getBytesSync(16);
};
