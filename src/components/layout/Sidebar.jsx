import { useApp }              from '../../context/AppContext';
import { NAV_ITEMS, NAV_GROUPS } from '../../utils/constants';
import './Sidebar.css';

export default function Sidebar() {
  const { activePage, navigate, sidebarCollapsed, mobileOpen, setMobileOpen } = useApp();

  // Group nav items by their .group property
  const groups = NAV_ITEMS.reduce((acc, item) => {
    (acc[item.group] ??= []).push(item);
    return acc;
  }, {});

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="sb-overlay"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          'sb',
          sidebarCollapsed ? 'sb-mini' : '',
          mobileOpen       ? 'sb-open' : '',
        ].filter(Boolean).join(' ')}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="sb-logo">
          <div className="sb-logo-mark" aria-hidden="true">⌨</div>
          {!sidebarCollapsed && (
            <div className="sb-logo-text">
              <span className="sb-brand">DevPath</span>
              <span className="sb-badge">AI</span>
            </div>
          )}
        </div>

        <div className="sb-rule" role="separator" />

        {/* Nav groups */}
        <nav className="sb-nav">
          {Object.entries(groups).map(([group, items]) => (
            <div key={group} className="sb-group">
              {!sidebarCollapsed && (
                <span className="sb-group-label">{NAV_GROUPS[group]}</span>
              )}
              <ul>
                {items.map(item => {
                  const active = activePage === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        className={`sb-item ${active ? 'sb-item-active' : ''}`}
                        onClick={() => navigate(item.id)}
                        title={sidebarCollapsed ? item.label : undefined}
                        aria-current={active ? 'page' : undefined}
                      >
                        <span className="sb-item-icon" aria-hidden="true">{item.icon}</span>
                        {!sidebarCollapsed && (
                          <span className="sb-item-label">{item.label}</span>
                        )}
                        {active && <span className="sb-item-pip" aria-hidden="true" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        {!sidebarCollapsed && (
          <div className="sb-foot">
            <span className="sb-foot-text">Powered by Claude AI</span>
          </div>
        )}
      </aside>
    </>
  );
}