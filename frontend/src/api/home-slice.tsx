import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { HomeType } from "../types";

type FetchHomesPayload = {
  userId: string;
  page: number;
  limit: number;
};

export const fetchHomesByUser = createAsyncThunk<
  {
    homes: { home: HomeType; user_id: number; home_id: number }[];
    totalPages: number;
  },
  FetchHomesPayload
>("api/fetchHomesByUser", async ({ userId, page, limit }) => {
  const response = await fetch(
    `http://localhost:3000/home/find-by-user/${userId}?page=${page}&limit=${limit}`
  );
  const data = await response.json();
  return data;
});

type UpdateUserForHomePayload = {
  homeId: number;
  userIds: number[];
};

// Post data to an API (POST request)
export const updateUsersForHome = createAsyncThunk<
  any,
  UpdateUserForHomePayload
>("api/updateUser", async ({ homeId, userIds }) => {
  const response = await fetch(
    `http://localhost:3000/home/update-users/${homeId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userIds }),
    }
  );
  const data = await response.json();
  return data;
});

type InitialState = {
  homes: { home: HomeType; user_id: number; home_id: number }[];
  totalPages: number;
  error?: null | string;
  status: "idle" | "loading" | "succeeded" | "failed";
};

const initialState: InitialState = {
  homes: [],
  totalPages: 0,
  status: "idle",
  error: null,
};

export const homeSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomesByUser.pending, (state) => {
        state.homes = [];
        state.status = "loading";
      })
      .addCase(fetchHomesByUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.homes = action.payload.homes;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchHomesByUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default homeSlice.reducer;
