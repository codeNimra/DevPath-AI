export const today = () =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date());

export const timeNow = () =>
  new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());

/* ── Strings ─────────────────────────────────────────────────── */
export const truncate = (str, max = 100) =>
  (!str || str.length <= max) ? (str ?? '') : str.slice(0, max).trimEnd() + '…';

export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

/* ── Validation ─────────────────────────────────────────────── */
export const isValidApiKey = (key) =>
  typeof key === 'string' && key.startsWith('sk-ant-') && key.length > 20;

export const nonEmpty = (val) =>
  typeof val === 'string' && val.trim().length > 0;

/* ── Numbers ─────────────────────────────────────────────────── */
export const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);

/* ── Markdown → safe HTML (lightweight, no library) ─────────── */
export function mdToHtml(text) {
  if (!text) return '';
  return text
    .replace(/```[\w]*\n?([\s\S]*?)```/g,  '<pre class="ai-pre"><code>$1</code></pre>')
    .replace(/`([^`]+)`/g,                '<code class="ai-code">$1</code>')
    .replace(/\*\*(.+?)\*\*/g,            '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,                '<em>$1</em>')
    .replace(/^#{1,3}\s+(.+)$/gm,         '<h4 class="ai-h4">$1</h4>')
    .replace(/^\d+\.\s+([A-Z][A-Z\s&/]+)$/gm, '<h4 class="ai-h4">$1</h4>')
    .replace(/^[-•*]\s+(.+)$/gm,          '<li>$1</li>')
    .replace(/(<li>[\s\S]+?<\/li>)/g,     '<ul>$1</ul>')
    .replace(/\n\n/g,                     '</p><p class="ai-p">')
    .replace(/\n/g,                       '<br>');
}