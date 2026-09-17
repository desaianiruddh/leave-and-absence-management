CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  department VARCHAR(100),
  role VARCHAR(50) NOT NULL DEFAULT 'employee',
  -- employee, manager, admin
  manager_id INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leave types: each type's rules are data, not code (CLAUDE.md rule #5), so a new type never
-- requires a new `if` branch in the approval controller.
CREATE TABLE leave_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  default_allocation_days NUMERIC(5, 1) NOT NULL DEFAULT 20,
  draws_from_balance BOOLEAN NOT NULL DEFAULT TRUE,
  requires_approval BOOLEAN NOT NULL DEFAULT TRUE,
  -- NULL = always single-step approval. Otherwise, a request whose days_requested exceeds this
  -- threshold needs a second approval on top of the first (stretch goal, CLAUDE.md rule #5).
  two_step_threshold_days NUMERIC(5, 1),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Balances: per employee, per leave type, per year (open design question #1 in CLAUDE.md — a
-- new year is a new row here rather than an in-place reset, so history of prior years survives).
--
-- used_days is a maintained running total, not derived on read (open design question #2): it is
-- updated in the same transaction that approves a request, after taking a row lock with
-- SELECT ... FOR UPDATE on this row. That serializes concurrent approvals for the same
-- employee/leave_type/year so double-approval and near-simultaneous approvals can't
-- over-deduct (CLAUDE.md rule #4). The CHECK below is a last-line DB-level guarantee against
-- the balance ever going negative or over-drawn.
CREATE TABLE balances (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  leave_type_id INT NOT NULL REFERENCES leave_types(id),
  year INT NOT NULL,
  allocated_days NUMERIC(5, 1) NOT NULL,
  carried_over_days NUMERIC(5, 1) NOT NULL DEFAULT 0,
  used_days NUMERIC(5, 1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, leave_type_id, year),
  CHECK (used_days >= 0),
  CHECK (used_days <= allocated_days + carried_over_days)
);

-- Leave requests. status reflects only the current state; leave_request_decisions (below) is
-- the full history of who acted on it and when (CLAUDE.md rule #9).
CREATE TABLE leave_requests (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  leave_type_id INT NOT NULL REFERENCES leave_types(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_half_day BOOLEAN NOT NULL DEFAULT FALSE,
  days_requested NUMERIC(5, 1) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  -- pending, approved, rejected, cancelled
  reason TEXT,
  -- Approved requests are locked (CLAUDE.md rule #6): editing dates goes through
  -- cancel-and-resubmit, and this links the new request back to the one it replaces.
  amends_request_id INT REFERENCES leave_requests(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CHECK (end_date >= start_date)
);

-- Audit trail: one row per action taken on a leave request (CLAUDE.md rule #9). Rejections
-- require a reason at the application layer.
CREATE TABLE leave_request_decisions (
  id SERIAL PRIMARY KEY,
  leave_request_id INT NOT NULL REFERENCES leave_requests(id) ON DELETE CASCADE,
  actor_id INT NOT NULL REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  -- submitted, approved, rejected, cancelled
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_manager_id ON users(manager_id);

CREATE INDEX idx_balances_user_year ON balances(user_id, year);

CREATE INDEX idx_leave_requests_user_id ON leave_requests(user_id);

CREATE INDEX idx_leave_requests_status ON leave_requests(status);

-- Overlap detection and the team calendar (CLAUDE.md rules #7-#8) both query active requests by
-- date range; this partial index keeps that query cheap as the company grows instead of loading
-- everything and filtering in application code.
CREATE INDEX idx_leave_requests_daterange ON leave_requests(start_date, end_date)
WHERE
  status IN ('pending', 'approved');

CREATE INDEX idx_leave_request_decisions_request_id ON leave_request_decisions(leave_request_id);