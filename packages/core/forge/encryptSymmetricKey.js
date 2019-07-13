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

    const cipher = forge.cipher.createCipher('AES-GCM', forge.util.createBuffer(masterUnlockKey));
    cipher.start({
        iv,
        tagLength,
    });
    cipher.update(forge.util.createBuffer(symmetricKey));
    cipher.finish();

    const encryptedSymmetricKey = cipher.output;
    const encSymKey = {
        kid: 'mp',
        enc: 'A256GCM',
        tagLength,
        // buffer to hex
        tag: cipher.mode.tag.toHex(),
        key: encryptedSymmetricKey.toHex(),
        // bytes to hex
        iv: forge.util.bytesToHex(iv),
        iterations,
        // This salt is encrytionSalt
        salt,
    };
    return encSymKey;
};
