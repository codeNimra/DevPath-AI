import { mdToHtml } from '../../utils/helpers';
import './AIResponse.css';

export default function AIResponse({
  loading   = false,
  error     = null,
  content   = '',
  title     = 'AI Response',
  className = '',
}) {
  if (!loading && !error && !content) return null;

  return (
    <div className={[
      'air',
      loading ? 'air-loading' : '',
      error   ? 'air-error'   : '',
      className,
    ].filter(Boolean).join(' ')}>

      {/* ── Header bar ── */}
      <div className="air-head">
        <span className="air-dot" aria-hidden="true" />
        <span className="air-title">
          {error ? '⚠ Error' : loading ? 'Claude is thinking…' : `✦ ${title}`}
        </span>
        {loading && <span className="air-spin" aria-label="Loading" />}
      </div>

      {/* ── Body ── */}
      <div className="air-body">

        {/* Skeleton placeholders */}
        {loading && (
          <div className="air-skeletons">
            {[82, 68, 90, 55].map((w, i) => (
              <div key={i} className="skeleton" style={{ height: 13, width: `${w}%` }} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <p className="air-error-msg">{error}</p>
        )}

        {/* Content */}
        {!loading && !error && content && (
          <div
            className="air-content"
            dangerouslySetInnerHTML={{ __html: mdToHtml(content) }}
          />
        )}
      </div>
    </div>
  );
}