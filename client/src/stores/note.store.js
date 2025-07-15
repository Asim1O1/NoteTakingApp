import { create } from "zustand";
import API from "../config/apiClient";

const useNoteStore = create((set, get) => ({
  // State
  notes: [],
  currentNote: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
  filters: {
    search: "",
    category: "",
    orderBy: "createdAt",
    order: "desc",
  },

  // Actions
  createNote: async (noteData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await API.post("/api/notes/", noteData);
      set((state) => ({
        notes: [response.data.data, ...state.notes],
        isLoading: false,
      }));
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create note";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  getNote: async (noteId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await API.get(`/api/notes/${noteId}`);
      set({
        currentNote: response.data.data,
        isLoading: false,
      });
      console.log("The note is ", response);
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch note";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  getNotes: async (filters = {}, pagination = {}) => {
    set({ isLoading: true, error: null });
    try {
      console.log("Current state:", get());
      const currentState = get();
      const params = {
        ...currentState.filters,
        ...filters,
        page: pagination.page || currentState.pagination.page,
        limit: pagination.limit || currentState.pagination.limit,
        orderBy: pagination.orderBy || currentState.filters.orderBy,
        order: pagination.order || currentState.filters.order,
      };

      const response = await API.get("/api/notes/", { params });

      set({
        notes: response.data.data.notes,
        pagination: response.data.data.pagination,
        filters: {
          ...currentState.filters,
          ...filters,
        },
        isLoading: false,
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching notes:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to fetch notes";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  updateNote: async (noteId, updateData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await API.put(`/api/notes/${noteId}`, updateData);
      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === noteId ? response.data.data : note
        ),
        currentNote: response.data.data,
        isLoading: false,
      }));
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update note";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  deleteNote: async (noteId) => {
    set({ isLoading: true, error: null });
    try {
      await API.delete(`/api/notes/${noteId}`);
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== noteId),
        currentNote:
          state.currentNote?.id === noteId ? null : state.currentNote,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete note";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  resetCurrentNote: () => set({ currentNote: null }),
  clearError: () => set({ error: null }),
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, page: 1 }, // Reset to first page when filters change
    }));
    // Optionally: automatically refresh notes when filters change
    // get().getNotes(filters);
  },
}));

export default useNoteStore;
