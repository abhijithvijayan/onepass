import api from '../../../api';
import * as types from './types';
import * as endpoints from '../../../api/constants';

export const submitLoginData = formValues => {
    const { email, secretKey } = formValues;
    return async dispatch => {
        const response = await api({
            method: 'POST',
            url: endpoints.LOGIN_SUBMIT_ENDPOINT,
            data: {
                email,
                secretKey,
            },
        });
        // eslint-disable-next-line no-console
        console.log('response', response);
        dispatch({
            type: types.SUBMIT_LOGIN_DATA,
            payload: response.data,
        });
    };
};
