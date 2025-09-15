import { createSlice,type  PayloadAction } from "@reduxjs/toolkit";

interface RouteState {  
  lastPath: string | null;
}

const initialState: RouteState = {
  lastPath: null,
};

export  const routeSlice = createSlice({
  name: "route",
  initialState,
  reducers: {
    setLastPath: (state, action: PayloadAction<string>) => {
      state.lastPath = action.payload;
    },
    clearPath: (state) => {
      state.lastPath = null;
    },
  },
});

export const { setLastPath, clearPath } = routeSlice.actions;
export default routeSlice.reducer;
