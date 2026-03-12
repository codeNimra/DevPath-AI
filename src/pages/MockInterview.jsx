import { useState, useRef, useEffect } from 'react';
import { useApp }                       from '../context/AppContext';
import { callClaude, PROMPTS }          from '../utils/claudeApi';
import { INTERVIEW_TOPICS, INTERVIEW_DIFFICULTIES } from '../utils/constants';
import PageHeader                       from '../components/shared/PageHeader';
import Card                             from '../components/ui/Card';
import Button                           from '../components/ui/Button';
import './MockInterview.css';

const S = { SETUP: 'setup', ACTIVE: 'active', ENDED: 'ended' };

export default function MockInterview() {
  const { apiKey, hasKey, incrementStat, navigate } = useApp();

  const [phase,   setPhase]   = useState(S.SETUP);
  const [topic,   setTopic]   = useState('javascript');
  const [diff,    setDiff]    = useState('junior');
  const [msgs,    setMsgs]    = useState([]);   // { role, content, time }
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs, loading]);
  useEffect(() => { if (phase === S.ACTIVE) setTimeout(() => inputRef.current?.focus(), 200); }, [phase]);

  const topicLabel = INTERVIEW_TOPICS.find(t => t.value === topic)?.label || topic;
  const diffLabel  = INTERVIEW_DIFFICULTIES.find(d => d.value === diff)?.label || diff;
  const system     = `${PROMPTS.interview}\nTopic: ${topicLabel}\nDifficulty: ${diffLabel}`;

  async function start() {
    setError(null);
    setLoading(true);
    setMsgs([]);
    try {
      const res = await callClaude(apiKey, [{ role:'user', content:'Start the interview now.' }], system);
      setMsgs([{ role:'assistant', content:res, time: nowTime() }]);
      setPhase(S.ACTIVE);
      incrementStat('interviewsDone');
    } catch(e) { setError(e.message); }
    finally    { setLoading(false); }
  }

  async function send() {
    const answer = input.trim();
    if (!answer || loading) return;
    setInput('');
    setError(null);
    const userMsg  = { role:'user', content:answer, time: nowTime() };
    const updated  = [...msgs, userMsg];
    setMsgs(updated);
    setLoading(true);
    try {
      const apiMsgs = updated.map(m => ({ role:m.role, content:m.content }));
      const res = await callClaude(apiKey, apiMsgs, system);
      setMsgs(prev => [...prev, { role:'assistant', content:res, time: nowTime() }]);
    } catch(e) { setError(e.message); }
    finally    { setLoading(false); }
  }

  async function end() {
    setLoading(true);
    const apiMsgs = [
      ...msgs.map(m => ({ role:m.role, content:m.content })),
      { role:'user', content:'End the interview. Give me my final score out of 10 with a full breakdown, what I did well, what to improve, and 3 study recommendations.' },
    ];
    try {
      const res = await callClaude(apiKey, apiMsgs, system);
      setMsgs(prev => [...prev, { role:'assistant', content:res, time: nowTime() }]);
      setPhase(S.ENDED);
    } catch(e) { setError(e.message); }
    finally    { setLoading(false); }
  }

  function reset() { setMsgs([]); setInput(''); setError(null); setPhase(S.SETUP); }

  const onKey = (e) => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="page mi-page">
      <PageHeader
        icon="⬡"
        title="Mock Interview"
        subtitle="Live AI-powered interview. Get scored. Know exactly what to improve."
        badge={phase === S.ACTIVE ? `${msgs.length} messages` : phase === S.ENDED ? 'Session Complete' : 'Ready'}
      />

      {/* ─────── SETUP ─────── */}
      {phase === S.SETUP && (
        <div className="mi-setup anim-fade-up">
          <div className="mi-setup-grid">
            <Card pad="md">
              <h3 className="mi-setup-title">Interview Topic</h3>
              <div className="mi-topics">
                {INTERVIEW_TOPICS.map(t => (
                  <button key={t.value}
                    className={`mi-topic ${topic === t.value ? 'mi-topic-on' : ''}`}
                    onClick={() => setTopic(t.value)} aria-pressed={topic === t.value}>
                    <span aria-hidden="true">{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </Card>

            <Card pad="md">
              <h3 className="mi-setup-title">Difficulty</h3>
              <div className="mi-diffs">
                {INTERVIEW_DIFFICULTIES.map(d => (
                  <button key={d.value}
                    className={`mi-diff mi-diff-${d.color} ${diff === d.value ? 'mi-diff-on' : ''}`}
                    onClick={() => setDiff(d.value)} aria-pressed={diff === d.value}>
                    {d.label}
                  </button>
                ))}
              </div>
              <ul className="mi-tips">
                {['Think aloud — explain your reasoning','Ask clarifying questions freely','Answer naturally, as you would speak','End session any time to get your score'].map(t => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </Card>
          </div>

          {error && <p className="mi-error">{error}</p>}

          <div className="mi-setup-actions">
            {!hasKey && <Button variant="secondary" size="md" onClick={() => navigate('settings')}>Add API Key First →</Button>}
            <Button variant="brand" size="lg" icon="⬡" loading={loading}
              disabled={!hasKey} onClick={start}>
              Start Interview
            </Button>
          </div>
        </div>
      )}

      {/* ─────── ACTIVE / ENDED ─────── */}
      {(phase === S.ACTIVE || phase === S.ENDED) && (
        <div className="mi-chat anim-fade-up">
          {/* Chat header */}
          <div className="mi-chat-head">
            <div className="mi-chat-head-left">
              <div className="mi-avatar" aria-hidden="true">AI</div>
              <div>
                <div className="mi-interviewer-name">Claude · Technical Interviewer</div>
                <div className="mi-session-info">{topicLabel} · {diffLabel}</div>
              </div>
            </div>
            <div className="mi-chat-head-right">
              {phase === S.ACTIVE && (
                <Button variant="danger" size="sm" onClick={end} loading={loading && !input}>End & Score</Button>
              )}
              {phase === S.ENDED && (
                <Button variant="secondary" size="sm" onClick={reset}>New Interview</Button>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="mi-messages" role="log" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={`mi-msg mi-msg-${m.role} anim-fade-up`}>
                <div className="mi-msg-avatar" aria-hidden="true">
                  {m.role === 'assistant' ? 'AI' : 'You'}
                </div>
                <div className="mi-msg-wrap">
                  <div className="mi-msg-bubble">{m.content}</div>
                  <div className="mi-msg-time">{m.time}</div>
                </div>
              </div>
            ))}
            {loading && phase === S.ACTIVE && (
              <div className="mi-msg mi-msg-assistant">
                <div className="mi-msg-avatar" aria-hidden="true">AI</div>
                <div className="mi-typing" aria-label="Claude is typing">
                  <span/><span/><span/>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          {phase === S.ACTIVE && (
            <div className="mi-input-area">
              {error && <p className="mi-error" role="alert">{error}</p>}
              <div className="mi-input-row">
                <textarea ref={inputRef} className="mi-input"
                  placeholder="Type your answer… (Enter sends, Shift+Enter for new line)"
                  value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={onKey} rows={3} disabled={loading}
                  aria-label="Your answer" />
                <Button variant="primary" size="md" loading={loading}
                  disabled={!input.trim()} onClick={send} icon="↑">
                  Send
                </Button>
              </div>
              <p className="mi-input-hint">{msgs.length} exchange{msgs.length !== 1 ? 's' : ''} · Click "End & Score" when ready for feedback</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const nowTime = () => new Intl.DateTimeFormat('en-US',{ hour:'2-digit', minute:'2-digit', hour12:false }).format(new Date());