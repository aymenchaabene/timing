import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from "../reducers/index";

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['defaultReducer'],
};

const middleware = [thunk];

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;
const enhancer = composeEnhancers(applyMiddleware(...middleware));
export const persistedReducers = persistReducer(persistConfig, rootReducer);
export const store = createStore(persistedReducers, enhancer);
export const persistor = persistStore(store);
