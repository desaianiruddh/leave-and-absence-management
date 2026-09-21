const LOGIN_QUERY = `SELECT * FROM users WHERE email = $1`;

const GET_USERS_LIST = `
  select
    u1.id,
    u1.email,
    u1.first_name || ' ' || u1.last_name as name,
    u1.role,
    u1.department,
    u2.first_name || ' ' || u2.last_name as manager
  from
    users u1
    left join users u2 on u1.manager_id = u2.id
  order by
    u1.id`;

exports.LOGIN_QUERY = LOGIN_QUERY;
exports.GET_USERS_LIST = GET_USERS_LIST;
