// stores/auth.ts
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    role: localStorage.getItem('role') || null,  // Carga el rol desde localStorage al iniciar
  }),
  actions: {
    setRole(role: string) {
      this.role = role;
      localStorage.setItem('role', role);  // Guarda el rol en localStorage
    },
    clearRole() {
      this.role = null;
      localStorage.removeItem('role');  // Elimina el rol de localStorage
    }
  }
});
