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
import * as errorTypes from '../errors/types';
import * as vaultTypes from '../vault/types';
import * as uiTypes from '../common/ui/types';
import * as endpoints from '../../../api/constants';

import { fetchDataAndKeys, performVaultItemDecryption } from '../vault/operations';

/** ------------------------------------------------------ */

/**
 * Encryption Helper funtions
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
 *  Initial Signup
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
            dispatch({
                type: errorTypes.USER_SIGNUP_FAILED,
                payload: {
                    error: response.data && response.data.error,
                },
            });
            dispatch({
                type: uiTypes.HIDE_PAGE_LOADER,
            });
        }
    };
};

/**
 *  Token Verification step
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
            dispatch({
                type: errorTypes.USER_SIGNUP_FAILED,
                payload: {
                    error: response.data && response.data.error,
                },
            });
            dispatch({
                type: uiTypes.HIDE_PAGE_LOADER,
            });
        }
    };
};

/**
 *  Account-Signup completion
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
            // ToDo: store salt as base64uri in DB or use srp saltGen fn
            const keySaltForSRP = await deriveEncryptionKeySalt({ salted: userId, randomSalt: randomSaltForSRP });
            const privateKeySetForSRP = await generateHashedKeySet({ normPassword, encryptionKeySalt: keySaltForSRP });
            const verifier = computeVerifier({ privateKey: privateKeySetForSRP.key });

            /**
             *  Encryption-Keys derivation functions
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
             *  Encrypted KeySet to be send to server
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

            dispatch(submitLoginData({ email, password, secretKey }));
        } catch (err) {
            // Handle error response from server
            if (err.response && err.response.data) {
                const { error } = err.response.data;
                dispatch({
                    type: errorTypes.USER_SIGNUP_FAILED,
                    payload: {
                        error,
                    },
                });
                Router.push('/signup');
            } else {
                // ToDo: handle client encryption errors
                console.log(err);
            }
            dispatch({
                type: uiTypes.HIDE_PAGE_LOADER,
            });
        }
    };
};

/**
 *  Login using SRP Authentication
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
            // Trim to 34 characters without dashes
            const normSecretKey = secretKey
                .split('-')
                .join('')
                .toUpperCase();

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
                data: { serverSessionProof, token, name, hasDownloadedEmergencyKit },
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
            cookie.set('token', token, { expires: 1 });

            /**
             *   7. Fetch keys & data using this token
             */
            const { encKeySet, encVaultData } = await dispatch(fetchDataAndKeys({ email }));

            /**
             *   8. Decrypt Vault Key
             */
            const decVaultKeyResponse = await dispatch(
                decryptTheVaultKey({ normPassword, secretKey: normSecretKey, userId, encKeySet, encVaultData })
            );

            // If VaultKey decryption was successful
            if (decVaultKeyResponse.vaultKeyDecStatus) {
                const { decryptedVaultKey } = decVaultKeyResponse;

                /**
                 *   9. Decrypt Vault if not empty
                 */
                let decVaultStatus = true;
                const { encArchiveList, itemsCount } = encVaultData;
                if (itemsCount !== 0) {
                    const response = await dispatch(
                        performVaultItemDecryption({ encArchiveList, vaultKey: decryptedVaultKey })
                    );
                    // destructuring
                    ({ decVaultStatus } = response);
                }

                // Decryption was successful
                if (decVaultStatus) {
                    /**
                     *  10. Dispatch Successful auth
                     */
                    dispatch({
                        type: types.USER_AUTH_SUCCEEDED,
                        payload: {
                            email,
                            userId,
                            name,
                            hasDownloadedEmergencyKit,
                            keys: {
                                decVaultKey: decryptedVaultKey,
                                secretKey: normSecretKey,
                            },
                        },
                    });

                    /**
                     *   11. Save items to LocalStorage (distinguished by userId)
                     */
                    localStorage.setItem(
                        userId,
                        JSON.stringify({
                            userId,
                            name,
                            email,
                            secretKey: normSecretKey,
                        })
                    );
                    localStorage.setItem('lastUser', userId);

                    Router.push('/vault');
                }
            }
        } catch (err) {
            // Handle error response from server
            if (err.response && err.response.data) {
                const { error } = err.response.data;
                dispatch({
                    type: errorTypes.USER_AUTH_FAILED,
                    payload: {
                        error,
                    },
                });
            } else {
                // ToDo: handle client decryption errors
                console.log(err);
            }
            dispatch({
                type: uiTypes.HIDE_PAGE_LOADER,
            });
        }
    };
};

/**
 *  Decryption of Vault Key
 */

export const decryptTheVaultKey = ({ normPassword, secretKey, userId, encKeySet, encVaultData }) => {
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

                return { decryptedVaultKey, vaultKeyDecStatus: true };
            }
            // Decryption Failed
            dispatch({
                type: errorTypes.USER_AUTH_FAILED,
                payload: {
                    error: 'Invalid secret key or master password',
                },
            });
            dispatch({
                type: uiTypes.HIDE_PAGE_LOADER,
            });
            return { vaultKeyDecStatus: false };
        } catch (err) {
            console.log(err);
        }
    };
};

export const getEmergencyKit = email => {
    return async dispatch => {
        try {
            const { data } = await api({
                method: 'POST',
                url: endpoints.GET_EMERGENCY_KIT_ENDPOINT,
                headers: { Authorization: cookie.get('token') },
                data: { email },
            });
            // if only successful
            dispatch({
                type: types.DOWNLOAD_EMERGENCY_KIT,
                payload: { status: data.status },
            });
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
        // fetch userId & remove accordingly
        localStorage.removeItem(localStorage.getItem('lastUser'));
        localStorage.removeItem('lastUser');
        dispatch({
            type: vaultTypes.CLEAR_DECRYPTED_VAULT_DATA,
        });
        dispatch({
            type: vaultTypes.CLEAR_FETCHED_VAULT_DATA,
        });
        dispatch({
            type: types.USER_DE_AUTH_SUCCEEDED,
        });
        Router.push('/login');
    };
};

export const renewAuthUser = () => {
    return async dispatch => {
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
