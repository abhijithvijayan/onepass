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
    // create a buffer
    const keyBuffer = forge.util.createBuffer(masterUnlockKey);
    const symKeyBuffer = forge.util.createBuffer(symmetricKey);
    const cipher = forge.cipher.createCipher('AES-GCM', keyBuffer);
    cipher.start({
        iv,
        tagLength,
    });
    cipher.update(symKeyBuffer);
    cipher.finish();

    const encryptedSymmetricKey = cipher.output;
    const { tag } = cipher.mode;
    const encSymKey = {
        kid: 'mp',
        enc: 'A256GCM',
        tagLength,
        // buffer to hex
        tag: tag.toHex(),
        key: encryptedSymmetricKey.toHex(),
        // bytes to hex
        iv: forge.util.bytesToHex(iv),
        iterations,
        // This salt is encrytionSalt
        salt,
    };
    return encSymKey;
};
