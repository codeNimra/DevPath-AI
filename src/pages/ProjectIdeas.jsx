import { useState }     from 'react';
import { useApp }       from '../context/AppContext';
import { useClaude }    from '../hooks/useClaude';
import { PROMPTS }      from '../utils/claudeApi';
import { DEV_GOALS, LEVELS } from '../utils/constants';
import PageHeader       from '../components/shared/PageHeader';
import Card             from '../components/ui/Card';
import Button           from '../components/ui/Button';
import AIResponse       from '../components/ui/AIResponse';
import './ProjectIdeas.css';

const TYPES = [
  { v:'portfolio', l:'Portfolio',     i:'◈' },
  { v:'practical', l:'Real Problem',  i:'◎' },
  { v:'fullstack', l:'Full-Stack',    i:'⟶' },
  { v:'api',       l:'API / Data',    i:'⌥' },
  { v:'tool',      l:'Dev Tool',      i:'⚙' },
  { v:'game',      l:'Game / Fun',    i:'⬡' },
];

export default function ProjectIdeas() {
  const { profile, incrementStat, hasKey, navigate } = useApp();
  const { ask, loading, result, error, reset }        = useClaude();

  const [form, setForm] = useState({
    skills:   profile.currentSkills?.join(', ') || '',
    goal:     profile.goalValue || '',
    level:    profile.skillLevel || '',
    type:     'portfolio',
    interests:'',
    solo:     true,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function generate() {
    const goalLabel  = DEV_GOALS.find(g => g.value === form.goal)?.label  || 'general developer';
    const levelLabel = LEVELS.find(l => l.value === form.level)?.label    || 'beginner';
    const typeLabel  = TYPES.find(t => t.v === form.type)?.l              || 'portfolio';

    const prompt = `
Generate exactly 5 portfolio-worthy project ideas for:
• Goal: ${goalLabel}
• Level: ${levelLabel}
• Skills: ${form.skills || 'HTML, CSS, JavaScript basics'}
• Interests: ${form.interests || 'open to anything'}
• Type preference: ${typeLabel}
• Building: ${form.solo ? 'Solo project' : 'Team project'}

For EACH idea use this structure:
**PROJECT N: [CATCHY TITLE]**
CONCEPT: (one sentence — what it does and who uses it)
PROBLEM IT SOLVES: (why this matters)
FEATURES TO BUILD: (3-5 bullet points with implementation hints)
TECH STACK: (exact tools, no vague "a framework")
DIFFICULTY: Beginner / Intermediate / Advanced
TIME ESTIMATE: X weeks at Y hrs/week
WHY RECRUITERS NOTICE THIS: (one sentence)
FIRST 3 STEPS: (concrete implementation steps to start today)

Rank easiest to hardest. Make them genuinely useful and impressive.`.trim();

    const text = await ask(prompt, PROMPTS.projectIdeas);
    if (text) incrementStat('ideasGenerated');
  }

  return (
    <div className="page pi-page">
      <PageHeader
        icon="◈"
        title="Project Ideas"
        subtitle="Describe your skills. Claude generates 5 portfolio-worthy projects with full build breakdowns."
        badge="AI Generator"
        actions={!hasKey && <Button variant="secondary" size="sm" onClick={() => navigate('settings')}>Add API Key →</Button>}
      />

      <div className="pi-layout">

        {/* ── Input panel ── */}
        <div className="pi-input">
          <Card pad="lg">
            <h2 className="pi-form-title">About you</h2>

            <div className="pi-form">
              <div className="field">
                <label className="label" htmlFor="pi-skills">Your Current Skills</label>
                <input id="pi-skills" className="input" type="text"
                  placeholder="e.g. HTML, CSS, JavaScript, React basics"
                  value={form.skills} onChange={e => set('skills', e.target.value)} />
              </div>

              <div className="field-row">
                <div className="field">
                  <label className="label" htmlFor="pi-goal">Goal</label>
                  <select id="pi-goal" className="select" value={form.goal} onChange={e => set('goal', e.target.value)}>
                    <option value="">Any goal</option>
                    {DEV_GOALS.map(g => <option key={g.value} value={g.value}>{g.icon} {g.label}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label className="label" htmlFor="pi-level">Level</label>
                  <select id="pi-level" className="select" value={form.level} onChange={e => set('level', e.target.value)}>
                    <option value="">Any level</option>
                    {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="field">
                <label className="label" htmlFor="pi-interests">
                  Interests <span className="label-hint">(optional)</span>
                </label>
                <input id="pi-interests" className="input" type="text"
                  placeholder="e.g. music, fitness, productivity, gaming"
                  value={form.interests} onChange={e => set('interests', e.target.value)} />
              </div>

              <div className="field">
                <label className="label">Project Type</label>
                <div className="pi-types">
                  {TYPES.map(t => (
                    <button key={t.v}
                      className={`pi-type ${form.type === t.v ? 'pi-type-on' : ''}`}
                      onClick={() => set('type', t.v)} type="button" aria-pressed={form.type === t.v}>
                      <span aria-hidden="true">{t.i}</span> {t.l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label className="label">Building as</label>
                <div className="pi-solo-toggle">
                  {[{ v:true, l:'👤 Solo' }, { v:false, l:'👥 Team' }].map(opt => (
                    <button key={String(opt.v)}
                      className={`pi-solo-btn ${form.solo === opt.v ? 'pi-solo-on' : ''}`}
                      onClick={() => set('solo', opt.v)} type="button">
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pi-actions">
              {result && <Button variant="ghost" size="md" onClick={reset}>Reset</Button>}
              <Button variant="brand" size="lg" icon="◈" loading={loading}
                disabled={!hasKey} onClick={generate} fullWidth={!result}>
                {hasKey ? 'Generate 5 Ideas' : 'Add API Key in Settings'}
              </Button>
            </div>
          </Card>
        </div>

        {/* ── Output panel ── */}
        <div className="pi-output">
          {(loading || result || error) ? (
            <AIResponse loading={loading} error={error} content={result} title="5 Portfolio-Worthy Project Ideas" />
          ) : (
            <div className="pi-placeholder">
              <div className="pi-ph-icon anim-float" aria-hidden="true">◈</div>
              <h3 className="pi-ph-title">5 ideas, instantly</h3>
              <p className="pi-ph-sub">Tailored to your skill level, goal, and interests — with full tech stacks and getting-started steps.</p>
              <div className="pi-features">
                {['✓ Matched to your exact level','✓ Full tech stack included','✓ Getting-started steps','✓ Why recruiters notice it','✓ Realistic time estimates']
                  .map(f => <div key={f} className="pi-feat">{f}</div>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}