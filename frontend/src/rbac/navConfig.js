import { PERMISSIONS } from './permissions';

// Central nav config so links appear/disappear by permission instead of scattered role checks
// in the layout. Add a route here and it is automatically RBAC-gated everywhere it's rendered.
export const NAV_ITEMS = [
  { label: 'My Requests', to: '/dashboard', permission: PERMISSIONS.VIEW_OWN_REQUESTS },
  { label: 'Team Calendar', to: '/calendar', permission: PERMISSIONS.VIEW_TEAM_CALENDAR },
  { label: 'Approvals', to: '/approvals', permission: PERMISSIONS.VIEW_APPROVAL_QUEUE },
  { label: 'Leave Types', to: '/admin/leave-types', permission: PERMISSIONS.MANAGE_LEAVE_TYPES },
];
