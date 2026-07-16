import * as repo from './repo.js';
import { buildRoadmapDetail, type RoadmapDetailDto, type RoadmapSkillDto } from './roadmapService.js';
import { DEMO_USER_ID } from '../config.js';
import type { CareerRow } from '../types.js';

export type Intent =
  | 'greeting'
  | 'career_info'
  | 'what_to_learn_next'
  | 'missing_skills'
  | 'learning_time'
  | 'suggest_projects'
  | 'recommend_resources'
  | 'show_roadmap'
  | 'progress_status'
  | 'skill_suggestion'
  | 'fallback';

export interface ChatResponse {
  reply: string;
  intent: Intent;
  data?: unknown;
}

const HOURS_PER_WEEK = 10;

// Intent keyword definitions (scored by number of matches, weighted).
const INTENT_KEYWORDS: Record<Exclude<Intent, 'fallback' | 'career_info'>, string[]> = {
  greeting: ['hello', 'hi ', 'hey', 'good morning', 'good evening', 'namaste', 'yo '],
  what_to_learn_next: ['what should i learn next', 'learn next', 'what next', 'next skill', 'what now'],
  missing_skills: ['missing', 'which skills', 'what am i missing', 'remaining skill', 'skills left', 'incomplete', 'not done'],
  learning_time: ['how long', 'how much time', 'time to learn', 'duration', 'how many hours', 'weeks', 'finish'],
  suggest_projects: ['project', 'projects', 'build something', 'practice project', 'portfolio'],
  recommend_resources: ['resource', 'resources', 'free', 'material', 'youtube', 'course', 'tutorial', 'where to learn', 'docs'],
  show_roadmap: ['show my roadmap', 'my roadmap', 'roadmap', 'my path', 'my plan', 'my journey'],
  progress_status: ['progress', 'how am i doing', 'completed', 'how far', 'status', 'percent'],
  skill_suggestion: ['suggest skill', 'which skill', 'recommend a skill', 'skill suggestion', 'what skill'],
};

function normalize(text: string): string {
  return ` ${text.toLowerCase().trim()} `;
}

/** Finds a career mentioned in the message, if any. */
function detectCareer(message: string, careers: CareerRow[]): CareerRow | undefined {
  const msg = message.toLowerCase();
  const aliases: { match: string[]; slug: string }[] = [
    { match: ['ai engineer', 'ai/ml engineer', 'ml engineer', 'artificial intelligence engineer'], slug: 'ai-engineer' },
    { match: ['data scientist', 'data science'], slug: 'data-scientist' },
    { match: ['data analyst', 'data analytics'], slug: 'data-analyst' },
    { match: ['full stack', 'fullstack', 'full-stack'], slug: 'fullstack-developer' },
    { match: ['frontend', 'front end', 'front-end'], slug: 'frontend-developer' },
    { match: ['backend', 'back end', 'back-end'], slug: 'backend-developer' },
    { match: ['web developer', 'web development', 'web dev'], slug: 'web-developer' },
  ];
  for (const a of aliases) {
    if (a.match.some((m) => msg.includes(m))) {
      const c = careers.find((cr) => cr.slug === a.slug);
      if (c) return c;
    }
  }
  // Fall back to matching the exact title.
  return careers.find((c) => msg.includes(c.title.toLowerCase()));
}

function scoreIntent(message: string): Intent {
  const msg = normalize(message);
  let best: Intent = 'fallback';
  let bestScore = 0;
  (Object.keys(INTENT_KEYWORDS) as (keyof typeof INTENT_KEYWORDS)[]).forEach((intent) => {
    const score = INTENT_KEYWORDS[intent].reduce(
      (acc, kw) => acc + (msg.includes(kw) ? kw.split(' ').length : 0),
      0,
    );
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  });
  return best;
}

/** Returns the roadmap to reason about: explicit id, else the user's most recent. */
function resolveRoadmap(roadmapId?: number): RoadmapDetailDto | undefined {
  if (roadmapId) {
    try {
      return buildRoadmapDetail(roadmapId);
    } catch {
      /* fall through */
    }
  }
  const roadmaps = repo.getRoadmapsForUser(DEMO_USER_ID);
  if (roadmaps.length === 0) return undefined;
  return buildRoadmapDetail(roadmaps[0].id);
}

function nextSkill(roadmap: RoadmapDetailDto): RoadmapSkillDto | undefined {
  return (
    roadmap.skills.find((s) => s.status === 'in_progress') ??
    roadmap.skills.find((s) => s.status === 'not_started')
  );
}

const CAPABILITIES = [
  '• "What should I learn next?"',
  '• "Which skills am I missing?"',
  '• "Tell me about AI Engineer / Data Scientist"',
  '• "How long will it take to finish?"',
  '• "Suggest some projects"',
  '• "Recommend free resources"',
  '• "Show my roadmap"',
  '• "How is my progress?"',
];

export function handleChat(message: string, roadmapId?: number): ChatResponse {
  const careers = repo.getAllCareers();
  const mentionedCareer = detectCareer(message, careers);
  let intent = scoreIntent(message);

  // If a career is explicitly named and no stronger intent matched, treat as career_info.
  if (mentionedCareer && (intent === 'fallback' || /tell me about|what is|about the|info|explain/.test(message.toLowerCase()))) {
    intent = 'career_info';
  }

  switch (intent) {
    case 'greeting':
      return {
        intent,
        reply:
          "Hi! I'm CareerGenie 🧞 — your AI career guide. I can help you with:\n" +
          CAPABILITIES.join('\n') +
          '\n\nWhat would you like to explore?',
      };

    case 'career_info': {
      const career = mentionedCareer ?? careers[0];
      const skills = repo.getSkillsByCareer(career.id);
      const top = skills.slice(0, 6).map((s) => s.name).join(' → ');
      return {
        intent,
        data: { career, skillCount: skills.length },
        reply:
          `**${career.icon ?? ''} ${career.title}** — ${career.description}\n\n` +
          `💰 Typical salary: ${career.avg_salary ?? 'N/A'}  •  📈 Demand: ${career.demand_level ?? 'N/A'}\n\n` +
          `The learning path (${skills.length} skills) starts with: ${top} …\n\n` +
          `Say "show my roadmap" after creating one, or "suggest projects" for ${career.title}.`,
      };
    }

    case 'suggest_projects': {
      const roadmap = resolveRoadmap(roadmapId);
      const career = mentionedCareer ?? (roadmap ? repo.getCareerBySlug(roadmap.career.slug) : careers[0]);
      if (!career) return fallback();
      const projects = repo.getProjectsByCareer(career.id);
      const list = projects
        .map((p) => `• **${p.title}** _(${p.difficulty})_ — ${p.description}`)
        .join('\n');
      return {
        intent,
        data: { career: career.title, projects },
        reply: `Here are project ideas for a **${career.title}**:\n\n${list}\n\nStart with a Beginner one and level up! 🚀`,
      };
    }

    default:
      break;
  }

  // The intents below need an active roadmap.
  const roadmap = resolveRoadmap(roadmapId);

  if (!roadmap) {
    return {
      intent: intent === 'fallback' ? 'fallback' : intent,
      reply:
        "You don't have a roadmap yet. Head to **Career Recommendation**, get your predicted career, " +
        'and generate a roadmap — then I can track what to learn next, your progress and resources.\n\n' +
        'Meanwhile, ask me "Tell me about AI Engineer" or "Suggest projects for Data Scientist".',
    };
  }

  switch (intent) {
    case 'what_to_learn_next':
    case 'skill_suggestion': {
      const skill = nextSkill(roadmap);
      if (!skill) {
        return {
          intent,
          data: { done: true },
          reply: `🎉 You've completed every skill in your **${roadmap.career.title}** roadmap! Time to build advanced projects.`,
        };
      }
      const res = skill.resources
        .map((r) => `  - ${r.type === 'video' ? '🎥' : r.type === 'practice' ? '🧪' : '📄'} [${r.title}](${r.url})`)
        .join('\n');
      return {
        intent,
        data: { skill },
        reply:
          `Next up in your **${roadmap.career.title}** roadmap: **${skill.name}** ` +
          `(≈ ${skill.estimated_hours} hrs, ${skill.category}).\n${skill.description ?? ''}\n\nStart with:\n${res}`,
      };
    }

    case 'missing_skills': {
      const missing = roadmap.skills.filter((s) => s.status !== 'completed');
      if (missing.length === 0) {
        return { intent, data: { missing: [] }, reply: '✅ Nothing missing — all skills are completed!' };
      }
      const list = missing
        .map((s) => `• ${s.name} _(${s.status === 'in_progress' ? 'in progress' : 'not started'}, ≈${s.estimated_hours}h)_`)
        .join('\n');
      return {
        intent,
        data: { missing },
        reply: `You still have **${missing.length}** skill(s) to complete in **${roadmap.career.title}**:\n\n${list}`,
      };
    }

    case 'learning_time': {
      const remainingHours = roadmap.stats.remainingHours;
      const weeks = Math.ceil(remainingHours / HOURS_PER_WEEK);
      return {
        intent,
        data: { remainingHours, weeks },
        reply:
          `Based on your remaining skills, you need about **${remainingHours} hours** (~${weeks} weeks ` +
          `at ${HOURS_PER_WEEK} hrs/week) to finish your **${roadmap.career.title}** roadmap. ` +
          `You're already ${roadmap.stats.percent}% done! 💪`,
      };
    }

    case 'recommend_resources': {
      const skill = mentionedCareerSkill(message, roadmap) ?? nextSkill(roadmap) ?? roadmap.skills[0];
      const free = skill.resources.filter((r) => r.is_free);
      const list = free
        .map((r) => `• ${r.type === 'video' ? '🎥' : r.type === 'practice' ? '🧪' : '📄'} [${r.title}](${r.url})`)
        .join('\n');
      return {
        intent,
        data: { skill: skill.name, resources: free },
        reply: `Free resources for **${skill.name}**:\n\n${list}`,
      };
    }

    case 'progress_status': {
      const s = roadmap.stats;
      return {
        intent,
        data: s,
        reply:
          `📊 Your **${roadmap.career.title}** progress: **${s.percent}%**\n` +
          `✅ Completed: ${s.completed}/${s.total} skills\n` +
          `⏳ In progress: ${s.inProgress}\n` +
          `🕒 Hours done: ${s.completedHours}/${s.totalHours}`,
      };
    }

    case 'show_roadmap': {
      const list = roadmap.skills
        .map((s) => {
          const icon = s.status === 'completed' ? '✅' : s.status === 'in_progress' ? '🔵' : '⚪';
          return `${icon} ${s.name} _(${s.estimated_hours}h)_`;
        })
        .join('\n');
      return {
        intent,
        data: { roadmapId: roadmap.id, percent: roadmap.stats.percent },
        reply: `**${roadmap.title}** — ${roadmap.stats.percent}% complete\n\n${list}`,
      };
    }

    default:
      return fallback();
  }
}

/** Detect if the user named a skill that exists in the current roadmap. */
function mentionedCareerSkill(message: string, roadmap: RoadmapDetailDto): RoadmapSkillDto | undefined {
  const msg = message.toLowerCase();
  return roadmap.skills.find((s) => msg.includes(s.name.toLowerCase()));
}

function fallback(): ChatResponse {
  return {
    intent: 'fallback',
    reply:
      "I'm not sure I understood that. Here's what I can help with:\n" +
      CAPABILITIES.join('\n'),
  };
}
