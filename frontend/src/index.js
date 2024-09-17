// src/index.js
// Clint Steadman

if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
  document.cookie = "samesite_test=1; SameSite=None; Secure";
}

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './AuthContext';
import '@fortawesome/fontawesome-free/css/all.min.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
