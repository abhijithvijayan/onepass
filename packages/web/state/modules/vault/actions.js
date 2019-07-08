import api from '../../../api';
import * as types from './types';
import * as endpoints from '../../../api/constants';

export const toggleSideBar = () => {
    return {
        type: types.TOGGLE_SIDEBAR,
    };
};
