import hkdf from 'js-crypto-hkdf';

/**
 * Hash-based Key Derivation Function
 * @param {Uint8Array} MasterSecret
 * @param {Uint8Array} Salt
 */

export const computeHKDF = (uint8MasterSecret, uint8Salt) => {
    return hkdf.compute(uint8MasterSecret, 'SHA-256', 32, '', uint8Salt).then(derived => {
        return derived.key;
    });
};
