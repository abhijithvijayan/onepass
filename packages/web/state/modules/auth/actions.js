/* eslint-disable no-console */
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
} from '@onepass/core/forge';
import { deriveClientSession, verifyLoginSession, genClientEphemeral, computeVerifier } from '@onepass/core/srp';
import { genCryptoRandomString, genMasterUnlockKey } from '@onepass/core/common';
import { stringToUint8Array, keyTobase64uri } from '@onepass/core/jseu';
import { normalizeMasterPassword } from '@onepass/core/nkdf';
import { computeHash } from '@onepass/core/pbkdf2';
import { computeHKDF } from '@onepass/core/hkdf';

import api from '../../../api';
import * as types from './types';
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
    // get string after `user_`
    const trimmedUserId = userId.slice(5);
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
    return keyTobase64uri(encodedSymmetricKey);
};

/** ------------------------------------------------------ */

/**
 * Initial signup step
 * @param {String} email
 * @param {String} name
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
                type: types.SUBMIT_SIGNUP_DATA,
                payload: data,
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
 * @param {String} email
 * @param {Number} verificationToken
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
                type: types.SUBMIT_VERIFICATION_TOKEN,
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
 * Account signup completion step
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
             * SRP variables computing functions
             *
             * `pbkdf2` for key derivation
             */
            const randomSaltForSRP = genRandomSalt(16);
            const keySaltForSRP = await deriveEncryptionKeySalt({ salted: userId, randomSalt: randomSaltForSRP });
            const privateKeySetForSRP = await generateHashedKeySet({ normPassword, encryptionKeySalt: keySaltForSRP });
            const verifier = computeVerifier({ privateKey: privateKeySetForSRP.key });

            /**
             * Encryption Variables
             */

            // 1. Generate Secret Key
            const secretKey = generateSecretKey({ versionCode, userId });
            // 2. Compute Master Unlock Key (MUK)
            const randomSalt = genRandomSalt(16);
            const encryptionKeySalt = await deriveEncryptionKeySalt({ salted: email, randomSalt });
            // Returns: Object
            const hashedKeySet = await generateHashedKeySet({ normPassword, encryptionKeySalt });
            const intermediateKey = await deriveIntermediateKey({ secretKey, userId });
            const masterUnlockKey = genMasterUnlockKey({ hashedKey: hashedKeySet.key, intermediateKey });
            // 3. Create Encrypted Key Set
            const symmetricKey = generateSymmetricKey();
            const vaultKey = genCryptoRandomString(32);
            const { publicKey, privateKey } = await generateKeypair();
            const encryptedVaultKeySet = encryptVaultKey({ vaultKey, publicKey });
            const encryptedPrivateKeySet = encryptPrivateKey({ privateKey, symmetricKey });
            const encryptedSymmetricKeySet = encryptSymmetricKey({
                symmetricKey,
                masterUnlockKey,
                iterations: hashedKeySet.iterations,
                salt: encryptionKeySalt,
            });

            // Data to be send to server
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
                type: types.COMPLETE_SIGNUP,
            });

            // ToDo: Auto-Login on completion and autodownload the secretkey for user(PDF)

            // eslint-disable-next-line no-use-before-define
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

            // get `salt` and `serverEphemeral.public` from server
            const {
                data: { userId, salt, serverPublicEphemeral },
            } = await sendRequest({ email, stage: 'init' });

            // Derive `clientEphemeral` pair
            const clientEphemeral = genClientEphemeral();
            dispatch({
                type: types.GET_SERVER_EPHEMERAL,
                payload: {
                    serverResponse: { userId, salt, serverPublicEphemeral },
                    clientEphemeral,
                },
            });

            // Derive the shared strong session key, and a proof
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

            // Send `clientSessionProof` & `clientPublicEphemeral` to the server
            const {
                data: { serverSessionProof, token },
            } = await sendRequest({
                email,
                clientPublicEphemeral,
                clientSessionProof,
                stage: 'login',
            });

            /**
             * Verify that the server has derived the correct strong session key
             */
            verifyLoginSession(clientPublicEphemeral, clientSession, serverSessionProof);

            const in1Hour = 1 / 24;
            cookie.set('token', token, { expires: in1Hour });

            dispatch({
                type: types.AUTH_USER,
                payload: decodeJwt(token),
            });

            Router.push('/vault');
        } catch (err) {
            console.log(err);
            dispatch({
                type: uiTypes.HIDE_PAGE_LOADER,
            });
        }
    };
};

export const authUser = payload => {
    return dispatch => {
        dispatch({
            type: types.AUTH_USER,
            payload,
        });
    };
};

export const logoutUser = () => {
    return dispatch => {
        cookie.remove('token');
        dispatch({
            type: types.DE_AUTH_USER,
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
