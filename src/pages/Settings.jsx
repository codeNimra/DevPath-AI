import { useState }          from 'react';
import { useApp }            from '../context/AppContext';
import { useTheme }          from '../context/ThemeContext';
import { askClaude }         from '../utils/claudeApi';
import { isValidApiKey }     from '../utils/helpers';
import PageHeader            from '../components/shared/PageHeader';
import Card                  from '../components/ui/Card';
import Button                from '../components/ui/Button';
import './Settings.css';

export default function Settings() {
  const { apiKey, setApiKey, hasKey, profile, navigate } = useApp();
  const { theme, toggleTheme }                           = useTheme();

  const [draft,    setDraft]    = useState(apiKey);
  const [visible,  setVisible]  = useState(false);
  const [testing,  setTesting]  = useState(false);
  const [testMsg,  setTestMsg]  = useState(null);  // { ok: bool, text: string }
  const [saved,    setSaved]    = useState(false);

  async function testKey() {
    if (!draft.trim()) return;
    setTesting(true);
    setTestMsg(null);
    try {
      const res = await askClaude(draft.trim(), 'Reply with exactly: DEVPATH_OK', '');
      if (res.includes('DEVPATH_OK')) {
        setTestMsg({ ok: true,  text: '✓ Connection successful! Your API key works.' });
      } else {
        setTestMsg({ ok: true,  text: '✓ Claude responded (key works).' });
      }
    } catch(e) {
      setTestMsg({ ok: false, text: `✗ ${e.message}` });
    }
    setTesting(false);
  }

  function saveKey() {
    setApiKey(draft.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const keyValid = isValidApiKey(draft.trim());

  return (
    <div className="page st-page">
      <PageHeader
        icon="⚙"
        title="Settings"
        subtitle="Configure your API key, profile, and preferences."
      />

      {/* ── API Key ── */}
      <Card pad="lg" className="st-card anim-fade-up delay-1">
        <Card.Header>
          <div>
            <h2 className="st-card-title">Claude API Key</h2>
            <p className="st-card-sub">Required for all AI features. Get yours at console.anthropic.com</p>
          </div>
          <div className={`st-status-pill ${hasKey ? 'st-status-ok' : 'st-status-warn'}`}>
            <span className="st-status-dot" aria-hidden="true" />
            {hasKey ? 'Connected' : 'Not set'}
          </div>
        </Card.Header>

        <div className="st-key-field">
          <div className="st-key-input-wrap">
            <input
              className="input st-key-input"
              type={visible ? 'text' : 'password'}
              placeholder="sk-ant-api03-…"
              value={draft}
              onChange={e => { setDraft(e.target.value); setTestMsg(null); setSaved(false); }}
              aria-label="Anthropic API key"
              autoComplete="off"
              spellCheck={false}
            />
            <button className="st-eye" onClick={() => setVisible(v => !v)}
              aria-label={visible ? 'Hide key' : 'Show key'}>
              {visible ? '◎' : '◉'}
            </button>
          </div>
          {draft && !keyValid && (
            <p className="st-key-warn">API keys start with <code>sk-ant-</code></p>
          )}
        </div>

        {testMsg && (
          <div className={`st-test-msg ${testMsg.ok ? 'st-test-ok' : 'st-test-err'}`}>
            {testMsg.text}
          </div>
        )}

        <div className="st-key-actions">
          <Button variant="secondary" size="md" loading={testing}
            disabled={!draft.trim()} onClick={testKey}>
            Test Connection
          </Button>
          <Button variant="primary" size="md" disabled={!keyValid || saved}
            icon={saved ? '✓' : undefined} onClick={saveKey}>
            {saved ? 'Saved!' : 'Save Key'}
          </Button>
        </div>

        <div className="st-key-note">
          <span aria-hidden="true">🔒 </span>
          Your key is stored only in your browser's localStorage. It never leaves your device.
        </div>
      </Card>

      {/* ── Profile ── */}
      <Card pad="lg" className="st-card anim-fade-up delay-2">
        <Card.Header>
          <div>
            <h2 className="st-card-title">Developer Profile</h2>
            <p className="st-card-sub">Set in Goal Setup. Used to personalise all AI features.</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate('goalsetup')}>
            {profile.setupDone ? 'Edit' : 'Set Up'}
          </Button>
        </Card.Header>

        {profile.setupDone ? (
          <div className="st-profile-grid">
            {[
              { l:'Name',     v: profile.name       },
              { l:'Goal',     v: profile.goal        },
              { l:'Level',    v: profile.skillLevel  },
              { l:'Timeline', v: profile.timeline    },
              { l:'Skills',   v: profile.currentSkills?.join(', ') || 'None' },
            ].map(row => (
              <div key={row.l} className="st-profile-row">
                <span className="st-profile-label">{row.l}</span>
                <span className="st-profile-value">{row.v || '—'}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="st-empty">No profile yet. Complete Goal Setup to personalise your experience.</p>
        )}
      </Card>

      {/* ── Appearance ── */}
      <Card pad="lg" className="st-card anim-fade-up delay-3">
        <h2 className="st-card-title" style={{ marginBottom:'var(--sp-4)' }}>Appearance</h2>
        <div className="st-theme-row">
          <div>
            <div className="st-theme-label">Theme</div>
            <div className="st-theme-current">{theme === 'dark' ? '🌙 Dark mode' : '☀️ Light mode'}</div>
          </div>
          <Button variant="secondary" size="md" onClick={toggleTheme}>
            Switch to {theme === 'dark' ? 'Light' : 'Dark'}
          </Button>
        </div>
      </Card>

      {/* ── About ── */}
      <Card pad="lg" variant="flat" className="st-card anim-fade-up delay-4">
        <h2 className="st-card-title" style={{ marginBottom:'var(--sp-4)' }}>About DevPath AI</h2>
        <div className="st-about">
          <div className="st-about-row"><span>Version</span><span>1.0.0 — DSOC 2026</span></div>
          <div className="st-about-row"><span>Tech stack</span><span>React 18 · Vite 5 · Pure CSS · Claude API</span></div>
          <div className="st-about-row"><span>AI model</span><span>claude-sonnet-4-20250514</span></div>
          <div className="st-about-row"><span>Themes</span><span>Software Dev · AI/ML · Business Management</span></div>
        </div>
      </Card>
    </div>
  );
}