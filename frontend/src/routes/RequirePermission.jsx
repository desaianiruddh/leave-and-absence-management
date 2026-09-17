import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectCurrentUser } from '../features/auth/authSlice';
import { hasPermission } from '../rbac/permissions';

// Gates a route (or subtree) by RBAC permission rather than by role name directly, so a role's
// capabilities can change in rbac/permissions.js without touching route definitions.
const RequirePermission = ({ permission }) => {
  const user = useSelector(selectCurrentUser);

  if (!user || !hasPermission(user.role, permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RequirePermission;
