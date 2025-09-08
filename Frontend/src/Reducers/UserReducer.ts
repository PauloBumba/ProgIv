import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { jwtDecode } from "jwt-decode";
import { api } from "../Api/api";


// Tipagem do usuário
interface User {
  id: string;
  nome: string;
  email: string;
  role: string;
  IsAuthetications: boolean;
}

// Estado da autenticação
interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Thunk para login
export const loginUser = createAsyncThunk(
  "/loginUser",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("authentication/login", { email, password } ,  { withCredentials: true });
      const result = response.data;

      if (!result.isSuccess) {
        return rejectWithValue({ message: result.message });
      }

      return result;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || "Erro ao fazer login",
      });
    }
  }
);


// Slice de autenticação
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
     localStorage.removeItem("token")
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
    .addCase(loginUser.fulfilled, (state, action) => {
  const { isSuccess, data, message } = action.payload;

  if (!isSuccess || !data) {
    state.user = null;
    state.token = null;
    state.error = message || "Falha no login";
    state.loading = false;
    return;
  }

  state.token = data;
  state.error = null;
  state.loading = false;
  localStorage.setItem("token", data);
  try {
    const decoded: any = jwtDecode(data);

    state.user = {
      id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
      nome: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
      role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
      IsAuthetications: true,
    };
  } catch (error) {
    state.user = null;
    state.token = null;
    state.error = "Token inválido";
  }
})

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        const errorPayload = action.payload as { message: string } | undefined;
        state.error = errorPayload?.message || "Erro ao fazer login.";
      });
  },
});

// Exporta a ação de logout
export const { logout } = authSlice.actions;

// Exporta o reducer
