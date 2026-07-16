// Options for the recommendation form. Labels are mapped to model features
// by the backend/ML alias tables, so keep these human-friendly.

export const SKILL_OPTIONS = [
  'Python',
  'SQL',
  'JavaScript',
  'HTML/CSS',
  'React',
  'Node.js',
  'Statistics',
  'Machine Learning',
  'Deep Learning',
  'NLP',
  'Data Visualization',
  'Excel',
  'Cloud',
  'Docker',
  'Git',
];

export const INTEREST_OPTIONS = [
  'AI/ML',
  'Data Analysis',
  'Web Design',
  'Backend Systems',
  'Building Products',
  'Research',
  'Automation',
];

export const EDUCATION_OPTIONS = ["High School", 'Diploma', "Bachelor's", "Master's", 'PhD'];

export const DOMAIN_OPTIONS = [
  'Artificial Intelligence',
  'Data Science',
  'Data Analytics',
  'Web Development',
  'Software Development',
];

export const STATUS_META: Record<
  'not_started' | 'in_progress' | 'completed',
  { label: string; tone: 'slate' | 'amber' | 'green'; dot: string }
> = {
  not_started: { label: 'Not started', tone: 'slate', dot: 'bg-slate-400' },
  in_progress: { label: 'In progress', tone: 'amber', dot: 'bg-amber-500' },
  completed: { label: 'Completed', tone: 'green', dot: 'bg-emerald-500' },
};
