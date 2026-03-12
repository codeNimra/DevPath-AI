import { useState }    from 'react';
import { useApp }      from '../context/AppContext';
import { useClaude }   from '../hooks/useClaude';
import { PROMPTS }     from '../utils/claudeApi';
import PageHeader      from '../components/shared/PageHeader';
import Card            from '../components/ui/Card';
import Button          from '../components/ui/Button';
import AIResponse      from '../components/ui/AIResponse';
import './Roadmap.css';

const QUICK_QS = [
  'What should I focus on in week 1?',
  'Recommend the best free resources for my goal',
  'What projects should I build at each phase?',
  'How many hours per day should I study?',
  'What are the most common beginner mistakes?',
  'How do I stay consistent and avoid burnout?',
];

const RESOURCES_BY_GOAL = {
  frontend:   [{ icon:'⚛️', t:'React Official Docs',    k:'Docs',     u:'https://react.dev' }],
  backend:    [{ icon:'🟢', t:'Node.js Docs',            k:'Docs',     u:'https://nodejs.org/docs' }],
  fullstack:  [{ icon:'🔄', t:'Full Stack Open (FREE)',  k:'Course',   u:'https://fullstackopen.com' }],
  ml:         [{ icon:'🤖', t:'fast.ai',                 k:'Course',   u:'https://fast.ai' }],
  data:       [{ icon:'📊', t:'Kaggle Learn',            k:'Practice', u:'https://kaggle.com/learn' }],
  devops:     [{ icon:'☁️', t:'AWS Free Tier',           k:'Practice', u:'https://aws.amazon.com/free' }],
  mobile:     [{ icon:'📱', t:'React Native Docs',       k:'Docs',     u:'https://reactnative.dev' }],
};

const BASE_RESOURCES = [
  { icon:'💻', t:'The Odin Project',        k:'Curriculum', u:'https://theodinproject.com'  },
  { icon:'🧩', t:'LeetCode',               k:'Practice',   u:'https://leetcode.com'         },
  { icon:'📚', t:'MDN Web Docs',           k:'Reference',  u:'https://developer.mozilla.org'},
  { icon:'📹', t:'freeCodeCamp YouTube',   k:'Videos',     u:'https://youtube.com/@freecodecamp'},
  { icon:'🐙', t:'GitHub Skills',          k:'Git',        u:'https://skills.github.com'    },
  { icon:'🌐', t:'freeCodeCamp.org',       k:'Interactive',u:'https://freecodecamp.org'     },
];

export default function Roadmap() {
  const { profile, navigate, hasKey } = useApp();
  const { ask, loading, result, error, reset } = useClaude();
  const [customQ,   setCustomQ]   = useState('');
  const [activeQ,   setActiveQ]   = useState(null);

  const ask_ = async (q) => {
    const question = q || customQ.trim();
    if (!question) return;
    setActiveQ(question);
    setCustomQ('');
    const ctx = `Developer profile — goal: ${profile.goal}, level: ${profile.skillLevel}, skills: ${profile.currentSkills?.join(', ')}.`;
    await ask(`${ctx}\n\nQuestion: "${question}"\n\nAnswer specifically for this person. Be practical.`, PROMPTS.roadmap);
  };

  const resources = [
    ...(RESOURCES_BY_GOAL[profile.goalValue] || []),
    ...BASE_RESOURCES,
  ].slice(0, 8);

  if (!profile.setupDone) return (
    <div className="page">
      <PageHeader icon="⟶" title="My Roadmap" subtitle="Set your goal first to generate your roadmap." />
      <Card variant="accent" pad="lg" className="anim-fade-up">
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'var(--sp-4)', textAlign:'center' }}>
          <span style={{ fontSize:40 }}>⟶</span>
          <h2 style={{ fontSize:'var(--text-xl)', fontWeight:'var(--w-black)' }}>No roadmap yet</h2>
          <p>Complete Goal Setup to generate your personalized learning plan.</p>
          <Button variant="primary" size="lg" icon="◎" onClick={() => navigate('goalsetup')}>Set Up My Goal</Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="page">
      <PageHeader
        icon="⟶"
        title="My Roadmap"
        subtitle={`${profile.goal} · ${profile.timeline || 'timeline not set'}`}
        badge={profile.skillLevel || 'Beginner'}
        actions={
          <Button variant="secondary" size="sm" onClick={() => navigate('goalsetup')}>⟳ Regenerate</Button>
        }
      />

      {/* Profile summary bar */}
      <div className="rm-profile-bar">
        {[
          { l:'Goal',   v: profile.goal },
          { l:'Level',  v: profile.skillLevel },
          { l:'Skills', v: profile.currentSkills?.length ? profile.currentSkills.slice(0,3).join(', ')+(profile.currentSkills.length>3?` +${profile.currentSkills.length-3}`:'') : 'None' },
        ].map((item, i, arr) => (
          <div key={item.l} className="rm-profile-item" style={{ display:'flex', gap: i < arr.length-1 ? 0 : undefined }}>
            <div>
              <div className="rm-profile-label">{item.l}</div>
              <div className="rm-profile-value">{item.v || '—'}</div>
            </div>
            {i < arr.length-1 && <div className="rm-profile-divider" />}
          </div>
        ))}
      </div>

      {/* Ask Claude section */}
      {hasKey && (
        <section className="rm-section">
          <p className="section-label">✦ Ask Claude About Your Roadmap</p>
          <div className="rm-quick-qs">
            {QUICK_QS.map(q => (
              <button key={q}
                className={`rm-q-chip ${activeQ === q ? 'rm-q-chip-active' : ''}`}
                onClick={() => ask_(q)} disabled={loading}>
                {q}
              </button>
            ))}
          </div>
          <div className="rm-ask-row">
            <input className="input" type="text" placeholder="Ask anything about your roadmap…"
              value={customQ} onChange={e => setCustomQ(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && ask_()} disabled={loading} />
            <Button variant="primary" size="md" loading={loading}
              disabled={!customQ.trim()} onClick={() => ask_()}>
              Ask
            </Button>
          </div>
          {(loading || result || error) && (
            <div className="rm-ai-result">
              {activeQ && !loading && <p className="rm-active-q">Q: {activeQ}</p>}
              <AIResponse loading={loading} error={error} content={result} title="Claude's Answer" />
              {result && <Button variant="ghost" size="sm" onClick={() => { reset(); setActiveQ(null); }}>Clear</Button>}
            </div>
          )}
        </section>
      )}

      {/* Resource library */}
      <section className="rm-section">
        <p className="section-label">◆ Curated Resources</p>
        <div className="rm-resources">
          {resources.map(r => (
            <a key={r.t} href={r.u} target="_blank" rel="noopener noreferrer" className="rm-resource">
              <span className="rm-resource-icon" aria-hidden="true">{r.icon}</span>
              <div className="rm-resource-body">
                <div className="rm-resource-title">{r.t}</div>
                <div className="rm-resource-kind">{r.k}</div>
              </div>
              <span className="rm-resource-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}