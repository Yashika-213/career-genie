-- CareerGenie SQLite schema
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  name             TEXT NOT NULL,
  email            TEXT UNIQUE,
  education        TEXT,
  preferred_domain TEXT,
  created_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS careers (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  slug         TEXT NOT NULL UNIQUE,
  title        TEXT NOT NULL,
  description  TEXT NOT NULL,
  avg_salary   TEXT,
  demand_level TEXT,            -- Low | Medium | High | Very High
  icon         TEXT             -- emoji / short label for UI
);

CREATE TABLE IF NOT EXISTS skills (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  career_id       INTEGER NOT NULL,
  name            TEXT NOT NULL,
  description     TEXT,
  order_index     INTEGER NOT NULL,
  estimated_hours INTEGER NOT NULL DEFAULT 20,
  category        TEXT,          -- Foundation | Core | Advanced | Tools
  FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS roadmaps (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL,
  career_id  INTEGER NOT NULL,
  title      TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS progress (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  roadmap_id   INTEGER NOT NULL,
  skill_id     INTEGER NOT NULL,
  status       TEXT NOT NULL DEFAULT 'not_started',  -- not_started | in_progress | completed
  completed_at TEXT,
  UNIQUE (roadmap_id, skill_id),
  FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS learning_resources (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  skill_id INTEGER NOT NULL,
  type     TEXT NOT NULL,       -- doc | video | practice
  title    TEXT NOT NULL,
  url      TEXT NOT NULL,
  is_free  INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favorites (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL,
  resource_id INTEGER NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (user_id, resource_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (resource_id) REFERENCES learning_resources(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project_ideas (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  career_id   INTEGER NOT NULL,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty  TEXT NOT NULL DEFAULT 'Intermediate',  -- Beginner | Intermediate | Advanced
  FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS career_recommendations (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id          INTEGER NOT NULL,
  predicted_career TEXT NOT NULL,
  confidence       REAL NOT NULL,
  input_json       TEXT NOT NULL,
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_skills_career ON skills(career_id);
CREATE INDEX IF NOT EXISTS idx_resources_skill ON learning_resources(skill_id);
CREATE INDEX IF NOT EXISTS idx_progress_roadmap ON progress(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_projects_career ON project_ideas(career_id);
