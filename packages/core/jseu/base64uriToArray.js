import jseu from 'js-encoding-utils';

/**
 * Convert base64uri-encoded String to a Uint8Array
 * @param {base64uri} key
 */

export const base64uriToArray = encoded => {
    return jseu.encoder.decodeBase64(encoded);
};
