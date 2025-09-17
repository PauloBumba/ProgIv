// src/Reducers/UserReducer.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id?: string;
  email?: string;
  fullName?: string;
  roles?: string[];
  isAuthenticated: boolean;
}

const initialState: UserState = {
  id: undefined,
  email: undefined,
  fullName: undefined,
  roles: [],
  isAuthenticated: false,
};

export const ExtraloginReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Omit<UserState, "isAuthenticated">>) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.fullName = action.payload.fullName;
      state.roles = action.payload.roles;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.id = undefined;
      state.email = undefined;
      state.fullName = undefined;
      state.roles = [];
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = ExtraloginReducer.actions;
export default ExtraloginReducer.reducer;
