import { create } from "zustand";
import API from "../config/apiClient";

const useCategoryStore = create((set, get) => ({
  // State
  categories: [],
  userCategories: [],
  filteredNotes: [],
  isLoading: false,
  error: null,

  // Actions
  createCategory: async (name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await API.post("/api/categories/", { name });
      set((state) => ({
        categories: [...state.categories, response.data.data],
        isLoading: false,
      }));
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create category",
        isLoading: false,
      });
      throw error;
    }
  },

  getCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await API.get("/api/categories/");
      set({
        categories: response.data.data,
        isLoading: false,
      });
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch categories",
        isLoading: false,
      });
      throw error;
    }
  },

  addCategoriesToNote: async (noteId, userId, categoryNames) => {
    set({ isLoading: true, error: null });
    try {
      const response = await API.post(`/api/categories/${noteId}/categories`, {
        categoryNames,
        userId,
      });
      set({
        isLoading: false,
      });
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to add categories",
        isLoading: false,
      });
      throw error;
    }
  },

  filterNotesByCategory: async (userId, category) => {
    set({ isLoading: true, error: null });
    try {
      const response = await API.get(`/users/${userId}/notes`, {
        params: { category },
      });
      set({
        filteredNotes: response.data.data,
        isLoading: false,
      });
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to filter notes",
        isLoading: false,
      });
      throw error;
    }
  },

  getAllUserCategories: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await API.get(`/users/${userId}/categories`);
      set({
        userCategories: response.data.data,
        isLoading: false,
      });
      return response.data.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to fetch user categories",
        isLoading: false,
      });
      throw error;
    }
  },

  clearFilteredNotes: () => set({ filteredNotes: [] }),
  clearError: () => set({ error: null }),
}));

export default useCategoryStore;
