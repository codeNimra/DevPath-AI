import { useState, useEffect } from 'react';
import { useApp }              from '../context/AppContext';
import { useClaude }           from '../hooks/useClaude';
import PageHeader              from '../components/shared/PageHeader';
import Card                    from '../components/ui/Card';
import Button                  from '../components/ui/Button';
import AIResponse              from '../components/ui/AIResponse';
import { today }               from '../utils/helpers';
import './Dashboard.css';

const ACTIONS = [
  { id:'goalsetup',  icon:'◎', title:'Goal Setup',       desc:'Tell Claude your goal — get a personalized week-by-week roadmap.',     accent:'#00E5FF', tag:'Start here'      },
  { id:'roadmap',    icon:'⟶', title:'My Roadmap',        desc:'Your AI learning plan with resources and phase breakdowns.',           accent:'#7B6EFF', tag:'Learning'        },
  { id:'codereview', icon:'✦', title:'Code Review',       desc:'Paste any code — get senior-developer feedback instantly.',           accent:'#00F0A0', tag:'Practice'        },
  { id:'interview',  icon:'⬡', title:'Mock Interview',    desc:'Live back-and-forth AI interview with a final score.',                accent:'#FFB700', tag:'Interview Prep'  },
  { id:'projects',   icon:'◈', title:'Project Ideas',     desc:'Generate 5 portfolio-worthy projects matched to your skill level.',  accent:'#FF4466', tag:'Build'           },
  { id:'portfolio',  icon:'⌥', title:'Portfolio Review',  desc:'Honest recruiter-style analysis with a score and rewritten bio.',    accent:'#4AABFF', tag:'Career'          },
];

export default function Dashboard() {
  const { navigate, profile, stats, hasKey } = useApp();
  const { ask, loading, result, error }       = useClaude();
  // FIX: useRef avoids stale closure bug — brief fires exactly once per mount
  const briefRequested = useRef(false);

  useEffect(() => {
    if (hasKey && profile.setupDone && !briefRequested.current) {
      briefRequested.current = true;
      ask(
        `Write a punchy 3-sentence developer motivational brief for ${profile.name || 'a developer'} working toward ${profile.goal || 'becoming a developer'}. End with one micro-task they can complete in the next 20 minutes.`,
        'You are an encouraging senior developer mentor. Be direct, specific, and energising. No fluff.'
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasKey, profile.setupDone]);

  const STATS = [
    { label:'Roadmap Progress', value:`${stats.roadmapProgress}%`, accent:'var(--cyan)',    icon:'⟶' },
    { label:'Code Reviews',     value: stats.reviewsDone,          accent:'var(--emerald)', icon:'✦' },
    { label:'Interviews Done',  value: stats.interviewsDone,       accent:'var(--amber)',   icon:'⬡' },
    { label:'AI Sessions',      value: stats.aiSessions,           accent:'var(--violet)',  icon:'◈' },
  ];

  return (
    <div className="page">

      <PageHeader
        icon="⌂"
        title={profile.name ? `Hey, ${profile.name}.` : 'Welcome to DevPath AI'}
        subtitle={profile.goal
          ? `Your goal: ${profile.goal} · ${today()}`
          : `Your AI-powered developer career navigator · ${today()}`}
        badge={profile.setupDone ? 'Active' : 'Setup Needed'}
      />

      {/* ── Setup prompt (shown if not onboarded) ── */}
      {!profile.setupDone && (
        <Card variant="accent" pad="lg" className="dash-cta anim-fade-up">
          <div className="dash-cta-inner">
            <div>
              <h2 className="dash-cta-title">Set your developer goal</h2>
              <p className="dash-cta-desc">Tell Claude where you want to go. Get a full roadmap in 60 seconds.</p>
            </div>
            <Button variant="primary" size="lg" icon="◎" onClick={() => navigate('goalsetup')}>
              Set Up My Goal
            </Button>
          </div>
        </Card>
      )}

      {/* ── Stats row ── */}
      <div className="dash-stats">
        {STATS.map((s, i) => (
          <Card key={s.label} pad="md" hover className={`stat-card delay-${i+1} anim-fade-up`}
            style={{ '--stat-accent': s.accent }}>
            <div className="stat-icon" aria-hidden="true">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* ── AI daily brief ── */}
      {hasKey && profile.setupDone && (
        <section className="dash-section">
          <p className="section-label">✦ AI Daily Brief</p>
          {(loading || result || error) ? (
            <AIResponse loading={loading} error={error} content={result} title="Your Daily Check-In" />
          ) : (
            <Card pad="md" variant="flat">
              <Button variant="primary" size="md" loading={loading}
                onClick={() => {
                  setBriefLoaded(true);
                  ask(
                    `Motivational 3-sentence check-in for ${profile.name || 'a developer'} working on ${profile.goal || 'becoming a developer'}. Include one 20-min task.`,
                    'Be direct and energising. No fluff.'
                  );
                }}>
                Generate Daily Brief
              </Button>
            </Card>
          )}
        </section>
      )}

      {/* ── Quick action grid ── */}
      <section className="dash-section">
        <p className="section-label">◆ Features</p>
        <div className="dash-grid">
          {ACTIONS.map((a, i) => (
            <Card key={a.id} pad="md" hover onClick={() => navigate(a.id)}
              className={`action-card delay-${i+1} anim-fade-up`}>
              <div className="ac-top">
                <div className="ac-icon" style={{ color: a.accent, background: `${a.accent}18` }} aria-hidden="true">
                  {a.icon}
                </div>
                <span className="chip chip-cyan">{a.tag}</span>
              </div>
              <h3 className="ac-title">{a.title}</h3>
              <p  className="ac-desc">{a.desc}</p>
              <span className="ac-arrow" aria-hidden="true">→</span>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}