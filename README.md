# DevPath AI 🚀
### AI-Powered Developer Career Navigator

> *"Your personal senior dev mentor, available 24/7."*

DevPath AI solves the biggest problem beginner developers face:  
**not knowing what to learn, how to practice, or what they're doing wrong.**

---

## ✦ What It Does

| Feature | Description |
|---|---|
| **Goal Setup** | 3-step onboarding. Claude generates a personalized week-by-week roadmap. |
| **My Roadmap** | Ask unlimited follow-up questions about your plan. Curated resource library. |
| **Code Review** | Paste any code. Get a senior dev's structured review with fixes and lessons. |
| **Mock Interview** | Live conversational AI interview with a score + improvement breakdown. |
| **Project Ideas** | 5 portfolio-worthy ideas matched to your exact skills and interests. |
| **Portfolio Analyzer** | Honest recruiter-style feedback with a score and rewritten bio. |

---

## 🏗 Architecture

```
devpath-ai/
│
├── index.html                    # SEO, OG tags, JSON-LD, Google Fonts
├── vite.config.js                # Build config (code splitting)
├── package.json
│
├── public/
│   ├── favicon.svg
│   └── manifest.json             # PWA manifest
│
└── src/
    ├── main.jsx                  # Entry providers + CSS imports
    ├── App.jsx                   # Shell layout + in-memory router
    │
    ├── styles/
    │   ├── variables.css         # All design tokens (dark + light themes)
    │   ├── globals.css           # Reset, base, layout, shared utilities
    │   └── animations.css        # Keyframes + utility classes
    │
    ├── context/
    │   ├── ThemeContext.jsx       # Dark/light mode with localStorage
    │   └── AppContext.jsx         # Global state (API key, profile, nav, stats)
    │
    ├── hooks/
    │   └── useClaude.js          # Reusable hook loading/error/result state
    │
    ├── utils/
    │   ├── claudeApi.js          # Centralized Claude API client + system prompts
    │   ├── constants.js          # Dropdown data, goal catalogs, nav items
    │   └── helpers.js            # Pure utility functions
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Sidebar.jsx/css   # Collapsible nav + mobile drawer
    │   │   └── Topbar.jsx/css    # Breadcrumb + API status + theme toggle
    │   │
    │   ├── ui/
    │   │   ├── Button.jsx/css    # Variants: primary, brand, secondary, ghost, danger
    │   │   ├── Card.jsx/css      # Surface container with compound slots
    │   │   └── AIResponse.jsx/css # Branded AI output renderer
    │   │
    │   └── shared/
    │       └── PageHeader.jsx/css # Consistent page title block
    │
    └── pages/
        ├── Dashboard.jsx/css     # Stats + daily brief + quick actions
        ├── GoalSetup.jsx/css     # 3-step onboarding form
        ├── Roadmap.jsx/css       # Roadmap viewer + follow-up Q&A
        ├── CodeReview.jsx/css    # Split editor + AI review panel
        ├── MockInterview.jsx/css # Live chat-style interview
        ├── ProjectIdeas.jsx/css  # Project generator
        ├── PortfolioAnalyzer.jsx/css # Portfolio feedback
        └── Settings.jsx/css     # API key, profile, theme
```

---

## 🤖 Claude API Integration

All API calls centralized in `src/utils/claudeApi.js`.  
Every feature uses a distinct, tuned system prompt.

| Page | How Claude is used |
|---|---|
| Dashboard | Personalized daily motivational brief |
| Goal Setup | Generates full week-by-week roadmap from profile |
| Roadmap | Answers follow-up questions in context |
| Code Review | Structured 7-section senior dev review |
| Mock Interview | Multi-turn conversational interview with scoring |
| Project Ideas | 5 detailed project ideas with build breakdowns |
| Portfolio Analyzer | Recruiter-style feedback with rewritten bio |

---

## 🎨 Design System

- **Fonts**: Syne (display) + DM Sans (body) + Space Mono (code/UI)
- **Dark theme**: `#0A0C12` base with `#00E5FF` cyan accent
- **Light theme**: `#F5F1EC` base with `#006882` teal accent
- **CSS architecture**: Pure CSS custom properties no framework needed
- **Responsive**: CSS Grid, mobile sidebar drawer, touch-friendly targets

---

## 🚀 Running Locally

```bash
git clone https://github.com/your-username/devpath-ai
cd devpath-ai
npm install
npm run dev
```

Then open `http://localhost:5173` and add your Anthropic API key in **Settings**.

## 📦 Deploying

```bash
# Vercel (recommended)
npm run build
vercel --prod

# GitHub Pages
# Set base: '/devpath-ai/' in vite.config.js, then:
npm run build && gh-pages -d dist
```

---

## 🏆 Themes

- ✅ Software Development & Engineering
- ✅ Artificial Intelligence & Machine Learning
- ✅ Business Management & Consultancy Solutions

---

## 🔑 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite 5 |
| Styling | Pure CSS (custom properties, no framework) |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) |
| State | React Context API + useState |
| Storage | localStorage (API key + profile only) |
| Deployment | Vercel / GitHub Pages |

---

*MIT License*