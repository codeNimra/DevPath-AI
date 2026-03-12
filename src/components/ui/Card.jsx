import './Card.css';

export default function Card({
  children,
  variant   = 'default',
  pad       = 'md',
  hover     = false,
  glow      = false,
  onClick,
  className = '',
  ...rest
}) {
  const cls = [
    'card',
    `card-${variant}`,
    `card-pad-${pad}`,
    hover   ? 'card-hover'     : '',
    glow    ? 'card-glow'      : '',
    onClick ? 'card-clickable' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={cls} onClick={onClick} {...rest}>
      {children}
    </div>
  );
}

Card.Header = ({ children, className = '' }) => (
  <div className={`card-header ${className}`}>{children}</div>
);

Card.Body = ({ children, className = '' }) => (
  <div className={`card-body ${className}`}>{children}</div>
);

Card.Footer = ({ children, className = '' }) => (
  <div className={`card-footer ${className}`}>{children}</div>
);