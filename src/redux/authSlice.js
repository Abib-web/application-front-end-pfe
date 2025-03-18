// redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/login", { email, password });
      const data = response.data;
      if (!data.token || !data.user || !data.user.id || !data.user.name) {
        throw new Error("Réponse du serveur invalide");
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return { token: data.token, user: data.user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || "Une erreur inconnue s'est produite");
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return null;
});

// redux/authSlice.js
export const initializeAuth = () => (dispatch) => {
  dispatch(authSlice.actions.setLoading()); // Définir le statut sur "loading"
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (token && user && user !== "undefined" && user !== "null") {
    try {
      const parsedUser = JSON.parse(user);
      if (parsedUser && parsedUser.id && parsedUser.name) {
        dispatch(authSlice.actions.setUser({ user: parsedUser, token }));
      }
    } catch (error) {
      console.error("Erreur lors du parsing du localStorage user:", error);
      localStorage.removeItem("user");
    }
  } else {
    dispatch(authSlice.actions.setIdle()); // Définir le statut sur "idle" si aucune donnée n'est trouvée
  }
};
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    status: "idle", // idle, loading, succeeded, failed
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = "succeeded";
    },
    setLoading: (state) => {
      state.status = "loading";
    },
    setIdle: (state) => {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Une erreur inconnue s'est produite";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = "idle";
        state.error = null;
      });
  },
});

export default authSlice.reducer;