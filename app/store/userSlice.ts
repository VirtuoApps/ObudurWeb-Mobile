import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../axios";

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
  updateError: string | null;
  updateSuccess: boolean;
}

interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UpdateUserPayload {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
  updateSuccess: false,
};

export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/mine");
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch user data");
    }
  }
);

export const updateUserData = createAsyncThunk(
  "user/updateUserData",
  async (userData: UpdateUserPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch("/auth/mine", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to update user data");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    resetUpdateStatus: (state) => {
      state.updateSuccess = false;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserData.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.user = action.payload;
        state.updateSuccess = true;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
        state.updateSuccess = false;
      });
  },
});

export const { setUser, clearUser, resetUpdateStatus } = userSlice.actions;
export default userSlice.reducer;
