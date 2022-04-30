import {createStore, applyMiddleware} from 'redux';
import {persistStore, persistReducer} from "redux-persist";
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import {createLogger} from 'redux-logger';
import {reducer} from '../reducers/reducers';

const logger = createLogger({});

const persistConfig = {
    key: 'root',
    storage: storage,
    stateReconciler: autoMergeLevel2
};


const persistedReducer = persistReducer(persistConfig, reducer);
export const store = createStore(persistedReducer, {}, applyMiddleware(logger));
export const persistor = persistStore(store);
