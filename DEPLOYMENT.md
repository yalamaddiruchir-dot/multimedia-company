# Deploying ReelLine to Railway

This covers: fixing the local frontend↔backend connection, deploying to
Railway, and using the demo mode that's now built into the app.

---

## 1. Fix the local "network/CORS error"

Your `.env` correctly points the frontend at `http://localhost:8080`, and
Vite's default port (`5173`) was already in the backend's allowed CORS list —
so a real CORS mismatch wasn't actually the cause. In practice this error
almost always means **the backend (or its database) isn't actually up** when
the frontend tries to call it; the browser reports that as a vague
network/CORS-looking failure either way. Checklist, in order:

```bash
# 1. Is Postgres/Redis running?
docker ps                     # should show reelline-postgres and reelline-redis
docker-compose up -d postgres redis

# 2. Is the backend actually up and using the right profile?
cd backend
export DATABASE_URL=jdbc:postgresql://localhost:5432/reelline
export DATABASE_USERNAME=reelline
export DATABASE_PASSWORD=reelline123
export JWT_SECRET=change-me-min-256-bits-xxxxxxxxxxxxxxxxxxxxxxxxxx
export REDIS_HOST=localhost
export REDIS_PORT=6379
./mvnw spring-boot:run
# confirm:
curl http://localhost:8080/actuator/health   # expect {"status":"UP"}

# 3. Is the frontend pointed at the right URL?
cat .env    # VITE_API_URL=http://localhost:8080
npm run dev
```

I also fixed a real bug while in here: `SecurityConfig.java` had the list of
allowed CORS origins **hardcoded** to `localhost:3000`/`5173`, completely
ignoring the `CORS_ORIGINS` environment variable that `application.yml`
already documented. That meant no deployed frontend domain could ever work
without editing Java source. It now reads from `cors.allowed-origins`
(`CORS_ORIGINS` env var), so deployment just becomes an env var away.

---

## 2. Demo mode (now built into the app)

Two options are on the Login screen:

- **"Try Instant Demo"** — logs you in immediately using mock data
  (`src/data/mock.ts`) with zero backend calls. Works even if no backend is
  deployed at all. A purple "DEMO MODE · Exit" badge appears in the top bar.
- **"Use seeded demo account"** — logs in for real against
  `aarav@reelline.io` / `password123`, which your existing `DataInitializer`
  already seeds on first backend startup (along with 7 team members and 8
  sample projects). Use this once your backend + Postgres are actually
  running, locally or deployed.

No new env vars needed for this — it's pure frontend logic in
`AuthContext.tsx` / `api.ts` plus two buttons on `Login.tsx`.

---

## 3. Deploy to Railway

Railway is a good fit here because it can host the Spring Boot backend, the
Postgres + Redis instances, and the static frontend build as three services
in one project, with private networking between them.

### Step 1 — Create the project and databases
1. [railway.app](https://railway.app) → **New Project** → **Empty Project**.
2. **+ New** → **Database** → **Add PostgreSQL**.
3. **+ New** → **Database** → **Add Redis**.

Railway auto-generates connection variables for these (`DATABASE_URL`,
`REDISHOST`, `REDISPORT`, etc.) — note the exact names shown in each
service's **Variables** tab, since they don't always match your app's
expected names one-to-one.

### Step 2 — Deploy the backend
1. **+ New** → **GitHub Repo** (connect/push this project to GitHub first)
   → select the repo → set **Root Directory** to `backend`.
2. Railway will detect `backend/Dockerfile` (added for you) and build with
   it — no Maven install needed on Railway's side.
3. In the backend service's **Variables** tab, add (reference the Postgres/
   Redis service variables using Railway's `${{ServiceName.VAR}}` syntax
   where possible):
   ```
   DATABASE_URL=jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}
   DATABASE_USERNAME=${{Postgres.PGUSER}}
   DATABASE_PASSWORD=${{Postgres.PGPASSWORD}}
   REDIS_HOST=${{Redis.REDISHOST}}
   REDIS_PORT=${{Redis.REDISPORT}}
   REDIS_PASSWORD=${{Redis.REDISPASSWORD}}
   JWT_SECRET=<generate a random 256-bit string>
   SERVER_PORT=8080
   CORS_ORIGINS=https://<your-frontend-domain>.up.railway.app
   ```
   (You'll fill in `CORS_ORIGINS` with the real frontend URL after Step 3 —
   Railway lets you edit variables and redeploy any time.)
4. **Settings** → **Networking** → **Generate Domain** to get a public URL,
   e.g. `reelline-backend-production.up.railway.app`.
5. Check it worked: `curl https://<backend-domain>/actuator/health`.

### Step 3 — Deploy the frontend
1. **+ New** → **GitHub Repo** → same repo → **Root Directory** left as `/`
   (the project root).
2. Railway will use the root `railway.json` (added for you) — it runs
   `npm ci && npm run build`, then serves the built `dist/` folder with
   `serve` on Railway's assigned `$PORT`.
3. **Variables**:
   ```
   VITE_API_URL=https://<your-backend-domain>.up.railway.app
   ```
4. **Settings** → **Networking** → **Generate Domain**.
5. Go back to the backend service's `CORS_ORIGINS` variable and set it to
   this frontend domain, then redeploy the backend.

### Step 4 — Verify
- Visit the frontend URL → **Try Instant Demo** should work immediately
  regardless of backend status.
- **Use seeded demo account** should work once the backend is healthy and
  `DataInitializer` has run (check backend logs for `✅ Created 8 sample
  projects`).

---

## 4. AWS / Azure — when you outgrow Railway

Railway is the right starting point for this stack. If/when you need AWS or
Azure specifically (compliance, existing infra, scale), the shapes map like
this — happy to write out either in full detail if you decide to go that
route:

| Piece | AWS | Azure |
|---|---|---|
| Backend (Spring Boot) | Elastic Beanstalk or App Runner (simplest) / ECS Fargate | App Service (Java 21) or Container Apps |
| Frontend (static Vite build) | S3 + CloudFront | Static Web Apps or Storage + CDN |
| Postgres | RDS for PostgreSQL | Azure Database for PostgreSQL |
| Redis | ElastiCache | Azure Cache for Redis |
| Secrets/env vars | Secrets Manager / Parameter Store | Key Vault + App Service config |

Both require considerably more manual setup (VPCs, IAM roles, security
groups / network rules) than Railway's managed networking — that's the
trade-off for more control.

---

## Files added/changed for this
- `backend/src/main/java/com/reelline/config/SecurityConfig.java` — CORS now reads `cors.allowed-origins` instead of a hardcoded localhost list
- `src/context/AuthContext.tsx` — added `loginDemo()` / `isDemo`
- `src/api/api.ts` — demo-mode requests short-circuit instead of hitting the network; demo sessions are never force-logged-out on failed calls
- `src/pages/Login.tsx` — "Try Instant Demo" and "Use seeded demo account" buttons
- `src/components/layout/TopBar.tsx` — demo mode badge + quick exit
- `backend/Dockerfile`, `backend/railway.json`, `railway.json`, `package.json` (`start` script) — Railway deploy config
