import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import vault from './vault';

const rootReducer = combineReducers({
    vault,
    form,
});

export default rootReducer;
