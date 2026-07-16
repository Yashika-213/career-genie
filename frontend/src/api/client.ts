import axios, { AxiosError } from 'axios';

// Vite dev server proxies /api -> http://localhost:5000 (see vite.config.ts).
export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export interface ApiEnvelope<T> {
  data: T;
}

export interface ApiErrorShape {
  message: string;
  details?: unknown;
}

/** Extracts a human-readable message from an axios error. */
export function getErrorMessage(err: unknown): string {
  if (err instanceof AxiosError) {
    const payload = err.response?.data as { error?: ApiErrorShape } | undefined;
    if (payload?.error?.message) {
      const details = payload.error.details;
      if (Array.isArray(details) && details.length) {
        return `${payload.error.message}: ${details
          .map((d: { message?: string }) => d.message)
          .filter(Boolean)
          .join(', ')}`;
      }
      return payload.error.message;
    }
    return err.message;
  }
  return err instanceof Error ? err.message : 'Something went wrong';
}

/** Unwraps the { data } envelope from a successful response. */
export async function unwrap<T>(promise: Promise<{ data: ApiEnvelope<T> }>): Promise<T> {
  const res = await promise;
  return res.data.data;
}
