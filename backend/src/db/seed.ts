import { getDb, DB_PATH } from './connection.js';
import { initDb } from './init.js';
import { CAREERS, DEMO_USER } from './seedData.js';

/** Wipes dynamic + seed tables and repopulates from seedData. */
export function seed(): void {
  initDb();
  const db = getDb();

  // Clear in FK-safe order
  db.exec(`
    DELETE FROM favorites;
    DELETE FROM progress;
    DELETE FROM roadmaps;
    DELETE FROM career_recommendations;
    DELETE FROM learning_resources;
    DELETE FROM project_ideas;
    DELETE FROM skills;
    DELETE FROM careers;
    DELETE FROM users;
    DELETE FROM sqlite_sequence;
  `);

  // Demo user (id = 1)
  const insertUser = db.prepare(
    `INSERT INTO users (id, name, email, education, preferred_domain) VALUES (1, ?, ?, ?, ?)`,
  );
  insertUser.run(DEMO_USER.name, DEMO_USER.email, DEMO_USER.education, DEMO_USER.preferred_domain);

  const insertCareer = db.prepare(
    `INSERT INTO careers (slug, title, description, avg_salary, demand_level, icon)
     VALUES (?, ?, ?, ?, ?, ?)`,
  );
  const insertSkill = db.prepare(
    `INSERT INTO skills (career_id, name, description, order_index, estimated_hours, category)
     VALUES (?, ?, ?, ?, ?, ?)`,
  );
  const insertResource = db.prepare(
    `INSERT INTO learning_resources (skill_id, type, title, url, is_free)
     VALUES (?, ?, ?, ?, ?)`,
  );
  const insertProject = db.prepare(
    `INSERT INTO project_ideas (career_id, title, description, difficulty)
     VALUES (?, ?, ?, ?)`,
  );

  let skillCount = 0;
  let resourceCount = 0;
  let projectCount = 0;

  for (const career of CAREERS) {
    const careerRes = insertCareer.run(
      career.slug,
      career.title,
      career.description,
      career.avg_salary,
      career.demand_level,
      career.icon,
    );
    const careerId = Number(careerRes.lastInsertRowid);

    career.skills.forEach((skill, idx) => {
      const skillRes = insertSkill.run(
        careerId,
        skill.name,
        skill.description,
        idx,
        skill.hours,
        skill.category,
      );
      const skillId = Number(skillRes.lastInsertRowid);
      skillCount++;

      for (const resource of skill.resources) {
        insertResource.run(skillId, resource.type, resource.title, resource.url, resource.is_free === false ? 0 : 1);
        resourceCount++;
      }
    });

    for (const project of career.projects) {
      insertProject.run(careerId, project.title, project.description, project.difficulty);
      projectCount++;
    }
  }

  // Starter roadmap for the demo user (AI Engineer) with some progress, so the
  // dashboard/chatbot are demo-able immediately.
  const aiCareer = db.prepare(`SELECT id FROM careers WHERE slug = ?`).get('ai-engineer') as
    | { id: number }
    | undefined;
  if (aiCareer) {
    const roadmapRes = db
      .prepare(`INSERT INTO roadmaps (user_id, career_id, title) VALUES (1, ?, ?)`)
      .run(aiCareer.id, 'My AI Engineer Roadmap');
    const roadmapId = Number(roadmapRes.lastInsertRowid);

    const skills = db
      .prepare(`SELECT id FROM skills WHERE career_id = ? ORDER BY order_index`)
      .all(aiCareer.id) as { id: number }[];

    const insertProgress = db.prepare(
      `INSERT INTO progress (roadmap_id, skill_id, status, completed_at)
       VALUES (?, ?, ?, ?)`,
    );
    skills.forEach((skill, idx) => {
      // First 3 completed, 4th in progress, rest not started — a realistic demo state.
      let status = 'not_started';
      let completedAt: string | null = null;
      if (idx < 3) {
        status = 'completed';
        completedAt = new Date().toISOString();
      } else if (idx === 3) {
        status = 'in_progress';
      }
      insertProgress.run(roadmapId, skill.id, status, completedAt);
    });
  }

  console.log(
    `[careergenie] seeded ${CAREERS.length} careers, ${skillCount} skills, ` +
      `${resourceCount} resources, ${projectCount} projects into ${DB_PATH}`,
  );
}

// Run directly: `npm run seed`
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seed();
}
