import { useApp }   from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import './Topbar.css';

const TITLES = {
  dashboard:  ['⌂',  'Dashboard'],
  goalsetup:  ['◎',  'Goal Setup'],
  roadmap:    ['⟶',  'My Roadmap'],
  codereview: ['✦',  'Code Review'],
  interview:  ['⬡',  'Mock Interview'],
  projects:   ['◈',  'Project Ideas'],
  portfolio:  ['⌥',  'Portfolio Review'],
  settings:   ['⚙',  'Settings'],
};

export default function Topbar() {
  const { activePage, toggleSidebar, sidebarCollapsed, hasKey, setMobileOpen } = useApp();
  const { isDark, toggleTheme } = useTheme();

  const [icon, label] = TITLES[activePage] ?? ['◆', activePage];

  return (
    <header className="tb" role="banner">

      {/* Left — toggle + breadcrumb */}
      <div className="tb-left">
        <button
          className="tb-btn hide-sm"
          onClick={toggleSidebar}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label="Toggle sidebar"
        >
          {sidebarCollapsed ? '»' : '«'}
        </button>

        <button
          className="tb-btn show-sm"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          ☰
        </button>

        <div className="tb-crumb">
          <span className="tb-crumb-root">DevPath</span>
          <span className="tb-crumb-sep" aria-hidden="true">/</span>
          <span className="tb-crumb-page" aria-current="page">
            <span aria-hidden="true">{icon} </span>{label}
          </span>
        </div>
      </div>

      {/* Right — status + theme */}
      <div className="tb-right">
        <div
          className={`tb-status ${hasKey ? 'tb-status-ok' : 'tb-status-warn'}`}
          title={hasKey ? 'Claude API connected' : 'Add API key in Settings'}
        >
          <span className="tb-status-dot" aria-hidden="true" />
          <span className="tb-status-label hide-sm">
            {hasKey ? 'AI Ready' : 'No Key'}
          </span>
        </div>

        <button
          className="tb-btn tb-theme-btn"
          onClick={toggleTheme}
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          {isDark ? '☀' : '◑'}
        </button>
      </div>
    </header>
  );
}