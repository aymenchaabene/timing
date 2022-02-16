import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import App from './App';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from "./store/configureStore";

if (process.env.NODE_ENV !== 'production') {
    console.log('Development mode!');
}

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
        <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);