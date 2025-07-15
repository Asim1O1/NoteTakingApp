import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import API from "../config/apiClient.js";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // New action to initialize auth state
      initializeAuth: async () => {
        set({ isLoading: true });
        try {
          const response = await API.get("/api/auth/me");
          console.log("The response is", response);
          set({
            user: response.data.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      login: async (userCredentials) => {
        console.log("data", userCredentials);
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(
            "http://localhost:3301/api/auth/login",
            userCredentials,
            { withCredentials: true }
          );
          console.log("Login response:", response);
          set({
            user: response?.data?.data,
            isAuthenticated: true,
            isLoading: false,
          });
          return response.data.data;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(
            "http://localhost:3301/api/auth/register",
            userData,
            {
              withCredentials: true,
            }
          );
          set({
            user: response.data.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
          return response.data.data;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Registration failed",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await API.post("/api/auth/logout");
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error.response?.data?.message || "Logout failed",
            isLoading: false,
          });
          throw error;
        }
      },

      refreshToken: async () => {
        try {
          const response = await API.post("/api/auth/refresh");
          set({
            user: response.data.data.user,
            isAuthenticated: true,
          });
          return response.data.data.accessToken;
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      verifyEmail: async (token) => {
        set({ isLoading: true });
        try {
          const response = await API.get(
            `/api/auth/verify-email?token=${token}`
          );
          set({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error.response?.data?.message || "Email verification failed",
            isLoading: false,
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
