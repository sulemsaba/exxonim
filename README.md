# Exxonim Monorepo

This repository is the frontend monorepo for Exxonim.

It contains:

- the public website in `apps/public`
- the main admin app in `apps/admin-next`
- the deprecated legacy admin in `apps/admin`
- shared frontend packages in `packages/shared`
- shared admin packages in `packages/admin-core`

The backend does not live in this repo. It must exist as the sibling folder:

- `../exxonim_backend`

## Who This README Is For

This README is written for:

- Linux users
- local development
- new contributors
- beginners who want the fastest working setup first

This guide assumes:

- you are using a Linux shell
- you want to run the project locally
- the frontend repo is `exxonim/`
- the backend repo is a sibling folder at `../exxonim_backend`

Windows and macOS are out of scope for this README.

## Expected Folder Layout

The scripts in this repo expect this sibling layout:

```text
~/nim/
├── exxonim/
└── exxonim_backend/
```

If your folders are not laid out like this, some scripts will fail.

## Step 0: Clone Both Repos Into Sibling Folders

If you do not already have both repos, run:

```bash
mkdir -p ~/nim
cd ~/nim

git clone https://github.com/sulemsaba/exxonim.git exxonim
git clone https://github.com/sulemsaba/exxonim_backend.git exxonim_backend

cd exxonim
```

If you already have both folders and they already live side by side, go into the frontend repo:

```bash
cd ~/nim/exxonim
```

## Step 1: Check Required Tools

Run these commands first:

```bash
git --version
node --version
npm --version
python3 --version
psql --version
pg_isready --version
pg_ctl --version
initdb --version
```

If one of these says `command not found`, install that tool before continuing.

Required tools:

- `git`
- `node`
- `npm`
- `python3`
- Python virtual environment support: `python3 -m venv`
- PostgreSQL CLI tools:
  - `psql`
  - `pg_isready`
  - `pg_ctl`
  - `initdb`

If `python3 -m venv` fails, install Python venv support using your Linux distribution's package manager.

## Step 2: Understand What You Are Running

The local Exxonim stack has 4 moving parts:

1. PostgreSQL
2. the FastAPI backend in `../exxonim_backend`
3. the public website in this repo
4. the admin website in this repo

The browser does not talk to PostgreSQL directly.
The browser talks to the backend API, and the backend talks to PostgreSQL.

If one part is missing, the stack is only partially healthy.

## Step 3: Create The `.env` Files

Create the frontend `.env`:

```bash
cp .env.example .env
```

Create the backend `.env`:

```bash
cp ../exxonim_backend/.env.example ../exxonim_backend/.env
```

If either `.env` file already exists, do not blindly overwrite it. Open it and review it instead.

## Step 4: Make Scripts Executable

If your Linux machine does not preserve executable permissions from Git, you can get `Permission denied` when running scripts.

Run:

```bash
chmod +x scripts/*.sh
chmod +x ../exxonim_backend/scripts/*.sh 2>/dev/null || true
```

If a script later says `Permission denied`, rerun the commands above and try again.

## Step 5: Install Frontend Dependencies

From this repo:

```bash
npm install
```

You do not need to manually create the backend virtual environment first. The helper scripts can create it for you when needed.

## Local Defaults

These are the default local values used by the root scripts unless you override them in `.env`.

| Setting | Default |
| --- | --- |
| Public site | `http://127.0.0.1:5173` |
| Admin app | `http://127.0.0.1:3039` |
| Legacy admin | `http://127.0.0.1:5174` |
| Backend API | `http://127.0.0.1:8000` |
| Health live | `http://127.0.0.1:8000/health/live` |
| Health ready | `http://127.0.0.1:8000/health/ready` |
| PostgreSQL host | `127.0.0.1` |
| PostgreSQL port | `5433` |
| Database name | `Exxonim` |
| Database app user | `app_user` |
| Database app password | `strongpassword` |
| Default API base | `http://127.0.0.1:8000/api/v1` |
| Backend folder | `../exxonim_backend` |
| Access cookie | `exxonim_access_token` |
| Refresh cookie | `exxonim_refresh_token` |
| CSRF cookie | `exxonim_csrf_token` |
| Consent cookie | `exxonim_consent` |

## Fastest Linux Path From Zero

If you want the shortest copy-paste path from a fresh Linux setup, run these commands from `~/nim/exxonim`:

```bash
cd ~/nim/exxonim
cp .env.example .env
cp ../exxonim_backend/.env.example ../exxonim_backend/.env
chmod +x scripts/*.sh
chmod +x ../exxonim_backend/scripts/*.sh 2>/dev/null || true
npm install
./scripts/seed-local-demo.sh
./scripts/dev.sh
```

What these commands do:

- `cp ... .env`
  - creates the expected local environment files
- `chmod +x ...`
  - fixes script permissions if Linux complains
- `npm install`
  - installs frontend dependencies
- `./scripts/seed-local-demo.sh`
  - ensures PostgreSQL is available
  - runs migrations
  - seeds roles and permissions
  - seeds local public content defaults
  - creates or updates the local demo admin account
- `./scripts/dev.sh`
  - runs DB setup
  - starts the backend
  - starts the public app
  - starts the admin app

After `./scripts/dev.sh` starts, keep that terminal open.

Then open:

- Public site: `http://127.0.0.1:5173`
- Admin app: `http://127.0.0.1:3039`

## Local Demo Credentials

These credentials are for local development only.
Do not use them in staging or production.

| Field | Value |
| --- | --- |
| Email | `demo.admin@exxonim.dev` |
| Password | `Admin123!` |
| Full name | `Local Demo Admin` |
| Role | `administrator` |

If you want a custom full-access account instead, use:

```bash
./scripts/create-superuser.sh
```

If you want to reuse the demo admin for local smoke checks:

```bash
export SMOKE_ADMIN_EMAIL="demo.admin@exxonim.dev"
export SMOKE_ADMIN_PASSWORD="Admin123!"
```

## Manual Linux Startup Path

Use this path if you want to understand each layer separately.

### Terminal guidance

Open multiple terminals.

- Terminal 1 is for setup commands
- Terminal 2 stays open for the backend
- Terminal 3 stays open for the public app
- Terminal 4 stays open for the admin app

Do not close the terminals that are running the backend or frontend apps.
Use a new terminal for extra commands if you need one.

### Terminal 1: prepare PostgreSQL

```bash
./scripts/setup-db.sh
```

Expected success:

```text
Database is ready:
  DATABASE_URL=postgresql+asyncpg://app_user:strongpassword@127.0.0.1:5433/Exxonim
```

After this command finishes, Terminal 1 can be reused for extra commands.

### Terminal 2: start the backend

```bash
./scripts/start-backend.sh
```

Expected success includes:

- Alembic migrations run
- roles and permissions are seeded
- you see `Starting backend on http://127.0.0.1:8000`

Keep Terminal 2 open while the backend is running.

### Terminal 3: start the public app

```bash
./scripts/start-public.sh
```

Expected success includes:

- `Starting public app on http://127.0.0.1:5173`

Keep Terminal 3 open while the public app is running.

### Terminal 4: start the admin app

```bash
./scripts/start-admin.sh
```

Expected success includes:

- `Starting admin-next on http://127.0.0.1:3039`

Keep Terminal 4 open while the admin app is running.

### Optional: seed demo data and login

If you skipped the fast path, run this once before signing in:

```bash
./scripts/seed-local-demo.sh
```

## What Success Looks Like

### Database

- `./scripts/setup-db.sh` finishes without error
- PostgreSQL is reachable on `127.0.0.1:5433`

### Backend

These should work in the browser or terminal:

```bash
curl http://127.0.0.1:8000/health/live
curl http://127.0.0.1:8000/health/ready
```

Healthy responses:

```json
{"status":"alive"}
```

```json
{"status":"ready"}
```

### Public Website

At `http://127.0.0.1:5173` you should see the Exxonim public site shell.

If the backend content APIs are healthy:

- pages load real content
- pricing, blog, navigation, testimonials, and settings load normally

If the backend is temporarily unavailable:

- the public shell may still render
- some sections will show clear UI errors such as:
  - `Unable to load the homepage.`
  - `Unable to load resources.`
  - `This page could not be loaded right now.`

### Admin Website

At `http://127.0.0.1:3039` you should see the Exxonim admin sign-in screen.

After signing in with the local demo admin, you should be able to open:

- dashboard
- notifications
- reports
- service requests
- privacy requests

You should also be able to perform normal administrator actions without being forced to use a superuser account.

## If You Skipped A Step

| If you skipped this | What you will usually see | What to do |
| --- | --- | --- |
| cloning the backend repo into a sibling folder | `Backend directory not found at ../exxonim_backend.` | Place the backend repo next to this repo or set `EXXONIM_BACKEND_DIR` |
| checking required tools | later commands fail with `command not found` | install the missing tool first |
| `chmod +x scripts/*.sh` on a machine with bad script permissions | `Permission denied` | rerun the `chmod +x` commands and try again |
| `npm install` | `npm` fails, missing package errors, Vite cannot start | run `npm install` from this repo |
| PostgreSQL CLI tools are missing | `Missing required command: psql`, `pg_ctl`, `initdb`, or `pg_isready` | install PostgreSQL client/server tools |
| PostgreSQL is not running | `PostgreSQL is not reachable on 127.0.0.1:5433.` | run `./scripts/setup-db.sh` or start the backend PostgreSQL helper |
| migrations were not applied | backend boot may fail or features break in strange ways | run `./scripts/start-backend.sh` or `alembic upgrade head` in the backend repo |
| roles were not seeded | admin auth or permissions can behave incorrectly | run `python scripts/seed_roles_permissions.py` in `../exxonim_backend` or use the root scripts |
| demo admin was not seeded | sign-in fails with invalid credentials | run `./scripts/seed-local-demo.sh` |
| backend is not running | public pages show load errors, admin login cannot complete, health endpoints fail | start the backend with `./scripts/start-backend.sh` |
| public/admin is pointed at the wrong API URL | UI loads but data stays broken | check `VITE_API_URL` in `.env` |
| browser session or CSRF state is missing | admin writes fail with CSRF-related errors | sign out, refresh the browser, sign in again, then retry |

## How To Know There Is An Error

### 1. Terminal output

Always read the terminal that started the failing process first.

Common examples:

- backend startup errors
- migration failures
- missing command errors
- Vite compile errors
- Python import errors

### 2. Health endpoints

Use these when you are unsure whether the backend is really healthy:

```bash
curl http://127.0.0.1:8000/health/live
curl http://127.0.0.1:8000/health/ready
```

What they mean:

- `/health/live` failing usually means the backend process is not up
- `/health/ready` returning `503` usually means the database is not ready

If the DB is unhealthy, the backend returns:

```json
{"detail":"Database is not ready."}
```

### 3. Admin sign-in problems

If your credentials are wrong, the backend returns:

```text
Invalid email or password
```

The admin UI usually shows:

```text
Sign in failed. Check your credentials.
```

If you used the demo credentials and they do not work, rerun:

```bash
./scripts/seed-local-demo.sh
```

### 4. Admin write problems

If you can sign in but saving or updating fails, check for CSRF or session problems.

Common backend messages:

- `Missing CSRF token.`
- `Invalid CSRF token.`
- `Invalid refresh session.`
- `Admin account is inactive`

The fastest beginner fix is usually:

1. sign out
2. refresh the browser
3. sign in again
4. retry the action

### 5. Public content problems

The public app already exposes user-facing loading and failure states.

Examples:

- `Unable to load the homepage.`
- `Unable to load resources.`
- `The contact page content could not be loaded right now.`

That usually means:

- the backend is down
- the content API route is failing
- the frontend is pointing at the wrong API base URL

## What To Do If A Command Says `command not found`

If a required command is missing, install it using your Linux distribution's package manager.

Typical examples:

- if `git` is missing, install Git
- if `node` or `npm` is missing, install Node.js and npm
- if `psql`, `pg_ctl`, `pg_isready`, or `initdb` is missing, install PostgreSQL tools
- if `python3 -m venv` fails, install Python venv support

Do not keep going until the missing command is installed. The later setup steps depend on it.

## How To Stop The Project

### Normal stop

In each running terminal, press:

```text
Ctrl + C
```

If you used `./scripts/dev.sh`, press `Ctrl + C` in that one terminal and it will stop the stack it started.

### If a port is stuck

Check which process is using the port:

```bash
lsof -i :8000
lsof -i :5173
lsof -i :3039
```

Then stop the process with:

```bash
kill -9 <PID>
```

Only do this if the normal `Ctrl + C` shutdown did not work.

## Useful Commands

From this repo:

```bash
./scripts/dev.sh
./scripts/setup-db.sh
./scripts/start-backend.sh
./scripts/start-public.sh
./scripts/start-admin.sh
./scripts/seed-local-demo.sh
./scripts/create-superuser.sh
./scripts/predeploy-check.sh
./scripts/deploy-smoke-check.sh
npm run typecheck
npm run build:public
npm run build:admin
```

From `../exxonim_backend`:

```bash
python -m app.cli.predeploy_check --strict
alembic upgrade head
python scripts/seed_roles_permissions.py
python scripts/seed_local_defaults.py
python scripts/create_admin.py --email demo.admin@exxonim.dev --password Admin123! --full-name "Local Demo Admin" --role administrator --upsert
python -m app.cli.superuser --email you@example.com
```

## Project Layout

```text
apps/
  public/        public website
  admin-next/    main admin app
  admin/         deprecated legacy admin
packages/
  shared/        shared API helpers and contracts
  admin-core/    shared admin services and admin route helpers
scripts/         local setup, startup, and ops helpers
```

## Rules For New Work

- build new admin work in `apps/admin-next`
- treat `apps/admin` as deprecated
- keep shared browser/API contracts in `packages/shared`
- keep shared admin logic in `packages/admin-core`
- keep backend record truth in `../exxonim_backend`

## Deeper Docs

Read these after this README, not before it:

- [PROJECT_ARCHITECTURE_DIAGRAM.md](PROJECT_ARCHITECTURE_DIAGRAM.md)
- [DEPLOYMENT_HANDOFF.md](DEPLOYMENT_HANDOFF.md)
- [docs/permission-matrix.md](docs/permission-matrix.md)
- [docs/data-retention-matrix.md](docs/data-retention-matrix.md)
- [docs/release-checklist.md](docs/release-checklist.md)
