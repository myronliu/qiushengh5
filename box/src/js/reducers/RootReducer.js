import { combineReducers } from 'redux';
import appReducer from './appReducer';

export default function createReducer() {
    return combineReducers({
        appReducer,
    });
}
