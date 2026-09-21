import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import usersReducer from '../features/users/usersSlice';
import leaveTypesReducer from '../features/leaveTypes/leaveTypesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    leaveTypes: leaveTypesReducer,
  },
});
