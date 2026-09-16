import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import LoginPage from './pages/Login/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import CalendarPage from './pages/Calendar/CalendarPage';
import ApprovalsPage from './pages/Approvals/ApprovalsPage';
import AdminLeaveTypesPage from './pages/Admin/AdminLeaveTypesPage';
import UsersListPage from './pages/Admin/UsersListPage';
import UnauthorizedPage from './pages/Unauthorized/UnauthorizedPage';
import RequireAuth from './routes/RequireAuth';
import RequirePermission from './routes/RequirePermission';
import { PERMISSIONS } from './rbac/permissions';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route
            element={
              <RequirePermission permission={PERMISSIONS.VIEW_TEAM_CALENDAR} />
            }
          >
            <Route path="/calendar" element={<CalendarPage />} />
          </Route>

          <Route
            element={
              <RequirePermission permission={PERMISSIONS.VIEW_APPROVAL_QUEUE} />
            }
          >
            <Route path="/approvals" element={<ApprovalsPage />} />
          </Route>

          <Route
            element={
              <RequirePermission permission={PERMISSIONS.MANAGE_LEAVE_TYPES} />
            }
          >
            <Route
              path="/admin/leave-types"
              element={<AdminLeaveTypesPage />}
            />
          </Route>

          <Route
            element={
              <RequirePermission permission={PERMISSIONS.VIEW_USERS_LIST} />
            }
          >
            <Route path="/admin/users" element={<UsersListPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
