import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from "./reduxToolkit/store.js";
import App from './App';
import Control from './Control';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('main'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Control />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
