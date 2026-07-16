# CareerGenie — AI Career Guidance & Roadmap Assistant

A full-stack AI/ML major project. Students enter their skills, interests, and education; a **trained Decision Tree model** recommends a career; the app generates a personalized learning roadmap, tracks progress with charts, and answers questions through a rule-based chatbot with **voice input/output**.

> **No authentication, no paid APIs, no cloud.** Fully demo-able immediately after seeding.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Vite, Tailwind CSS, React Router, Framer Motion, Recharts |
| Backend | Node.js + Express + TypeScript, built-in `node:sqlite` |
| Database | SQLite |
| ML | Python, Pandas, NumPy, Scikit-learn (Decision Tree), Joblib |
| Voice | Browser Web Speech API |

## Project Structure

```
CareerGenie/
├── frontend/   React + Vite client
├── backend/    Express + TypeScript API (node:sqlite)
├── ml/         Python dataset, training & inference
└── data/       SQLite database (generated)
```

## Prerequisites

- **Node.js 24+** (uses the built-in `node:sqlite` module)
- **Python 3.11+** — verified working on **Python 3.14** (scikit-learn 1.9 ships cp314 wheels)

> **Note:** If `pip install` ever fails to find wheels for your exact Python version, create a
> venv with a nearby version and use it for the ML steps:
> ```
> cd ml
> py -3.12 -m venv .venv
> .venv\Scripts\pip install -r requirements.txt
> ```
> Then run the training commands with `.venv\Scripts\python` instead of `python`, and set the
> backend env var `PYTHON_BIN` to that interpreter path (see Backend config).
>
> **How inference stays fast:** `train.py` saves the full scikit-learn model with joblib **and**
> exports the learned decision tree to `model/career_tree.json`. The Node backend spawns
> `predict.py`, which does a pure-Python tree traversal (no heavy `import sklearn` at request
> time) — so each `/predict` call returns in ~1–2s instead of ~12s.

## Setup & Run

### 1. Install dependencies
```bash
npm install                 # root (concurrently)
cd frontend && npm install
cd ../backend && npm install
cd ../ml && python -m pip install -r requirements.txt
```

### 2. Train the ML model
```bash
cd ml
python generate_dataset.py
python train.py
```

### 3. Seed the database
```bash
cd backend
npm run seed
```

### 4. Run the app (from repo root)
```bash
npm run dev
```
- Backend → http://localhost:5000
- Frontend → http://localhost:5173

## Features

- **Home** — animated gradient hero, feature grid, responsive.
- **Career Match** — pick skills/interests/education/domain → a trained Decision Tree predicts one of 7 careers with a confidence score and top alternatives.
- **Roadmap** — timeline & checklist views, per-skill status toggle, search + category filter, live progress.
- **Dashboard** — stat cards + Recharts donut and category bar chart; switch between roadmaps.
- **Resources** — docs/video/practice links per skill, type filters, search, favorites.
- **Project Ideas** — seeded per career, filter by career and difficulty.
- **Compare** — up to three careers side by side, start a roadmap from any.
- **AI Assistant** — rule-based chatbot answering from your roadmap/progress data, with typing animation.
- **Voice** — mic → speech-to-text → chatbot → spoken reply (Web Speech API), with a voice on/off toggle.
- **Dark mode**, loading skeletons, and smooth Framer Motion animations throughout.

> **Demo data:** seeding creates a demo user with a partially-completed **AI Engineer** roadmap, so the dashboard, roadmap and chatbot are populated immediately.

## Troubleshooting

- **Port already in use (5000/5173):** an earlier server may still be running. Find it with
  `netstat -ano | findstr :5000` and stop it, or restart your terminal.
- **`/predict` errors with "Trained model not found":** run the training step (`cd ml && python train.py`).
- **`/predict` errors with "Failed to start Python":** ensure `python` is on your PATH, or set
  `PYTHON_BIN` to your interpreter (e.g. a venv's `python.exe`).
- **Voice buttons don't appear / don't speak:** the Web Speech API needs a supported browser
  (Chrome/Edge) and microphone permission; the mic button is hidden where recognition is unsupported.

## Backend configuration (optional)

Environment variables the backend reads:

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `5000` | Backend port |
| `PYTHON_BIN` | `python` | Python interpreter used for ML inference |

---

_Build phases and full documentation are tracked in the implementation plan._
