import forge from 'node-forge';

const { rsa } = forge.pki;

/**
 * Generate RSA Public/Private keypair
 */

export const generateKeypair = async () => {
    const keypair = await rsa.generateKeyPair({ bits: 2048, workers: 2 });
    const { privateKey, publicKey } = keypair;
    return { privateKey, publicKey };
};
