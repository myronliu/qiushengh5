import { createStore, applyMiddleware, compose } from 'redux';
import loggerMiddleware from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import createReducer from '../reducers/RootReducer';


const enhancer = compose(
    applyMiddleware(promiseMiddleware(), loggerMiddleware())
    // , window.devToolsExtension ? window.devToolsExtension() : f => f
);

export function configureStore(initialState) {
    return createStore(createReducer(), initialState, enhancer);
}

const store = configureStore();

export default store;
