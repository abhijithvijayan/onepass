import api from '../../../api';
import * as types from './types';
import * as endpoints from '../../../api/constants';

export const submitSignUpData = formValues => {
    return async dispatch => {
        const response = await api({
            method: 'POST',
            url: endpoints.SIGNUP_SUBMIT_ENDPOINT,
            data: {
                formValues,
            },
        });
        dispatch({
            type: types.SUBMIT_SIGNUP_DATA,
            payload: response.data,
        });
    };
};
