import { StrictMode }   from 'react';
import { createRoot }   from 'react-dom/client';

/* Single CSS file — all design tokens, animations, and globals combined */
import './App.css';

import { ThemeProvider } from './context/ThemeContext';
import { AppProvider }   from './context/AppContext';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </ThemeProvider>
  </StrictMode>
);