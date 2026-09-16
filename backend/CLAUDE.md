# Backend — Leave and Absence Management

POC spec: `01-leave-and-absence-management.md` (repo root). This file translates that spec into
backend-specific guidance. Anything ambiguous here defers to the spec, not the other way around.

## Stack (as installed)
- Express 5, PostgreSQL via `pg`, `jsonwebtoken` for auth, `bcryptjs` for password hashing, `cors`, `dotenv`
- **No ORM, by choice.** The spec's suggested stack is PostgreSQL + Prisma, but this project uses
  raw SQL through `pg` instead — do not introduce Prisma or any other ORM. Write queries directly
  (parameterized, never string-concatenated), keep schema migrations as plain `.sql` files, and
  lean on real Postgres primitives (transactions, `SELECT ... FOR UPDATE`, constraints) for the
  concurrency guarantees below rather than an ORM's abstractions.

## Commands
- `npm run dev` — nodemon src/index.js
- `npm start` — node src/index.js
- Env file: `backend/.env` (`NODE_ENV`, `PORT`, `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`)

## Domain model (spec §4)
Minimum entities:
- **Employees**, each with a manager (self-referencing relationship)
- **Leave types**, each carrying its own rules as data: draws from a balance or not, requires
  manager approval or not, default allowance
- **Balances**, per employee, per leave type, per year
- **Leave requests**, with status and full decision history (not just the final state)

Two open design questions the spec requires you to answer and be ready to defend:
1. How "start of year" balance reset is modeled.
2. Whether remaining balance is calculated on read or maintained as a running total updated on
   approval — and specifically how that choice behaves under the concurrent-approval case below.

## Non-negotiable business rules (spec §3, §6)

1. **No anonymous path.** Every route that performs an action is tied to a real authenticated
   user. Bad input (invalid date range, non-existent leave type, missing employee) must be
   rejected before it reaches business logic, with an error shape a frontend can actually use.

2. **Employee capabilities:** submit leave requests, view own balance and history, view the team
   calendar.

3. **Manager capabilities:** approve/reject requests for direct reports only; cannot approve
   their own request; rejection requires a reason. A manager must never be able to see or act on
   a request belonging to someone outside their reports — including by guessing/reaching the
   request directly by ID. This must be enforced at the query/authorization layer and proven
   with a test, not just hidden in the UI.

4. **Balance integrity:**
   - A request that would take the balance below zero is rejected before it ever reaches an
     approver.
   - Approving a request must deduct from the balance correctly, every time, even when: the same
     request is approved twice near-simultaneously (double approval / double-click), or two
     separate requests for the same employee are approved at nearly the same instant such that
     their combined total would exceed the balance. Neither case may result in over-deduction.
     This is the single most heavily tested behavior in this POC — use real DB-level guarantees
     (row locking such as `SELECT ... FOR UPDATE`, a serializable transaction, a unique
     constraint, or an optimistic-concurrency version column), not application-level checks that
     race.

5. **Leave type rules live in data, not code.** Whether a type draws from a balance, requires
   approval, and its default allowance must be configuration a new leave type can set — adding
   one must never require a new `if` branch in the approval controller. This includes the
   stretch goal of a type with two-step approval above a day threshold.

6. **Approved requests are locked.** No silent edit of dates on an approved request. An edit
   must go through cancel-and-resubmit, or an explicit, justified amendment flow.

7. **Overlap detection** is a real query against the team's other approved/pending leave, not
   data loaded wholesale and filtered in application code. Be ready to explain its cost as the
   team grows.

8. **Team calendar query must scale.** It should stay usable at "one whole company," not just a
   team of five — design the query (indexing, date-range scoping) with that in mind up front.

9. **Audit trail.** Every approval and rejection records who acted and when (and the reason, for
   rejections) — this is the record of truth if a decision is disputed later.

## API design
No prescribed routes (spec §5) — the functional requirements in §3 are the actual spec. Design
endpoints around the workflow: auth, leave requests (submit / list / get / cancel), approvals
(manager queue / decide), balances, leave types (admin config), team calendar.

## Testing expectations (spec §6)
- A concurrency test that actually exercises simultaneous approval attempts against the same
  balance — a sequential-only test does not satisfy this requirement.
- An authorization test proving a manager cannot fetch or act on a request belonging to another
  manager's report, by ID.

## Ops

**Deliberate deviation from spec §6:** the spec asks for the whole system to come up via
`docker compose up` with no manual setup beyond a documented `.env`. This project does not use
Docker — that requirement is knowingly not being met. Instead, the backend runs against a
locally installed PostgreSQL: create a database, apply the `.sql` schema/migration files, and
point `DATABASE_URL` at it. Keep `.env`/README setup instructions accurate for that path since
it's now the actual "no manual setup beyond docs" bar this project is held to. If this is
revisited later (e.g. for the walkthrough), containerizing at that point is still an option —
nothing here should require Docker to be unwindable.
