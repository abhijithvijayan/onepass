/* eslint-disable no-console */
import Router from 'next/router';

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
            // eslint-disable-next-line no-console
            console.log('response', response);
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

export const submitLoginData = (formValues, clientEphemeral) => {
    const { email } = formValues;

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
            const clientPublicEphemeral = clientEphemeral.public;
            // ToDo: Get `salt` and `serverEphemeral.public` from server
            const serverInitialResponse = await sendRequest({ email, clientPublicEphemeral, stage: 1 });
            dispatch({
                type: types.SEND_CLIENT_EPHEMERAL,
                payload: {
                    response: serverInitialResponse.data,
                    clientEphemeral,
                },
            });
            console.log(serverInitialResponse.data);
            // ToDo: derive the shared strong session key, and a proof
            // Send it to server

            // ToDo: get `serverSession.proof` from server
            // Verify & complete auth
        } catch ({ response }) {
            // eslint-disable-next-line no-console
            console.log(response.data.error);
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
            Router.push('/home');
        } catch ({ response }) {
            // eslint-disable-next-line no-console
            console.log(response.data.error);
            // ToDo: report invalid token
        }
    };
};
