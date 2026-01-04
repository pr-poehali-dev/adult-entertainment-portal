import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

console.log('Main.tsx loaded');

try {
  const root = document.getElementById("root");
  if (!root) {
    throw new Error('Root element not found');
  }
  
  console.log('Rendering app...');
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log('App rendered successfully');
} catch (error) {
  console.error('Failed to render app:', error);
  document.body.innerHTML = `<div style="padding:20px;color:red;font-size:18px;font-family:monospace;">
    <h1>Ошибка загрузки приложения</h1>
    <p>Error: ${error}</p>
    <p>Попробуйте очистить кэш браузера (Ctrl+Shift+R)</p>
  </div>`;
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful');
      })
      .catch((err) => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}