import './PageHeader.css';

export default function PageHeader({ icon, title, subtitle, badge, actions, className = '' }) {
  return (
    <header className={`ph ${className}`} role="banner">
      <div className="ph-left">
        {icon && <div className="ph-icon" aria-hidden="true">{icon}</div>}
        <div className="ph-text">
          <div className="ph-title-row">
            <h1 className="ph-title">{title}</h1>
            {badge && <span className="chip chip-cyan">{badge}</span>}
          </div>
          {subtitle && <p className="ph-subtitle">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="ph-actions">{actions}</div>}
    </header>
  );
}