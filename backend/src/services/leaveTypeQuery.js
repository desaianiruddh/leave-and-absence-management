const GET_LEAVE_TYPE = `select * from leave_types lt`;

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
('', '', 20, true, true, 0, true);`;

exports.GET_LEAVE_TYPE = GET_LEAVE_TYPE;
exports.ADD_LEAVE_TYPE = ADD_LEAVE_TYPE;
