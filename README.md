# Leave and Absence Management

A full-stack POC where employees request leave against a real balance, managers approve or
reject it, and the team can see who's away without asking around. Full requirements live in
[`01-leave-and-absence-management.md`](./01-leave-and-absence-management.md) — that document is
the spec; this README is just how to run the thing.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Redux Toolkit, React Router, Axios |
| Backend | Express 5, raw SQL via `pg` (no ORM — see [`backend/CLAUDE.md`](./backend/CLAUDE.md)), JWT auth |
| Database | PostgreSQL |

See [`backend/CLAUDE.md`](./backend/CLAUDE.md) and [`frontend/CLAUDE.md`](./frontend/CLAUDE.md)
for the design rules each side is held to (concurrency-safe approvals, data-driven leave types,
manager scoping, audit trail, etc.).

## Repo structure

```
backend/    Express API, PostgreSQL access, auth, business logic
frontend/   React app (employee / manager / admin views)
```

## Running locally

**No Docker, by choice.** The spec (§6) asks for `docker compose up` as the eventual bar this POC
is checked against, but this project deliberately runs against a locally installed PostgreSQL
instead — there is no `docker-compose.yml` and none is planned. Setup is: install Postgres
locally, point `DATABASE_URL` at it, run the app with npm.

```bash
npm run install:all   # installs root, frontend, and backend dependencies
npm run dev            # runs frontend (Vite) and backend (nodemon) concurrently
```

Or individually:

```bash
npm run dev:backend
npm run dev:frontend
```

### Environment

- `backend/.env` — `NODE_ENV`, `PORT`, `DATABASE_URL` (pointing at your local Postgres), `JWT_SECRET`, `CORS_ORIGIN`
- `frontend/.env.local` — API base URL for the backend

### Database

Create a local database and run the schema/migration `.sql` files under `backend/` against it
(plain SQL, no ORM — see [`backend/CLAUDE.md`](./backend/CLAUDE.md)). Point `DATABASE_URL` at
that database before starting the backend.

## Actors

- **Employee** — submit leave requests, view own balance/history, view team calendar
- **Manager** — approve/reject their reports' requests, see team overlaps, cannot approve their own request
- **HR/Admin** *(stretch)* — configure leave types and allowances, cross-team view

Full functional requirements, edge cases, and what the POC is checked for are in
[`01-leave-and-absence-management.md`](./01-leave-and-absence-management.md).
