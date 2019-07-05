import jseu from 'js-encoding-utils';

/**
 *
 * Encode the string to Uint8Array
 * @param {String} string
 */

export const stringToUint8Array = string => {
    return jseu.encoder.stringToArrayBuffer(string);
};
