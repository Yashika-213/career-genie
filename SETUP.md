# CareerGenie — Setup on a New Machine

Follow these steps to run the project from the shared zip on a fresh computer.

---

## 1. Before you zip (on THIS machine)

To keep the zip small and avoid platform-specific junk, **delete these folders** before zipping
(they are all regenerated on the new machine):

```
node_modules/            (repo root)
frontend/node_modules/
backend/node_modules/
ml/.venv/                (only if it exists)
frontend/dist/           (only if it exists)
backend/dist/            (only if it exists)
```

> You may KEEP `ml/model/` and `ml/dataset.csv` and `data/careergenie.db` in the zip — if present,
> you can skip the training/seeding steps on the new machine. If you remove them, just run the
> train + seed steps below to recreate them.

Then zip the whole `CareerGenie` folder.

---

## 2. Install prerequisites (on the NEW machine)

1. **Node.js 24 or newer** — https://nodejs.org (the project uses Node's built-in `node:sqlite`,
   which requires Node 24+). Verify:
   ```
   node --version      # should print v24.x or higher
   ```
2. **Python 3.11+** (3.14 works) — https://www.python.org/downloads/
   During install, tick **"Add Python to PATH"**. Verify:
   ```
   python --version
   ```
   > If `python` isn't found, try `py --version`. Use `py` in place of `python` in the commands below.

---

## 3. Unzip and install dependencies

Open a terminal **in the unzipped `CareerGenie` folder**, then:

```
npm install
cd frontend && npm install
cd ../backend && npm install
cd ../ml && python -m pip install -r requirements.txt
```

> Use `python -m pip`, not `pip` — it works even when `pip` isn't on the PATH.

---

## 4. Train the model  (skip if `ml/model/career_tree.json` is present in the zip)

```
cd ml
python generate_dataset.py
python train.py
```
You should see a training/test accuracy printout and two files created in `ml/model/`.

---

## 5. Seed the database  (skip if `data/careergenie.db` is present in the zip)

```
cd ../backend
npm run seed
```
Prints: `seeded 7 careers, 69 skills, 207 resources, 28 projects`.

---

## 6. Run the app

From the **repo root**:
```
cd ..
npm run dev
```
- Backend → http://localhost:5000
- Frontend → http://localhost:5173  ← open this in Chrome/Edge

That's it. The demo user already has an in-progress roadmap, so every page is populated immediately.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `'pip' is not recognized` | Use `python -m pip install -r requirements.txt` |
| `'python' is not recognized` | Use `py` instead, or reinstall Python with **Add to PATH** ticked |
| `/predict` says *Trained model not found* | Run step 4 (`python train.py`) |
| `/predict` says *Failed to start Python* | Ensure `python` is on PATH, or set env var `PYTHON_BIN` to your python path |
| Port 5000 or 5173 already in use | Close the other program, or restart the terminal |
| Voice mic button missing | Voice needs Chrome/Edge + microphone permission (browser-only feature) |
| `npm install` fails on Node < 24 | Upgrade Node.js — `node:sqlite` requires v24+ |
