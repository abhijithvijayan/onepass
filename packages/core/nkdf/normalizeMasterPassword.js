import unorm from 'unorm';
import trimLeft from 'trim-left';
import trimRight from 'trim-right';

/**
 * Normalize using nkdf algorithm
 */

export const normalizeMasterPassword = password => {
    /* Trim white-spaces from master password */
    const rightTrimmed = trimRight(trimLeft(password));
    const combiningCharacters = /[\u0300-\u036F]/g;
    /* nfkd Normalisation */
    return unorm.nfkd(rightTrimmed).replace(combiningCharacters, '');
};
