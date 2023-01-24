import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { Main } from './component/Main';
import './style/index.css';

const firebaseConfig = {
  apiKey: 'AIzaSyBlIXJe0GjRj35qKvpJxP_2zXngSYwThqQ',
  authDomain: 'hangle-5db1b.firebaseapp.com',
  databaseURL: 'https://hangle-5db1b-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'hangle-5db1b',
  storageBucket: 'hangle-5db1b.appspot.com',
  messagingSenderId: '851830293451',
  appId: '1:851830293451:web:f308a91b5063ee3f736c4e',
  measurementId: 'G-1P14XF2ES4',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

let root = document.getElementById('root');
if (!root) {
  root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
}

ReactDOM.createRoot(root).render(<Main />);
