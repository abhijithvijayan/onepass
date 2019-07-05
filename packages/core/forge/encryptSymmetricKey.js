import forge from 'node-forge';

import { genRandomSalt } from './genRandonSalt';

export const encryptSymmetricKey = ({ symmetricKey, masterUnlockKey }) => {
    const iv = genRandomSalt(12);
    const key = forge.util.createBuffer(masterUnlockKey);
    const cipher = forge.cipher.createCipher('AES-GCM', key);
    cipher.start({
        iv,
        tagLength: 128,
    });
    cipher.update(forge.util.createBuffer(symmetricKey));
    cipher.finish();
    const encryptedSymmetricKey = cipher.output;
    const { tag } = cipher.mode;
    return { encryptedSymmetricKey, tag, iv };
};
