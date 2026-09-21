const GET_LEAVE_TYPE = `SELECT
  id,
  "name",
  description,
  default_allocation_days AS "defaultAllocationDays",
  draws_from_balance AS "drawsFromBalance",
  requires_approval AS "requiresApproval",
  two_step_threshold_days AS "twoStepThresholdDays",
  is_active AS "isActive"
FROM leave_types
ORDER BY id`;

const ADD_LEAVE_TYPE = `INSERT INTO
  leave_types (
    "name",
    description,
    default_allocation_days,
    draws_from_balance,
    requires_approval,
    two_step_threshold_days,
    is_active
  )
VALUES
($1, $2, $3, $4, $5, $6, $7)
RETURNING
  id,
  "name",
  description,
  default_allocation_days AS "defaultAllocationDays",
  draws_from_balance AS "drawsFromBalance",
  requires_approval AS "requiresApproval",
  two_step_threshold_days AS "twoStepThresholdDays",
  is_active AS "isActive";`;

exports.GET_LEAVE_TYPE = GET_LEAVE_TYPE;
exports.ADD_LEAVE_TYPE = ADD_LEAVE_TYPE;
