import cryptoRandomString from 'crypto-random-string';

export const genCryptoRandomString = length => {
    return cryptoRandomString({ length, characters: 'ABCDEFGHJKLMNPQRSTVWXYZ23456789' });
};
