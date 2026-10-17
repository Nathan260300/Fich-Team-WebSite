import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './theme/themes.css';
import { initSeason } from './theme/season';
import SeasonLayer from './theme/SeasonLayer';
import App from './App';

initSeason();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <SeasonLayer />
  </StrictMode>
);