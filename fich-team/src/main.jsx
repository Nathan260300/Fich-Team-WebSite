console.log('%c© 2026 - FICH Team','background:#282c34;color:#98c379;padding:.5em 1em;border-radius:5px;font-weight:bold;');
console.log('%cFICH Team — Communauté de joueurs passionnés','background:#282c34;color:#61afef;padding:.5em 1em;border-radius:5px;font-weight:bold;');
console.log('%cFICH Team : communauté de joueurs passionnés — Force, Intelligence, Charisme, Honneur. Build, redstone, RP et minijeux.', 'background:#282c34;color:#61dafb;padding:.5em 1em;border-radius:5px;font-weight:bold;');
console.log('%chttps://fich-team.netlify.app','background:#282c34;color:#e06c75;padding:.5em 1em;border-radius:5px;font-weight:bold;');
console.log('%cMade with 🕑 and 💖 by Nathan The Coder – Last update : 22/04/2026','background:#282c34;color:#c678dd;padding:.5em 1em;border-radius:5px;font-weight:bold;');

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);