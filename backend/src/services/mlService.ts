import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { PYTHON_BIN, PREDICT_SCRIPT, ML_DIR } from '../config.js';
import { ApiError } from '../utils/ApiError.js';

export interface PredictInput {
  skills: string[];
  interests: string[];
  education: string;
  domain: string;
}

export interface PredictResult {
  career: string;
  confidence: number;
  probabilities: Record<string, number>;
}

const MODEL_PATH = join(ML_DIR, 'model', 'career_model.joblib');

/** Spawns ml/predict.py, feeds JSON on stdin, parses JSON from stdout. */
export function predictCareer(input: PredictInput): Promise<PredictResult> {
  return new Promise((resolve, reject) => {
    if (!existsSync(PREDICT_SCRIPT)) {
      return reject(ApiError.internal('ML predict script not found. Did you set up the ml/ folder?'));
    }
    if (!existsSync(MODEL_PATH)) {
      return reject(
        ApiError.internal('Trained model not found. Run `cd ml && python train.py` first.'),
      );
    }

    const child = spawn(PYTHON_BIN, [PREDICT_SCRIPT], {
      cwd: ML_DIR,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    let settled = false;

    const fail = (err: Error) => {
      if (settled) return;
      settled = true;
      reject(err);
    };

    // Guard against a hung interpreter.
    const timer = setTimeout(() => {
      child.kill();
      fail(ApiError.internal('ML prediction timed out.'));
    }, 15000);

    child.on('error', (err) => {
      clearTimeout(timer);
      fail(
        ApiError.internal(
          `Failed to start Python ("${PYTHON_BIN}"). Is Python installed / PYTHON_BIN correct? ${err.message}`,
        ),
      );
    });

    child.stdout.on('data', (d) => (stdout += d.toString()));
    child.stderr.on('data', (d) => (stderr += d.toString()));

    child.on('close', (code) => {
      clearTimeout(timer);
      if (settled) return;
      try {
        const parsed = JSON.parse(stdout.trim());
        if (parsed.error) return fail(ApiError.internal(`ML error: ${parsed.error}`));
        if (code !== 0) return fail(ApiError.internal(`Python exited with code ${code}. ${stderr}`));
        settled = true;
        resolve(parsed as PredictResult);
      } catch {
        fail(
          ApiError.internal(
            `Could not parse ML output. code=${code} stdout="${stdout.slice(0, 200)}" stderr="${stderr.slice(0, 200)}"`,
          ),
        );
      }
    });

    child.stdin.write(JSON.stringify(input));
    child.stdin.end();
  });
}
