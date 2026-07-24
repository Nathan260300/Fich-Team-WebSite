import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { TocProvider } from './context/TocContext.jsx';
createRoot(document.getElementById('root')).render(
  <TocProvider>
    <App />
  </TocProvider>
);
