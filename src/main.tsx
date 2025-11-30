import { createRoot } from 'react-dom/client'
import './index.css'
//import App from './App.tsx'
import ScanerQr from './ScanerQr'

import { registerSW } from 'virtual:pwa-register';

if ('serviceWorker' in navigator) {
  registerSW({
    immediate: true,
    onOfflineReady() {
      console.log('App lista para funcionar offline');
    },
  });
}

createRoot(document.getElementById('root')!).render(
  <ScanerQr />
)
