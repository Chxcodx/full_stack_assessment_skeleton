import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserType } from "../types";

// Async thunk for fetching all users
export const fetchAllUsers = createAsyncThunk<UserType[]>(
  "api/fetchAllUsers",
  async () => {
    const response = await fetch("http://localhost:3000/user/find-all");
    const data = await response.json();
    return data;
  }
);

// Async thunk for fetching users by home
export const fetchUserByHome = createAsyncThunk<UserType[], string>(
  "api/fetchUserByHome",
  async (homeId: string) => {
    const response = await fetch(
      `http://localhost:3000/user/find-by-home/${homeId}`
    );
    const data = await response.json();
    return data;
  }
);

// Define the initial state
type InitialState = {
  users: UserType[];
  usersByHome: UserType[];
  selectedUser: UserType | null; // Add selectedUser state
  error?: null | string;
  status: "idle" | "loading" | "succeeded" | "failed";
};

const initialState: InitialState = {
  users: [],
  status: "idle",
  error: null,
  usersByHome: [],
  selectedUser: null, // Initialize selectedUser as null
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    // Reducer for setting the selectedUser
    setSelectedUser: (state, action: PayloadAction<UserType | null>) => {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });

    builder
      .addCase(fetchUserByHome.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserByHome.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.usersByHome = action.payload;
      })
      .addCase(fetchUserByHome.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the setSelectedUser action
export const { setSelectedUser } = userSlice.actions;

export default userSlice.reducer;
