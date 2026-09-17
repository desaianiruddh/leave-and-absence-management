# Frontend — Leave and Absence Management

POC spec: `01-leave-and-absence-management.md` (repo root). This file translates that spec into
frontend-specific guidance. Anything ambiguous here defers to the spec, not the other way around.

## Stack (as installed)
- React 19 + Vite, Redux Toolkit + react-redux for state, react-router-dom for routing, axios for
  API calls
- Env file: `frontend/.env.local`

## Actors and views (spec §2)

- **Employee:** submit a leave request (leave type, start date, end date, optional note); view
  own balance and request history; view the team calendar.
- **Manager:** everything an Employee can do, plus an approval queue scoped to their direct
  reports only; see team overlap information for a request before/during deciding on it;
  approve or reject with a reason (reason required on reject); the UI must not offer approving
  their own request.
- **HR/Admin** *(optional, stretch)*: configure leave types and allowances; view across all teams.

## UI requirements driven by the backend contract

- **No anonymous path.** Every screen assumes a real authenticated user — route guards on all
  protected routes, and the auth token attached to every API call. There is no guest/demo mode.
- **Leave types are data, not hardcoded.** Fetch leave types (and their rules: draws from
  balance, needs approval, default allowance) from the API so a new type shows up in forms and
  admin screens without a frontend code change.
- **Team calendar must stay usable at company scale.** Request month/team-scoped, paginated data
  from the backend — never fetch everything and filter/aggregate client-side.
- **Overlap warnings come from the backend query**, not from data already sitting in the
  frontend — don't try to compute overlap client-side from a partial list.
- **Approved requests are read-only for dates.** The UI must not offer inline editing of an
  approved request's dates; surface cancel-and-resubmit (or whatever amendment flow the backend
  exposes) instead.
- **Rejection requires a reason** in the UI, mirroring the backend's validation, before the
  reject action can be submitted.
- **Surface backend validation errors usably.** Invalid date ranges, an unknown leave type, a
  balance that would go negative, etc. should be shown per-field where possible, not as a single
  generic toast — the backend is designed to return a response a frontend can actually use for
  this.

## State shape
Structure Redux Toolkit slices around the domain areas the backend exposes (auth, requests,
balances, leave types, calendar) — align slice/selector shapes to whatever API response shapes
are settled on in `backend/CLAUDE.md`'s API design section as those endpoints are built.

## Commands
- `npm run dev` — Vite dev server
- `npm run build` / `npm run preview`
- `npm run lint`
