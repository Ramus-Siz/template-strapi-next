// lib/userStore.js
"use client";
import { create } from "zustand";

const useUserStore = create((set) => ({
  user: null, // État initial de l'utilisateur
  setUser: (userData) => set({ user: userData }),
  clearUser: () => set({ user: null }),
}));

export default useUserStore;
