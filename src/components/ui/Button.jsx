import './Button.css';

export default function Button({
  children,
  variant   = 'primary',
  size      = 'md',
  loading   = false,
  disabled  = false,
  fullWidth = false,
  icon      = null,
  iconRight = null,
  className = '',
  type      = 'button',
  onClick,
  ...rest
}) {
  const cls = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full' : '',
    loading   ? 'btn-loading' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={cls}
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading}
      {...rest}
    >
      {loading
        ? <span className="btn-spinner" aria-hidden="true" />
        : icon && <span className="btn-icon" aria-hidden="true">{icon}</span>
      }
      {children && <span className="btn-text">{children}</span>}
      {!loading && iconRight && <span className="btn-icon" aria-hidden="true">{iconRight}</span>}
    </button>
  );
}