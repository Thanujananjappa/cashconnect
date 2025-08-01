import React from 'react';
import './index.css'; // Or './styles.css'

import ReactDOM from 'react-dom/client';
// main.tsx or index.tsx
import 'leaflet/dist/leaflet.css';

import App from './App';
import { AuthProvider } from './hooks/useAuth'; // ✅ Wrap here

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
