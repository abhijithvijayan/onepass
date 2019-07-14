/* eslint-disable no-console */
/* eslint-disable no-use-before-define */

import decodeJwt from 'jwt-decode';
import Router from 'next/router';
import cookie from 'js-cookie';

// Core Libraries
import {
    genRandomSalt,
    generateKeypair,
    encryptVaultKey,
    encryptPrivateKey,
    encryptSymmetricKey,
    decryptSymmetricKey,
    decryptPrivateKey,
    decryptVaultKey,
} from '@onepass/core/forge';
import { deriveClientSession, verifyLoginSession, genClientEphemeral, computeVerifier } from '@onepass/core/srp';
import { stringToUint8Array, arrayTobase64uri, base64uriToArray } from '@onepass/core/jseu';
import { genCryptoRandomString, genMasterUnlockKey } from '@onepass/core/common';
import { normalizeMasterPassword } from '@onepass/core/nkdf';
import { computeHash } from '@onepass/core/pbkdf2';
import { computeHKDF } from '@onepass/core/hkdf';

import api from '../../../api';
import * as types from './types';
import * as vaultTypes from '../vault/types';
import * as uiTypes from '../common/ui/types';
import * as endpoints from '../../../api/constants';

/** ------------------------------------------------------ */

/**
 * Encryption Util funtions
 */

const deriveEncryptionKeySalt = ({ salted, randomSalt }) => {
    const uint8Salt = stringToUint8Array(salted);
    const uint8MasterSecret = stringToUint8Array(randomSalt);
    return computeHKDF({ uint8MasterSecret, uint8Salt });
};

// Password Key Generation
const generateHashedKeySet = ({ normPassword, encryptionKeySalt }) => {
    const iterations = 100000;
    const uint8MasterPassword = stringToUint8Array(normPassword);
    const hashedKey = computeHash({ uint8MasterPassword, encryptionKeySalt, iterations });
    return {
        iterations,
        key: hashedKey,
    };
};

const generateSecretKey = ({ versionCode, userId }) => {
    // get string after `user_` & then remove `_` & then uppercase it
    const trimmedUserId = userId
        .slice(5)
        .split('_')
        .join('')
        .toUpperCase();
    const length = 34 - (versionCode.length + trimmedUserId.length);
    const randomString = genCryptoRandomString(length);
    // generate 34 char secret key
    const secretKey = versionCode.concat(trimmedUserId, randomString);
    return secretKey;
};

const deriveIntermediateKey = ({ secretKey, userId }) => {
    const uint8Salt = stringToUint8Array(userId);
    const uint8MasterSecret = stringToUint8Array(secretKey);
    return computeHKDF({ uint8MasterSecret, uint8Salt });
};

const generateSymmetricKey = () => {
    const key = genRandomSalt(32);
    const encodedSymmetricKey = stringToUint8Array(key);
    return arrayTobase64uri(encodedSymmetricKey);
};

/** ------------------------------------------------------ */

/**
 * Initial Signup step
 */

export const submitSignUpData = ({ email, name }) => {
    const lowerCaseEmail = email.toLowerCase();
    return async dispatch => {
        try {
            dispatch({
                type: uiTypes.SHOW_PAGE_LOADER,
            });

            const { data } = await api({
                method: 'POST',
                url: endpoints.SIGNUP_SUBMIT_ENDPOINT,
                data: {
                    email: lowerCaseEmail,
                    name,
                },
            });

            dispatch({
                type: types.VALID_SIGNUP_FORM_SUBMISSION,
                payload: {
                    data,
                },
            });

            Router.push('/verify', '/signup/verify');
        } catch ({ response }) {
            console.log(response.data.error);
            dispatch({
                type: uiTypes.HIDE_PAGE_LOADER,
            });
            // ToDo: Dispatch some error handler
        }
    };
};

/**
 * Token Verification step
 */

export const submitVerificationToken = ({ email, verificationToken }) => {
    return async dispatch => {
        try {
            dispatch({
                type: uiTypes.SHOW_PAGE_LOADER,
            });

            const response = await api({
                method: 'POST',
                url: endpoints.TOKEN_VERIFICATION_ENDPOINT,
                data: {
                    verificationToken,
                    email,
                },
            });

            dispatch({
                type: types.VALID_VERIFICATION_TOKEN_SUBMISSION,
                payload: response.data,
            });

            Router.push('/masterpassword', '/signup/masterpassword');
        } catch ({ response }) {
            console.log(response.data.error);
            dispatch({
                type: uiTypes.HIDE_PAGE_LOADER,
            });
            // ToDo: report invalid token
        }
    };
};

/**
 * Account-Signup completion step
 */

export const completeSignUp = ({ email, userId, versionCode, password }) => {
    const sendRequest = async data => {
        await api({
            method: 'POST',
            url: endpoints.FINALIZE_ACCOUNT_ENDPOINT,
            data,
        });
    };

    return async dispatch => {
        try {
            dispatch({
                type: uiTypes.SHOW_PAGE_LOADER,
            });

            const normPassword = normalizeMasterPassword(password);

            /**
             *  SRP variables computing functions
             *
             *  `pbkdf2` for key derivation
             */
            const randomSaltForSRP = genRandomSalt(32);
            // ToDo: store salt as base64uri in DB
            const keySaltForSRP = await deriveEncryptionKeySalt({ salted: userId, randomSalt: randomSaltForSRP });
            const privateKeySetForSRP = await generateHashedKeySet({ normPassword, encryptionKeySalt: keySaltForSRP });
            const verifier = computeVerifier({ privateKey: privateKeySetForSRP.key });

            /**
             *  Encryption-Keys Generation Functions
             */

            /**
             *  1. Generate Secret Key
             */
            const secretKey = generateSecretKey({ versionCode, userId });

            /**
             *  2. Compute Master Unlock Key (MUK)
             */
            const randomSalt = genRandomSalt(16);
            const encryptionKeySalt = await deriveEncryptionKeySalt({ salted: email, randomSalt });
            const base64EncKeySalt = await arrayTobase64uri(encryptionKeySalt);
            const hashedKeySet = await generateHashedKeySet({ normPassword, encryptionKeySalt });
            const intermediateKey = await deriveIntermediateKey({ secretKey, userId });
            const masterUnlockKey = genMasterUnlockKey({ hashedKey: hashedKeySet.key, intermediateKey });

            /**
             *  3. Create Encrypted Key Set
             */
            const symmetricKey = generateSymmetricKey();
            const vaultKey = genCryptoRandomString(32);
            const { publicKey, privateKey } = await generateKeypair();
            const encryptedVaultKeySet = encryptVaultKey({ vaultKey, publicKey });
            const encryptedPrivateKeySet = encryptPrivateKey({ privateKey, symmetricKey });
            const encryptedSymmetricKeySet = encryptSymmetricKey({
                symmetricKey,
                masterUnlockKey,
                iterations: hashedKeySet.iterations,
                salt: base64EncKeySalt,
            });

            /**
             *  Encrypted Keys to be send to server
             *
             *  @output {Object} Keys
             */
            const encryptionKeys = {
                pubKey: {
                    key: publicKey,
                },
                encPriKey: encryptedPrivateKeySet,
                encSymKey: encryptedSymmetricKeySet,
                encVaultKey: encryptedVaultKeySet,
            };

            await sendRequest({
                verifier,
                salt: randomSaltForSRP,
                email,
                userId,
                encryptionKeys,
            });

            dispatch({
                type: types.USER_SIGNUP_SUCCEEDED,
            });

            // ToDo: Autodownload the secretkey for user(in PDF) on first login

            dispatch(submitLoginData({ email, password, secretKey }));
        } catch (err) {
            console.log(err);
            dispatch({
                type: uiTypes.HIDE_PAGE_LOADER,
            });
            // ToDo: report invalid token
        }
    };
};

/**
 * Login using SRP Authentication
 */

export const submitLoginData = ({ email, password, secretKey }) => {
    const sendRequest = async data => {
        const response = await api({
            method: 'POST',
            url: endpoints.LOGIN_SUBMIT_ENDPOINT,
            data,
        });
        return response;
    };

    return async dispatch => {
        try {
            dispatch({
                type: uiTypes.SHOW_PAGE_LOADER,
            });

            const normPassword = normalizeMasterPassword(password);

            /**
             * 1. Get `salt` and `serverEphemeral.public` from server
             */
            const {
                data: { userId, salt, serverPublicEphemeral },
            } = await sendRequest({ email, stage: 'init' });

            /**
             * 2. Derive `clientEphemeral` pair
             */
            const clientEphemeral = genClientEphemeral();

            dispatch({
                type: types.GET_SERVER_AUTH_RESPONSE,
                payload: {
                    serverSRPResponse: { userId, salt, serverPublicEphemeral },
                    clientEphemeral,
                },
            });

            /**
             *  3. Derive the shared strong session key, and a proof
             */
            const clientSecretEphemeral = clientEphemeral.secret;
            // use `pbkdf2` key derivation
            const keySaltForSRPLogin = await deriveEncryptionKeySalt({
                salted: userId,
                randomSalt: salt,
            });
            const privateKeySetForSRPLogin = await generateHashedKeySet({
                normPassword,
                encryptionKeySalt: keySaltForSRPLogin,
            });
            const clientSession = deriveClientSession({
                salt,
                privateKey: privateKeySetForSRPLogin.key,
                userId,
                clientSecretEphemeral,
                serverPublicEphemeral,
            });
            const clientPublicEphemeral = clientEphemeral.public;
            const clientSessionProof = clientSession.proof;

            /**
             *  4. Send `clientSessionProof` & `clientPublicEphemeral` to the server
             */
            const {
                data: { serverSessionProof, token },
            } = await sendRequest({
                email,
                clientPublicEphemeral,
                clientSessionProof,
                stage: 'login',
            });

            /**
             *  5. Verify that the server has derived the correct strong session key
             */
            verifyLoginSession(clientPublicEphemeral, clientSession, serverSessionProof);

            /**
             *  6. Save JWT Token to cookie
             */
            const in1Hour = 1 / 24;
            cookie.set('token', token, { expires: in1Hour });

            /**
             *   7. Fetch keys & data using this token
             */
            dispatch(fetchDataAndKeys({ email, normPassword, secretKey, userId }));
        } catch (err) {
            console.log(err);
            dispatch({
                type: uiTypes.HIDE_PAGE_LOADER,
            });
        }
    };
};

/**
 * Fetching Data and Encrypted Keys from Vault
 */

export const fetchDataAndKeys = ({ email, normPassword, secretKey, userId }) => {
    const sendRequest = async (data, endpoint) => {
        const response = await api({
            method: 'POST',
            url: endpoint,
            headers: { Authorization: cookie.get('token') },
            data,
        });
        return response;
    };

    function getEncKeys() {
        return sendRequest(
            {
                email,
            },
            endpoints.FETCH_KEYS_ENDPOINT
        );
    }

    function getVaultData() {
        return sendRequest(
            {
                email,
            },
            endpoints.FETCH_VAULT_ENDPOINT
        );
    }

    return async dispatch => {
        try {
            const [keys, vault] = await Promise.all([getEncKeys(), getVaultData()]);
            const { encKeySet } = keys.data;
            const { encVaultData } = vault.data;

            dispatch({
                type: types.FETCH_ENCRYPTION_KEYS,
                payload: encKeySet,
            });
            dispatch({
                type: vaultTypes.FETCH_VAULT_CONTENTS,
                payload: encVaultData,
            });

            dispatch(decryptTheVaultKey({ email, normPassword, secretKey, userId, encKeySet, encVaultData }));
        } catch (err) {
            console.log(err);
        }
    };
};

/**
 *  Decryption of Vault Key
 */

export const decryptTheVaultKey = ({ email, normPassword, secretKey, userId, encKeySet, encVaultData }) => {
    return async dispatch => {
        try {
            /**
             * 1. Compute Master Unlock Key
             */
            const { encPriKey, encSymKey } = encKeySet;
            const encryptionKeySalt = await base64uriToArray(encSymKey.salt);
            const hashedKeySet = await generateHashedKeySet({ normPassword, encryptionKeySalt });
            const intermediateKey = await deriveIntermediateKey({ secretKey, userId });
            const masterUnlockKey = genMasterUnlockKey({ hashedKey: hashedKeySet.key, intermediateKey });

            /**
             *  2. Decrypt Symmetric Key with MUK
             */
            const encryptedSymmetricKey = encSymKey.key;
            const decSymKeyOutput = await decryptSymmetricKey({
                encryptedSymmetricKey,
                masterUnlockKey,
                iv: encSymKey.iv,
                tag: encSymKey.tag,
                tagLength: encSymKey.tagLength,
            });

            /** Successful decryption of Symmetric Key */
            if (decSymKeyOutput.status) {
                const { decryptedSymmetricKey } = decSymKeyOutput;

                /**
                 *  3. Decrypt Private Key with Symmetric Key
                 */
                const { decryptedPrivateKey } = await decryptPrivateKey({
                    encryptedPrivateKey: encPriKey.key,
                    decryptedSymmetricKey,
                });

                /**
                 *  4. Decrypt Vault Key with Private Key
                 */
                const { encVaultKey } = encVaultData;
                const decryptedVaultKey = await decryptVaultKey({
                    encryptedVaultKey: encVaultKey.key,
                    decryptedPrivateKey,
                });

                dispatch({
                    type: types.USER_AUTH_SUCCEEDED,
                    payload: {
                        email,
                        userId,
                        keys: {
                            decVaultKey: decryptedVaultKey,
                            secretKey,
                        },
                    },
                });

                Router.push('/vault');
            } else {
                console.log('decryption unsuccessful');
                dispatch({
                    type: uiTypes.HIDE_PAGE_LOADER,
                });
            }
        } catch (err) {
            console.log(err);
        }
    };
};

/* ----------------------------------------------------------- */

export const authUser = payload => {
    return dispatch => {
        dispatch({
            type: types.USER_AUTH_SUCCEEDED,
            payload,
        });
    };
};

export const logoutUser = () => {
    return dispatch => {
        cookie.remove('token');
        dispatch({
            type: types.USER_DE_AUTH_SUCCEEDED,
        });
        Router.push('/login');
    };
};

export const renewAuthUser = () => {
    return async (dispatch, getState) => {
        // ToDo: Check if renew is needed from state
        try {
            const {
                data: { token },
            } = await api({
                method: 'POST',
                headers: { Authorization: cookie.get('token') },
                url: endpoints.TOKEN_RENEWAL_ENDPOINT,
            });
            const in1Hour = 1 / 24;
            cookie.set('token', token, { expires: in1Hour });
            // ToDo: Dispatch renew action
            dispatch(authUser(decodeJwt(token)));
        } catch (error) {
            cookie.remove('token');
            // ToDo: Dispatch action to de-auth user
        }
    };
};
