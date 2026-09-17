// Roles as returned by the backend `user.role` field (see backend/CLAUDE.md auth contract).
export const ROLES = {
  EMPLOYEE: 'employee',
  MANAGER: 'manager',
  ADMIN: 'admin',
};

export const ALL_ROLES = Object.values(ROLES);
