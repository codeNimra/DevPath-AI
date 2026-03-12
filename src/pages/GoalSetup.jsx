import { useState }                       from 'react';
import { useApp }                         from '../context/AppContext';
import { useClaude }                      from '../hooks/useClaude';
import { PROMPTS }                        from '../utils/claudeApi';
import { DEV_GOALS, TIMELINES, LEVELS, COMMON_SKILLS } from '../utils/constants';
import PageHeader                         from '../components/shared/PageHeader';
import Card                               from '../components/ui/Card';
import Button                             from '../components/ui/Button';
import AIResponse                         from '../components/ui/AIResponse';
import './GoalSetup.css';

export default function GoalSetup() {
  const { updateProfile, profile, navigate, incrementStat } = useApp();
  const { ask, loading, result, error, reset }              = useClaude();

  const [step, setStep]   = useState(result ? 3 : 1);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name:          profile.name         || '',
    goalValue:     profile.goalValue    || '',
    timeline:      profile.timeline     || '',
    skillLevel:    profile.skillLevel   || '',
    skills:        profile.currentSkills || [],
    extraSkills:   '',
    motivation:    '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleSkill = (s) =>
    set('skills', form.skills.includes(s)
      ? form.skills.filter(x => x !== s)
      : [...form.skills, s]);

  async function generate() {
    const allSkills = [
      ...form.skills,
      ...form.extraSkills.split(',').map(s => s.trim()).filter(Boolean),
    ];
    const goalLabel  = DEV_GOALS.find(g => g.value === form.goalValue)?.label  || form.goalValue;
    const timeLabel  = TIMELINES.find(t => t.value === form.timeline)?.label   || form.timeline;
    const levelLabel = LEVELS.find(l => l.value === form.skillLevel)?.label    || form.skillLevel;

    const prompt = `
Create a detailed developer roadmap for:
• Name: ${form.name || 'Developer'}
• Goal: ${goalLabel}
• Timeline: ${timeLabel}
• Current level: ${levelLabel}
• Already knows: ${allSkills.join(', ') || 'nothing yet'}
• Motivation: ${form.motivation || 'career growth'}

Include: Phase overview, Phase 1 Foundation, Phase 2 Core Skills, Phase 3 Advanced, Phase 4 Job-Ready, Key Resources, Daily Routine, First Steps This Week.
Be specific — name real tools, websites, and project ideas.`.trim();

    setStep(3);
    const text = await ask(prompt, PROMPTS.roadmap);
    if (text) incrementStat('aiSessions');
  }

  function save() {
    const allSkills = [
      ...form.skills,
      ...form.extraSkills.split(',').map(s => s.trim()).filter(Boolean),
    ];
    updateProfile({
      name:          form.name,
      goal:          DEV_GOALS.find(g => g.value === form.goalValue)?.label || form.goalValue,
      goalValue:     form.goalValue,
      timeline:      form.timeline,
      skillLevel:    form.skillLevel,
      currentSkills: allSkills,
      setupDone:     true,
    });
    setSaved(true);
    setTimeout(() => navigate('roadmap'), 1200);
  }

  const step1OK = form.name && form.goalValue && form.timeline && form.skillLevel;

  return (
    <div className="page gs-page">
      <PageHeader
        icon="◎"
        title="Goal Setup"
        subtitle="Answer 3 quick questions. Claude generates your personalized roadmap."
        badge={`Step ${step} / 3`}
      />

      {/* Step indicator */}
      <div className="gs-steps" role="list">
        {['Your Info', 'Your Skills', 'Your Roadmap'].map((label, i) => (
          <div key={label} className="gs-step-wrap" role="listitem">
            <div className={`gs-step ${step > i ? 'gs-done' : ''} ${step === i+1 ? 'gs-active' : ''}`}>
              <div className="gs-step-num">{step > i+1 ? '✓' : i+1}</div>
              <span className="gs-step-label hide-sm">{label}</span>
            </div>
            {i < 2 && <div className={`gs-connector ${step > i+1 ? 'gs-connector-done' : ''}`} aria-hidden="true" />}
          </div>
        ))}
      </div>

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <Card pad="lg" className="anim-fade-up">
          <h2 className="gs-section-title">Tell us about yourself</h2>
          <div className="gs-form">
            <div className="field">
              <label className="label" htmlFor="gs-name">Your Name</label>
              <input id="gs-name" className="input" type="text" placeholder="e.g. Alex"
                value={form.name} onChange={e => set('name', e.target.value)} autoComplete="given-name" />
            </div>
            <div className="field">
              <label className="label" htmlFor="gs-goal">Developer Goal</label>
              <select id="gs-goal" className="select" value={form.goalValue} onChange={e => set('goalValue', e.target.value)}>
                <option value="">— Choose your goal —</option>
                {DEV_GOALS.map(g => <option key={g.value} value={g.value}>{g.icon} {g.label}</option>)}
              </select>
            </div>
            <div className="field-row">
              <div className="field">
                <label className="label" htmlFor="gs-timeline">Timeline</label>
                <select id="gs-timeline" className="select" value={form.timeline} onChange={e => set('timeline', e.target.value)}>
                  <option value="">— How long? —</option>
                  {TIMELINES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="label" htmlFor="gs-level">Current Level</label>
                <select id="gs-level" className="select" value={form.skillLevel} onChange={e => set('skillLevel', e.target.value)}>
                  <option value="">— Where are you? —</option>
                  {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="gs-motivation">
                Motivation <span className="label-hint">(optional)</span>
              </label>
              <input id="gs-motivation" className="input" type="text"
                placeholder="e.g. Career change, get a remote job, build my startup"
                value={form.motivation} onChange={e => set('motivation', e.target.value)} />
            </div>
          </div>
          <div className="gs-actions">
            <Button variant="primary" size="lg" disabled={!step1OK}
              onClick={() => setStep(2)} iconRight="→">
              Next: Your Skills
            </Button>
          </div>
        </Card>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <Card pad="lg" className="anim-fade-up">
          <h2 className="gs-section-title">What do you already know?</h2>
          <p className="gs-subtitle">Select every technology you're comfortable with. Claude will skip what you know.</p>
          <div className="gs-skills-grid">
            {COMMON_SKILLS.map(s => (
              <button key={s}
                className={`gs-skill ${form.skills.includes(s) ? 'gs-skill-on' : ''}`}
                onClick={() => toggleSkill(s)} type="button" aria-pressed={form.skills.includes(s)}>
                {form.skills.includes(s) && <span aria-hidden="true">✓ </span>}{s}
              </button>
            ))}
          </div>
          <div className="field" style={{ marginTop:'var(--sp-5)' }}>
            <label className="label" htmlFor="gs-extra">
              Other skills <span className="label-hint">(comma separated)</span>
            </label>
            <input id="gs-extra" className="input" type="text"
              placeholder="e.g. Rust, Unity, Blender, Three.js"
              value={form.extraSkills} onChange={e => set('extraSkills', e.target.value)} />
          </div>
          <div className="gs-actions">
            <Button variant="ghost" size="md" onClick={() => setStep(1)}>← Back</Button>
            <Button variant="brand" size="lg" loading={loading} icon="✦" onClick={generate}>
              Generate My Roadmap
            </Button>
          </div>
        </Card>
      )}

      {/* ── STEP 3 ── */}
      {step === 3 && (
        <div className="anim-fade-up">
          <AIResponse loading={loading} error={error} content={result} title="Your Personalized Roadmap" />
          {result && !loading && (
            <div className="gs-actions gs-actions-top">
              <Button variant="ghost" size="md" onClick={() => { reset(); setStep(2); }}>← Regenerate</Button>
              <Button variant="primary" size="lg" icon={saved ? '✓' : '◎'} onClick={save} disabled={saved}>
                {saved ? 'Saved! Redirecting…' : 'Save Goal & Continue'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}