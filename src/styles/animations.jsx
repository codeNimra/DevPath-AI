/* ── KEYFRAMES ──────────────────────────────────────────────── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0);    }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0);     }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.94); }
  to   { opacity: 1; transform: scale(1);    }
}

@keyframes slideLeft {
  from { opacity: 0; transform: translateX(-18px); }
  to   { opacity: 1; transform: translateX(0);     }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%,100% { opacity: 1;   }
  50%      { opacity: 0.4; }
}

@keyframes blink {
  0%,100% { opacity: 1; }
  50%      { opacity: 0; }
}

@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}

@keyframes glowPulse {
  0%,100% { box-shadow: 0 0 6px  rgba(0,229,255,0.25); }
  50%      { box-shadow: 0 0 22px rgba(0,229,255,0.55); }
}

@keyframes float {
  0%,100% { transform: translateY(0);   }
  50%      { transform: translateY(-7px); }
}

@keyframes typeIn {
  from { width: 0; }
  to   { width: 100%; }
}

/* ── UTILITY CLASSES ────────────────────────────────────────── */
.anim-fade-up    { animation: fadeUp    0.35s ease both; }
.anim-fade-in    { animation: fadeIn    0.25s ease both; }
.anim-fade-down  { animation: fadeDown  0.3s  ease both; }
.anim-scale-in   { animation: scaleIn   0.28s ease both; }
.anim-slide-left { animation: slideLeft 0.32s ease both; }
.anim-spin       { animation: spin      0.75s linear infinite; }
.anim-pulse      { animation: pulse     2s    ease-in-out infinite; }
.anim-float      { animation: float     3.5s  ease-in-out infinite; }
.anim-glow       { animation: glowPulse 2.2s  ease-in-out infinite; }

/* Stagger delays for list animations */
.delay-1 { animation-delay: 50ms;  }
.delay-2 { animation-delay: 100ms; }
.delay-3 { animation-delay: 150ms; }
.delay-4 { animation-delay: 200ms; }
.delay-5 { animation-delay: 250ms; }
.delay-6 { animation-delay: 300ms; }

/* ── SKELETON LOADING ───────────────────────────────────────── */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-surface) 25%,
    var(--bg-overlay) 50%,
    var(--bg-surface) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s ease-in-out infinite;
  border-radius: var(--r-md);
}

/* ── TYPING CURSOR ──────────────────────────────────────────── */
.cursor-blink::after {
  content: '▋';
  display: inline-block;
  animation: blink 0.85s step-end infinite;
  color: var(--color-accent);
  margin-left: 2px;
}