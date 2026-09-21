import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '../../api/apiClient';

const initialState = {
  list: [],
  status: 'idle', // 'idle' | 'loading' | 'failed'
  addStatus: 'idle', // 'idle' | 'loading' | 'failed'
  error: null,
};

export const fetchLeaveTypes = createAsyncThunk(
  'leaveTypes/fetchLeaveTypes',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/leave-type/list');
      return data.data;
    } catch (err) {
      const message =
        err.response?.data?.error ||
        'Unable to load leave types. Please try again.';
      return rejectWithValue(message);
    }
  },
);

export const addLeaveType = createAsyncThunk(
  'leaveTypes/addLeaveType',
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/leave-type/add', values);
      return data.data;
    } catch (err) {
      const message =
        err.response?.data?.error ||
        'Unable to add leave type. Please try again.';
      return rejectWithValue(message);
    }
  },
);

const leaveTypesSlice = createSlice({
  name: 'leaveTypes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveTypes.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchLeaveTypes.fulfilled, (state, action) => {
        state.status = 'idle';
        state.list = action.payload;
      })
      .addCase(fetchLeaveTypes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(addLeaveType.pending, (state) => {
        state.addStatus = 'loading';
        state.error = null;
      })
      .addCase(addLeaveType.fulfilled, (state, action) => {
        state.addStatus = 'idle';
        state.list.push(action.payload);
      })
      .addCase(addLeaveType.rejected, (state, action) => {
        state.addStatus = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export default leaveTypesSlice.reducer;

export const selectLeaveTypesList = (state) => state.leaveTypes.list;
export const selectLeaveTypesStatus = (state) => state.leaveTypes.status;
export const selectLeaveTypesAddStatus = (state) => state.leaveTypes.addStatus;
export const selectLeaveTypesError = (state) => state.leaveTypes.error;
