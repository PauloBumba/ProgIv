import { createSlice,type  PayloadAction } from '@reduxjs/toolkit';

interface User {
  email ?: string | null;
  
  token: string | null;
  IsSucces: boolean;
  code : string | null
}

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: {
    email: null,
    token: null,
    IsSucces: false,
    code : null
  },
};

export const ResetCrential = createSlice({
  name: 'Reset',
  initialState,
  reducers: {
    setByEmail: (state, action: PayloadAction<string | null>) => {
      if (state.user) {
        state.user.email = action.payload;
      }
    },
    setByValidate: (state, action: PayloadAction<User> ) => {
      if (state.user) {
        state.user.token = action.payload.token;
        state.user.code=action.payload.code;
        state.user.IsSucces = action.payload.IsSucces;
        
      }
    },
   
    Clean: (state) => {
      state.user = null;
    },
  },
});

export const { setByEmail, setByValidate, Clean } = ResetCrential.actions;

