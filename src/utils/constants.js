export const DEV_GOALS = [
  { value: 'frontend',   label: 'Frontend Developer',        icon: '🎨' },
  { value: 'backend',    label: 'Backend Developer',         icon: '⚙️' },
  { value: 'fullstack',  label: 'Full-Stack Developer',      icon: '🔄' },
  { value: 'mobile',     label: 'Mobile Developer',          icon: '📱' },
  { value: 'devops',     label: 'DevOps / Cloud Engineer',   icon: '☁️' },
  { value: 'ml',         label: 'ML / AI Engineer',          icon: '🤖' },
  { value: 'data',       label: 'Data Scientist',            icon: '📊' },
  { value: 'security',   label: 'Security Engineer',         icon: '🔐' },
  { value: 'gamedev',    label: 'Game Developer',            icon: '🎮' },
  { value: 'blockchain', label: 'Web3 / Blockchain Dev',     icon: '⛓️' },
];

export const TIMELINES = [
  { value: '3months',  label: '3 months — Intensive' },
  { value: '6months',  label: '6 months — Balanced'  },
  { value: '12months', label: '1 year  — Steady'      },
  { value: '24months', label: '2 years — Part-time'   },
];

export const LEVELS = [
  { value: 'zero',         label: 'Absolute beginner (zero experience)' },
  { value: 'beginner',     label: 'Beginner (done a few tutorials)'     },
  { value: 'intermediate', label: 'Intermediate (built small projects)' },
  { value: 'advanced',     label: 'Advanced (professional experience)'  },
];

export const COMMON_SKILLS = [
  'HTML','CSS','JavaScript','TypeScript','Python','React',
  'Vue.js','Node.js','SQL','Git','Docker','AWS',
  'REST APIs','MongoDB','PHP','Ruby','Java','C++',
];

export const INTERVIEW_TOPICS = [
  { value: 'javascript',  label: 'JavaScript',             icon: '🟨' },
  { value: 'react',       label: 'React & Frontend',       icon: '⚛️' },
  { value: 'python',      label: 'Python',                 icon: '🐍' },
  { value: 'dsa',         label: 'Data Structures & Algos',icon: '🧩' },
  { value: 'systemdesign',label: 'System Design',          icon: '🏗️' },
  { value: 'behavioral',  label: 'Behavioral / HR',        icon: '💬' },
  { value: 'sql',         label: 'SQL & Databases',        icon: '🗃️' },
  { value: 'css',         label: 'CSS & Design',           icon: '🎨' },
  { value: 'nodejs',      label: 'Node.js & Backend',      icon: '🟢' },
  { value: 'git',         label: 'Git & DevOps',           icon: '🌿' },
];

export const INTERVIEW_DIFFICULTIES = [
  { value: 'junior',  label: 'Junior  (0–1 yr)',   color: 'emerald' },
  { value: 'mid',     label: 'Mid     (1–3 yr)',   color: 'cyan'    },
  { value: 'senior',  label: 'Senior  (3+ yr)',    color: 'amber'   },
];

export const LANGUAGES = [
  'JavaScript','TypeScript','Python','Java','C++','C#',
  'Go','Rust','PHP','Ruby','Swift','Kotlin','HTML/CSS','SQL','React/JSX','Other',
];

export const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',         icon: '⌂',  group: 'main'   },
  { id: 'goalsetup',  label: 'Goal Setup',         icon: '◎',  group: 'main'   },
  { id: 'roadmap',    label: 'My Roadmap',         icon: '⟶',  group: 'learn'  },
  { id: 'codereview', label: 'Code Review',        icon: '✦',  group: 'learn'  },
  { id: 'interview',  label: 'Mock Interview',     icon: '⬡',  group: 'learn'  },
  { id: 'projects',   label: 'Project Ideas',      icon: '◈',  group: 'build'  },
  { id: 'portfolio',  label: 'Portfolio Review',   icon: '⌥',  group: 'build'  },
  { id: 'settings',   label: 'Settings',           icon: '⚙',  group: 'account'},
];

export const NAV_GROUPS = {
  main:    'Navigate',
  learn:   'Learn',
  build:   'Build',
  account: 'Account',
};