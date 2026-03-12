import { useState }  from 'react';
import { useApp }    from '../context/AppContext';
import { useClaude } from '../hooks/useClaude';
import { PROMPTS }   from '../utils/claudeApi';
import PageHeader    from '../components/shared/PageHeader';
import Card          from '../components/ui/Card';
import Button        from '../components/ui/Button';
import AIResponse    from '../components/ui/AIResponse';
import './PortfolioAnalyzer.css';

const FOCUS_OPTIONS = [
  { v:'full',     l:'Full Analysis',    d:'Complete recruiter review' },
  { v:'bio',      l:'Bio & About',      d:'Improve your intro'       },
  { v:'projects', l:'Projects',         d:'Are your projects compelling?' },
  { v:'ats',      l:'ATS / Keywords',   d:'Pass automated screening' },
  { v:'missing',  l:"What's Missing",   d:'Gap analysis'             },
];

const EXAMPLE = `Name: Alex Chen
Target: Junior Frontend Developer
Experience: Self-taught, 8 months

Bio:
I love building things on the web. I know React and I'm looking for my first dev job.

Projects:
1. Todo App: React + localStorage
2. Weather App: fetches from OpenWeatherMap API
3. My Portfolio: HTML/CSS/JS

Skills: HTML, CSS, JavaScript, React, Git
GitHub: github.com/alexchen`;

const RECRUITER_TIPS = [
  'Specific project descriptions not "a todo app" but what problem it solves',
  'Quantified impact ("reduced load time 40%" not "fast app")',
  'Live demo links alongside every GitHub repo',
  'Professional headshot and real, specific bio',
  'Show progression  beginner projects are fine if framed well',
  'Keywords matching your target job descriptions (for ATS)',
];

export default function PortfolioAnalyzer() {
  const { hasKey, navigate } = useApp();
  const { ask, loading, result, error, reset } = useClaude();

  const [content,  setContent]  = useState('');
  const [role,     setRole]     = useState('');
  const [exp,      setExp]      = useState('0-1');
  const [focus,    setFocus]    = useState('full');

  async function analyze() {
    if (!content.trim()) return;
    const f = FOCUS_OPTIONS.find(o => o.v === focus);
    const prompt = `
Analyze this developer portfolio.
Focus: ${f?.l} — ${f?.d}
Target role: ${role || 'Junior Developer'}
Experience: ${exp} years

PORTFOLIO:
---
${content}
---
Give honest, specific, actionable feedback. Help this developer get hired.`.trim();
    await ask(prompt, PROMPTS.portfolio);
  }

  return (
    <div className="page pa-page">
      <PageHeader
        icon="⌥"
        title="Portfolio Review"
        subtitle="Get an honest recruiter's analysis score, gap list, and a rewritten bio."
        badge="AI Review"
        actions={!hasKey && <Button variant="secondary" size="sm" onClick={() => navigate('settings')}>Add API Key →</Button>}
      />

      <div className="pa-layout">

        {/* ── Input ── */}
        <div className="pa-input">
          <Card pad="lg">
            <div className="pa-card-head">
              <h2 className="pa-form-title">Your Portfolio</h2>
              {!content && <Button variant="ghost" size="sm" onClick={() => setContent(EXAMPLE)}>Load Example</Button>}
            </div>

            <div className="field" style={{ marginBottom:'var(--sp-4)' }}>
              <label className="label" htmlFor="pa-content">Portfolio Description</label>
              <textarea id="pa-content" className="textarea pa-textarea"
                placeholder={`Paste your portfolio here:\n• Bio / about section\n• Projects with descriptions\n• Skills and tech stack\n• GitHub / portfolio links\n• Role you're targeting\n\nMore detail = better feedback.`}
                value={content} onChange={e => setContent(e.target.value)} rows={14} />
              <div className="pa-char-count">
                {content.length} chars
                {content.length > 50 && content.length < 250 && (
                  <span style={{ color:'var(--color-warning)' }}> · More detail helps</span>
                )}
              </div>
            </div>

            <div className="field-row" style={{ marginBottom:'var(--sp-4)' }}>
              <div className="field">
                <label className="label" htmlFor="pa-role">Target Role</label>
                <input id="pa-role" className="input" type="text"
                  placeholder="e.g. Junior React Developer"
                  value={role} onChange={e => setRole(e.target.value)} />
              </div>
              <div className="field">
                <label className="label" htmlFor="pa-exp">Experience</label>
                <select id="pa-exp" className="select" value={exp} onChange={e => setExp(e.target.value)}>
                  <option value="0">No experience (self-taught)</option>
                  <option value="0-1">Less than 1 year</option>
                  <option value="1-2">1–2 years</option>
                  <option value="2-3">2–3 years</option>
                  <option value="3+">3+ years</option>
                </select>
              </div>
            </div>

            <div className="field" style={{ marginBottom:'var(--sp-5)' }}>
              <label className="label">Review Focus</label>
              <div className="pa-focus-grid">
                {FOCUS_OPTIONS.map(o => (
                  <button key={o.v}
                    className={`pa-focus ${focus === o.v ? 'pa-focus-on' : ''}`}
                    onClick={() => setFocus(o.v)} title={o.d}
                    type="button" aria-pressed={focus === o.v}>
                    <span className="pa-focus-label">{o.l}</span>
                    <span className="pa-focus-desc">{o.d}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pa-actions">
              {result && <Button variant="ghost" size="md" onClick={reset}>Clear</Button>}
              <Button variant="brand" size="lg" icon="⌥" loading={loading}
                disabled={!content.trim() || !hasKey} onClick={analyze}>
                {hasKey ? 'Analyze My Portfolio' : 'Add API Key in Settings'}
              </Button>
            </div>
          </Card>

          {/* Tips card */}
          {!result && (
            <Card pad="md" variant="flat" className="pa-tips-card">
              <h3 className="pa-tips-title">💼 What recruiters look for</h3>
              {RECRUITER_TIPS.map(t => (
                <div key={t} className="pa-tip">
                  <span className="pa-tip-check">✓</span>
                  <span className="pa-tip-text">{t}</span>
                </div>
              ))}
            </Card>
          )}
        </div>

        {/* ── Output ── */}
        <div className="pa-output">
          {(loading || result || error) ? (
            <>
              <div className="pa-output-head">
                <h3 className="pa-output-title">Recruiter Feedback</h3>
                {result && (
                  <Button variant="ghost" size="sm" icon="⎘"
                    onClick={() => navigator.clipboard.writeText(result)}>
                    Copy
                  </Button>
                )}
              </div>
              <AIResponse loading={loading} error={error} content={result} title="Portfolio Analysis" />
            </>
          ) : (
            <div className="pa-placeholder">
              <div className="pa-ph-icon anim-float" aria-hidden="true">⌥</div>
              <h3 className="pa-ph-title">Know your score</h3>
              <p className="pa-ph-sub">Claude reviews your portfolio like an actual recruiter — scoring it, finding gaps, and rewriting your bio.</p>
              <div className="pa-score-bars">
                {[['First Impression','80%'],['Project Quality','60%'],['Missing Elements','40%']].map(([l,w])=>(
                  <div key={l} className="pa-score-row">
                    <span className="pa-score-label">{l}</span>
                    <div className="progress"><div className="progress-fill skeleton" style={{width:w}} /></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}