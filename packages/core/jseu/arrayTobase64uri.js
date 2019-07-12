import jseu from 'js-encoding-utils';

/**
 * Convert from a Buffer to a base64uri-encoded String
 * @param {Uint8Array} keyArray
 */

// ToDo: use node-jose if JWK could be performed with it
export const arrayTobase64uri = keyArray => {
    return jseu.encoder.encodeBase64Url(keyArray);
};
