# Backend — Leave and Absence Management

Express API backing the leave management POC. See [`CLAUDE.md`](./CLAUDE.md) for the business
rules and design constraints this backend must satisfy, and the repo root
[`01-leave-and-absence-management.md`](../01-leave-and-absence-management.md) for the full spec.

## Stack

- Express 5
- PostgreSQL via `pg` — **no ORM**, raw parameterized SQL, plain `.sql` migrations
- `jsonwebtoken` for auth, `bcryptjs` for password hashing, `cors`, `dotenv`

## Setup

```bash
npm install
cp .env.example .env   # if present — otherwise create .env with the vars below
npm run dev             # nodemon, restarts on change
npm start                # plain node
```

### Environment variables

| Var | Purpose |
|---|---|
| `NODE_ENV` | `development` / `production` |
| `PORT` | port the API listens on |
| `DATABASE_URL` | connection string for your local PostgreSQL |
| `JWT_SECRET` | signing secret for auth tokens |
| `CORS_ORIGIN` | allowed frontend origin |

**No Docker.** This backend is developed against a locally installed PostgreSQL, by choice — there
is no `docker-compose.yml`/container for the database. Install Postgres locally, create a
database, run the schema/migration `.sql` files against it, and point `DATABASE_URL` at that
database before starting the API.

## Structure

```
src/
  index.js        entry point
  config/         env/db config
  controllers/    route handlers / business logic
  middleware/     auth, validation, error handling
  models/         data access (raw SQL, no ORM)
  routes/         Express routers
```

## Key constraints (see CLAUDE.md for full detail)

- No anonymous routes — every action is tied to an authenticated user.
- Leave type rules (balance-drawing, approval-required, default allowance) are data, not
  `if` branches in the approval controller.
- Approving a request must deduct from balance correctly under concurrent approval attempts —
  enforced with real Postgres transactions/locking, not application-level checks.
- A manager can only see/act on their own reports' requests, enforced at the query layer.
- Every approval/rejection is recorded with who and when for audit purposes.
