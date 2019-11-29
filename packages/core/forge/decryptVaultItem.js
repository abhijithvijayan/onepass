import forge from 'node-forge';

import { stringToUint8Array } from '../jseu';

export const retrieveBufferFromBase64 = base64Value => forge.util.createBuffer(forge.util.decode64(base64Value));

export const decryptVaultItem = ({ encData, vaultKey }) => {
    const { iv, tagLength, tag, data } = encData;
    const key = forge.util.createBuffer(stringToUint8Array(vaultKey));
    const decipher = forge.cipher.createDecipher('AES-GCM', key);
    decipher.start({
        iv: forge.util.hexToBytes(iv),
        tagLength,
        tag: retrieveBufferFromBase64(tag),
    });
    decipher.update(retrieveBufferFromBase64(data));
    const pass = decipher.finish();
    if (pass) {
        return { decrypted: JSON.parse(decipher.output.getBytes()), status: true };
    }
    return { status: false };
};

export const decryptItemOverview = async ({ overview, vaultKey }) => {
    // ToDo: check status of decryption
    const response = await decryptVaultItem({ encData: overview, vaultKey });
    return response;
};

export const decryptItemDetails = async ({ details, vaultKey }) => {
    const response = await decryptVaultItem({ encData: details, vaultKey });
    return response;
};
