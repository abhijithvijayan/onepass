import jseu from 'js-encoding-utils';

/**
 *
 * Encode the string to Uint8Array
 * @param {String} string
 */

export const stringToUint8Array = string => jseu.encoder.stringToArrayBuffer(string);
