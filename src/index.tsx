import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import './setupVendorLibraries';

const qs = new URLSearchParams(window.location.search);
const dataUrl = qs.get('dataUrl');

const container = document.getElementById('root');
if (container === null) {
  throw new Error('Could not find react root');
}
createRoot(container).render(
  <React.StrictMode>
    <App dataUrl={typeof dataUrl === 'string' ? dataUrl : undefined} />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
