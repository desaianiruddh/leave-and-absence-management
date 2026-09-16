# Frontend — Leave and Absence Management

React app for the leave management POC. See [`CLAUDE.md`](./CLAUDE.md) for the UI requirements
this frontend must satisfy, and the repo root
[`01-leave-and-absence-management.md`](../01-leave-and-absence-management.md) for the full spec.

## Stack

- React 19 + Vite
- Redux Toolkit + React Redux for state
- React Router for routing
- Axios for API calls

## Setup

```bash
npm install
npm run dev        # Vite dev server
npm run build       # production build
npm run preview     # preview the production build
npm run lint
```

### Environment variables

`.env.local` holds the backend API base URL the app talks to.

## Views by actor

- **Employee** — submit a leave request, view own balance and history, view the team calendar
- **Manager** — approval queue for direct reports, overlap info per request, approve/reject with
  reason (cannot approve own request)
- **HR/Admin** *(stretch)* — configure leave types/allowances, cross-team view

## Notes

- Every screen assumes an authenticated user — there's no anonymous/guest path.
- Leave types are fetched from the API, not hardcoded, so a new type appears without a frontend
  change.
- The team calendar and any request lists are expected to be paginated/scoped server-side —
  don't fetch everything and filter client-side.
