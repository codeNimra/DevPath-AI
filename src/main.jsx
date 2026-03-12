import { StrictMode }   from 'react';
import { createRoot }   from 'react-dom/client';

/* CSS — variables must load before globals */
import './styles/variables.css';
import './styles/animations.css';
import './styles/globals.css';

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