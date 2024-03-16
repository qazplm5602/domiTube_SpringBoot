import { legacy_createStore as createStore, combineReducers } from 'redux';
import LoginStore from './LoginStore';

const combine = combineReducers({
    login: LoginStore
});

export default createStore(combine);