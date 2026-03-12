const API_URL    = 'https://api.anthropic.com/v1/messages';
const MODEL      = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 2048;

/* ── Core fetch wrapper ─────────────────────────────────────── */

/**
 * callClaude
 * Multi-turn capable call. Accepts a full messages array.
 *
 * @param {string} apiKey
 * @param {Array}  messages 
 * @param {string} system 
 * @param {number} maxTokens
 * @returns {Promise<string>}
 */
export async function callClaude(apiKey, messages, system = '', maxTokens = MAX_TOKENS) {
  if (!apiKey) throw new Error('No API key. Add yours in Settings → API Key.');

  const body = { model: MODEL, max_tokens: maxTokens, messages };
  if (system) body.system = system;

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type':       'application/json',
      'x-api-key':          apiKey,
      'anthropic-version':  '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status} — check your API key.`);
  }

  const data = await res.json();
  return data.content?.[0]?.text ?? '';
}

/**
 * askClaude
 * Single-turn convenience wrapper.
 *
 * @param {string} apiKey
 * @param {string} userPrompt
 * @param {string} systemPrompt
 * @returns {Promise<string>}
 */
export async function askClaude(apiKey, userPrompt, systemPrompt = '') {
  return callClaude(apiKey, [{ role: 'user', content: userPrompt }], systemPrompt);
}

/* ── System Prompts ─────────────────────────────────────────── */

export const PROMPTS = {

  roadmap: `You are a senior software engineering mentor specialising in developer career roadmaps.
Your roadmaps are practical, specific, and motivating.
Format responses with clear phase headings, bullet points for tasks, and inline resource suggestions.
Always tailor to the developer's stated goal, timeline, and current skill level.
Be realistic about timelines. Include a "First Steps This Week" section at the end.`,

  codeReview: `You are a senior software engineer conducting a thorough, educational code review.
Structure every review with these labelled sections:
1. OVERALL ASSESSMENT
2. BUGS & ERRORS
3. CODE QUALITY (naming, structure, readability)
4. BEST PRACTICES
5. SECURITY (if relevant)
6. WHAT'S DONE WELL
7. NEXT STEPS (1-2 things to study or refactor)
Include corrected code snippets where helpful. Be specific, kind, and educational.`,

  interview: `You are a professional technical interviewer at a top-tier tech company.
Conduct a realistic, fair interview — one question at a time.
After each answer: give 2-sentence feedback, then ask the next question or a follow-up.
At the end (when asked): score the candidate 1–10, give a breakdown by category,
list 3 specific things done well, and 3 specific areas to improve.
Adapt question difficulty to the candidate's responses.`,

  projectIdeas: `You are a creative senior developer mentoring beginners on portfolio projects.
Each idea must be specific, achievable within the stated time, and genuinely impressive.
Format each idea with: bold title, concept description, problem it solves,
key features to build (as bullet points), recommended tech stack, difficulty,
estimated time, and "Why recruiters will notice this."`,

  portfolio: `You are an experienced tech recruiter and senior developer reviewing portfolios.
Give honest, structured feedback. Use these sections:
1. FIRST IMPRESSION (gut reaction in 2 sentences)
2. STRENGTHS (what stands out positively)
3. CRITICAL IMPROVEMENTS (must-fix — be direct)
4. MISSING ELEMENTS (what employers expect)
5. YOUR REWRITTEN BIO (improved version)
6. SCORE — X/10 with a one-line breakdown per dimension
Be candid but constructive. The goal is to help them get hired.`,

};