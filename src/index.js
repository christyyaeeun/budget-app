import { ColorModeScript } from '@chakra-ui/react';
import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/firestore';
import 'firebase/compat/functions';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database';
import { AuthProvider } from './context/AuthContext';
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

firebase.initializeApp({
  apiKey: "AIzaSyBLJQa2icgMKT0hEXlXFo7ULB0qgMSl-eY",
  databaseURL: "https://budget-app-28acd-default-rtdb.firebaseio.com",
  authDomain: "budget-app-28acd.firebaseapp.com",
  projectId: "budget-app-28acd",
  storageBucket: "budget-app-28acd.appspot.com",
  messagingSenderId: "707838298161",
  appId: "1:707838298161:web:2be1c77d3d51b0ef7fed10",
  measurementId: "G-9YQFQWKD2S"
})

const analytics = getAnalytics();
const auth = getAuth();
const db = firebase.database();
export const database = getDatabase();

root.render(
    <StrictMode>
      <ColorModeScript />
  <AuthProvider>
      <App />
  </AuthProvider>
    </StrictMode>
);


serviceWorker.unregister();
reportWebVitals();