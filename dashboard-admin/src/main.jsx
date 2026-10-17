import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './theme/themes.css';
import { initSeason } from './theme/season';
import SeasonLayer from './theme/SeasonLayer';
import App from './App.jsx';

initSeason();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <SeasonLayer intensity="light" />
  </StrictMode>
);
