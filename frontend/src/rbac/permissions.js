import { ROLES } from './roles';

// Permissions are data, not per-role `if` branches — mirrors how the backend treats leave-type
// rules (see backend/CLAUDE.md §5). Adding a capability means editing PERMISSIONS_BY_ROLE below,
// not touching every component that gates on it.
export const PERMISSIONS = {
  VIEW_OWN_REQUESTS: 'view_own_requests',
  SUBMIT_REQUEST: 'submit_request',
  VIEW_TEAM_CALENDAR: 'view_team_calendar',
  VIEW_APPROVAL_QUEUE: 'view_approval_queue',
  DECIDE_REQUEST: 'decide_request',
  MANAGE_LEAVE_TYPES: 'manage_leave_types',
  VIEW_ALL_TEAMS: 'view_all_teams',
};

const EMPLOYEE_PERMISSIONS = [
  PERMISSIONS.VIEW_OWN_REQUESTS,
  PERMISSIONS.SUBMIT_REQUEST,
  PERMISSIONS.VIEW_TEAM_CALENDAR,
];

const MANAGER_PERMISSIONS = [
  ...EMPLOYEE_PERMISSIONS,
  PERMISSIONS.VIEW_APPROVAL_QUEUE,
  PERMISSIONS.DECIDE_REQUEST,
];

const ADMIN_PERMISSIONS = [
  ...MANAGER_PERMISSIONS,
  PERMISSIONS.MANAGE_LEAVE_TYPES,
  PERMISSIONS.VIEW_ALL_TEAMS,
];

export const PERMISSIONS_BY_ROLE = {
  [ROLES.EMPLOYEE]: EMPLOYEE_PERMISSIONS,
  [ROLES.MANAGER]: MANAGER_PERMISSIONS,
  [ROLES.ADMIN]: ADMIN_PERMISSIONS,
};

export function hasPermission(role, permission) {
  return PERMISSIONS_BY_ROLE[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role, permissions) {
  return permissions.some((permission) => hasPermission(role, permission));
}
