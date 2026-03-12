import { useState }  from 'react';
import { useApp }    from '../context/AppContext';
import { useClaude } from '../hooks/useClaude';
import { PROMPTS }   from '../utils/claudeApi';
import { LANGUAGES } from '../utils/constants';
import PageHeader    from '../components/shared/PageHeader';
import Card          from '../components/ui/Card';
import Button        from '../components/ui/Button';
import AIResponse    from '../components/ui/AIResponse';
import './CodeReview.css';

const REVIEW_TYPES = [
  { v:'full',     l:'Full Review',      d:'Bugs, quality, best practices' },
  { v:'bugs',     l:'Bug Hunt',         d:'Find and fix errors only'       },
  { v:'optimize', l:'Optimise',         d:'Performance improvements'       },
  { v:'explain',  l:'Explain Code',     d:'Line-by-line explanation'       },
  { v:'security', l:'Security Audit',   d:'Find vulnerabilities'           },
];

const SAMPLE = `// Paste your code here...
function fetchUser(id) {
  var data = null
  fetch('/api/user/' + id)
    .then(r => r.json())
    .then(j => data = j)
  return data  // ← bug: always null
}`;

export default function CodeReview() {
  const { incrementStat, hasKey, navigate } = useApp();
  const { ask, loading, result, error, reset } = useClaude();

  const [code,    setCode]    = useState('');
  const [lang,    setLang]    = useState('JavaScript');
  const [rtype,   setRtype]   = useState('full');
  const [context, setContext] = useState('');
  const [copied,  setCopied]  = useState(false);

  async function review() {
    const rt = REVIEW_TYPES.find(r => r.v === rtype);
    const prompt = `
Review this ${lang} code.
Focus: ${rt?.l} — ${rt?.d}
${context ? `Context: ${context}` : ''}

\`\`\`${lang.toLowerCase()}
${code}
\`\`\`
Provide a thorough, educational review. Reference line numbers where helpful.`.trim();

    const text = await ask(prompt, PROMPTS.codeReview);
    if (text) incrementStat('reviewsDone');
  }

  function copy() {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="page cr-page">
      <PageHeader
        icon="✦"
        title="Code Review"
        subtitle="Paste any code — get structured senior-developer feedback with fixes and learning tips."
        badge="AI Powered"
        actions={!hasKey && <Button variant="secondary" size="sm" onClick={() => navigate('settings')}>Add API Key →</Button>}
      />

      <div className="cr-layout">

        {/* ── Input panel ── */}
        <div className="cr-input">
          <Card pad="none" className="cr-editor-card">
            {/* Toolbar */}
            <div className="cr-toolbar">
              <select className="select cr-lang-select" value={lang}
                onChange={e => setLang(e.target.value)} aria-label="Language">
                {LANGUAGES.map(l => <option key={l}>{l}</option>)}
              </select>
              <span className="cr-chars">{code.length} chars</span>
              {code && <button className="cr-clear" onClick={() => setCode('')} aria-label="Clear">✕ Clear</button>}
            </div>

            {/* Code textarea */}
            <textarea
              className="cr-editor"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder={SAMPLE}
              spellCheck={false}
              aria-label="Code to review"
            />
          </Card>

          {/* Review type chips */}
          <div className="cr-types">
            {REVIEW_TYPES.map(r => (
              <button key={r.v}
                className={`cr-type-chip ${rtype === r.v ? 'cr-type-on' : ''}`}
                onClick={() => setRtype(r.v)} title={r.d}
                aria-pressed={rtype === r.v} type="button">
                {r.l}
              </button>
            ))}
          </div>

          {/* Context */}
          <div className="field">
            <label className="label" htmlFor="cr-ctx">
              Context <span className="label-hint">(optional — what does this code do?)</span>
            </label>
            <input id="cr-ctx" className="input" type="text"
              placeholder="e.g. React hook that fetches user data on mount"
              value={context} onChange={e => setContext(e.target.value)} />
          </div>

          {/* Submit */}
          <div className="cr-submit">
            {result && <Button variant="ghost" size="md" onClick={() => { reset(); setCode(''); }}>New Review</Button>}
            <Button variant="brand" size="lg" icon="✦" loading={loading}
              disabled={!code.trim() || !hasKey} onClick={review}
              fullWidth={!result}>
              {hasKey ? 'Review My Code' : 'Add API Key in Settings'}
            </Button>
          </div>
        </div>

        {/* ── Output panel ── */}
        <div className="cr-output">
          {(loading || result || error) ? (
            <>
              <div className="cr-output-head">
                <h3 className="cr-output-title">Review Results</h3>
                {result && (
                  <Button variant="ghost" size="sm" onClick={copy} icon={copied ? '✓' : '⎘'}>
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                )}
              </div>
              <AIResponse loading={loading} error={error} content={result} title="Senior Dev Review" />
            </>
          ) : (
            <div className="cr-placeholder">
              <div className="cr-ph-icon" aria-hidden="true">✦</div>
              <p className="cr-ph-title">Your review appears here</p>
              <p className="cr-ph-sub">Paste code → choose review type → click Review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}