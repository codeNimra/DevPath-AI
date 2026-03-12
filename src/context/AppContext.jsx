import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

const DEFAULT_PROFILE = {
  name:          '',
  goal:          '',
  goalValue:     '',
  timeline:      '',
  skillLevel:    '',
  currentSkills: [],
  setupDone:     false,
};

const DEFAULT_STATS = {
  roadmapProgress: 0,
  reviewsDone:     0,
  interviewsDone:  0,
  ideasGenerated:  0,
  aiSessions:      0,
};

/* ── Helpers ─────────────────────────────────────────────────── */
function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch { return fallback; }
}

/* ── Provider ────────────────────────────────────────────────── */
export function AppProvider({ children }) {

  /* API Key */
  const [apiKey, setApiKeyState] = useState(
    () => localStorage.getItem('devpath:apiKey') || ''
  );
  const setApiKey = useCallback((key) => {
    const k = key.trim();
    setApiKeyState(k);
    localStorage.setItem('devpath:apiKey', k);
  }, []);

  /* Profile */
  const [profile, setProfileState] = useState(
    () => readJSON('devpath:profile', DEFAULT_PROFILE)
  );
  const updateProfile = useCallback((patch) => {
    setProfileState(prev => {
      const next = { ...prev, ...patch };
      localStorage.setItem('devpath:profile', JSON.stringify(next));
      return next;
    });
  }, []);

  /* Active page (SPA router) */
  const [activePage, setActivePage] = useState('dashboard');

  const navigate = useCallback((page) => {
    setActivePage(page);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [stats, setStats] = useState(DEFAULT_STATS);
  const incrementStat = useCallback((key, by = 1) => {
    setStats(prev => ({ ...prev, [key]: (prev[key] || 0) + by }));
  }, []);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarCollapsed(p => !p), []);

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AppContext.Provider value={{
      apiKey,
      setApiKey,
      hasKey: Boolean(apiKey),

      profile,
      updateProfile,

      activePage,
      navigate,

      stats,
      incrementStat,

      sidebarCollapsed,
      toggleSidebar,
      mobileOpen,
      setMobileOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

/** useApp — access app state anywhere in the component tree */
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}