import hkdf from 'js-crypto-hkdf';

/**
 * Hash-based Key Derivation Function
 * @param {Object}
 */

export const computeHKDF = ({ uint8MasterSecret, uint8Salt }) => {
    return hkdf.compute(uint8MasterSecret, 'SHA-256', 32, '', uint8Salt).then(derived => {
        return derived.key;
    });
};
