/* eslint-disable no-console */
import Router from 'next/router';
import cookie from 'js-cookie';
import decodeJwt from 'jwt-decode';

import { deriveClientSession, verifyLoginSession } from '@onepass/core/auth';
import api from '../../../api';
import * as types from './types';
import * as endpoints from '../../../api/constants';

export const submitSignUpData = formValues => {
    const { email, name } = formValues;
    return async dispatch => {
        try {
            const response = await api({
                method: 'POST',
                url: endpoints.SIGNUP_SUBMIT_ENDPOINT,
                data: {
                    email,
                    name,
                },
            });
            dispatch({
                type: types.SUBMIT_SIGNUP_DATA,
                payload: response.data,
            });
            // route to verify page
            Router.push('/verify', '/signup/verify');
        } catch ({ response }) {
            // eslint-disable-next-line no-console
            console.log(response.data.error);
            // ToDo: Dispatch some error handler
        }
    };
};

export const submitVerificationToken = (verificationToken, email) => {
    return async dispatch => {
        try {
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
            // route after verification
            Router.push('/masterpassword', '/signup/masterpassword');
        } catch ({ response }) {
            // eslint-disable-next-line no-console
            console.log(response.data.error);
            // ToDo: report invalid token
        }
    };
};

export const submitSRPVerifierOnSignUp = (verifier, salt, email, userId) => {
    return async dispatch => {
        try {
            const response = await api({
                method: 'POST',
                url: endpoints.VERIFIER_SUBMIT_ENDPOINT,
                data: {
                    verifier,
                    salt,
                    email,
                    userId,
                },
            });
            dispatch({
                type: types.SEND_SRP_VERIFIER,
                payload: response.data,
            });
            Router.push('/login');
        } catch ({ response }) {
            // eslint-disable-next-line no-console
            console.log(response.data.error);
            // ToDo: report invalid token
        }
    };
};

export const submitLoginData = ({ formValues, clientEphemeral }) => {
    const { email, password, secretKey } = formValues;

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
            // get `salt` and `serverEphemeral.public` from server
            const {
                data: { userId, salt, serverPublicEphemeral },
            } = await sendRequest({ email, stage: 'init' });
            dispatch({
                type: types.GET_SERVER_EPHEMERAL,
                payload: {
                    serverResponse: { userId, salt, serverPublicEphemeral },
                    clientEphemeral,
                },
            });
            // Derive the shared strong session key, and a proof
            const clientSecretEphemeral = clientEphemeral.secret;
            const clientSession = deriveClientSession(
                salt,
                userId,
                password,
                clientSecretEphemeral,
                serverPublicEphemeral
            );
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
             * Optional:
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
            // eslint-disable-next-line no-console
            console.log(err);
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
