import jseu from 'js-encoding-utils';

/**
 * Convert a hex value to a Uint8Array
 * @param {hexString}
 */

// ToDo: use node-jose if JWK could be performed with it
export const hexToUint8Array = hexString => {
    return jseu.encoder.hexStringToArrayBuffer(hexString);
};
