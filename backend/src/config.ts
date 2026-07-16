import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const PORT = Number(process.env.PORT) || 5000;

// Single demo user owns all roadmaps/progress (no auth in this project).
export const DEMO_USER_ID = 1;

// Python interpreter used for ML inference (override with PYTHON_BIN).
export const PYTHON_BIN = process.env.PYTHON_BIN || 'python';

// Absolute path to ml/predict.py  (backend/src -> ../../ml/predict.py)
export const PREDICT_SCRIPT = join(__dirname, '..', '..', 'ml', 'predict.py');
export const ML_DIR = join(__dirname, '..', '..', 'ml');
