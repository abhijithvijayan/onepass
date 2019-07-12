import forge from 'node-forge';

import { genRandomSalt } from './genRandonSalt';

/**
 * Encrypt Symmetric Key with Master Unlock Key
 *
 * @output
 * {
 *      kid,
 *      enc,
 *      tag, {Hex}
 *      iv,
 *      tagLength,
 *      key, {Hex}
 *      iterations,
 *      salt,
 * }
 */

export const encryptSymmetricKey = ({ symmetricKey, masterUnlockKey, iterations, salt }) => {
    const iv = genRandomSalt(12);
    const tagLength = 128;
    const key = forge.util.createBuffer(masterUnlockKey);
    const cipher = forge.cipher.createCipher('AES-GCM', key);
    cipher.start({
        iv,
        tagLength,
    });
    cipher.update(forge.util.createBuffer(symmetricKey));
    cipher.finish();
    const encryptedSymmetricKey = cipher.output;
    const { tag } = cipher.mode;
    const encSymKey = {
        kid: 'mp',
        enc: 'A256GCM',
        tag: tag.toHex(),
        iv,
        tagLength,
        key: encryptedSymmetricKey.toHex(),
        iterations,
        salt,
    };
    return encSymKey;
};
