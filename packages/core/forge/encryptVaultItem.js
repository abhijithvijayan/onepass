import forge from 'node-forge';

import { genRandomSalt } from './genRandonSalt';
import { stringToUint8Array } from '../jseu';

export const encryptContent = ({ content, vaultKey }) => {
    const iv = genRandomSalt(12);
    const tagLength = 128;

    // Convert string to Uint8Array, then to forge-buffer
    const cipher = forge.cipher.createCipher('AES-GCM', forge.util.createBuffer(stringToUint8Array(vaultKey)));
    cipher.start({
        iv,
        tagLength,
    });
    // JSON stringify -> forge-buffer
    cipher.update(forge.util.createBuffer(JSON.stringify(content)));
    cipher.finish();

    const encryptedContent = {
        // buffer to base64
        tag: forge.util.encode64(cipher.mode.tag.getBytes()),
        data: forge.util.encode64(cipher.output.getBytes()),
        tagLength,
        // bytes to hex
        iv: forge.util.bytesToHex(iv),
    };
    return encryptedContent;
};

export const encryptVaultItem = async ({ details, overview, vaultKey }) => {
    const encDetails = await encryptContent({ content: details, vaultKey });
    const encOverview = await encryptContent({ content: overview, vaultKey });
    return {
        encDetails,
        encOverview,
    };
};
