import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';

import App from './App';

import 'react-toastify/dist/ReactToastify.css';

const clientId : string = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <GoogleOAuthProvider clientId={clientId}>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <ToastContainer />
    </React.StrictMode>
  </GoogleOAuthProvider>
);
