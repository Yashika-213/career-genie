# CareerGenie backend — Node 24 (for node:sqlite) + Python 3 (for ml/predict.py).
# Deploys the EXISTING code unchanged: Express still spawns ml/predict.py.
FROM node:24-bookworm-slim

# predict.py uses only the Python standard library at request time, so we just
# need a python3 interpreter — no pip installs required.
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the whole repo (backend needs ../ml/predict.py and ../ml/model at runtime).
COPY . .

# Install backend deps (incl. dev deps: tsc/tsx are needed to build & seed).
RUN cd backend && npm install && npm run build

# Point the backend at the container's Python interpreter.
ENV PYTHON_BIN=python3
# Render/most hosts inject $PORT; the backend already reads process.env.PORT.
ENV PORT=10000
EXPOSE 10000

# Seed the (ephemeral) SQLite DB on every boot, then start the API.
CMD ["sh", "-c", "cd backend && node dist/db/seed.js && node dist/index.js"]
