import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as Record<string, any> | null,
    role: null as string | null,
    token: null as string | null,
  }),
  actions: {
    setUser(data: { user: any; role: string; token: string }) {
      this.user = data.user;
      this.role = data.role;
      this.token = data.token;

      if (process.client) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", data.role);
        localStorage.setItem("token", data.token);
      }
    },
    loadUserFromStorage() {
      if (process.client) {
        const user = localStorage.getItem("user");
        const role = localStorage.getItem("role");
        const token = localStorage.getItem("token");
    
        this.user = user ? JSON.parse(user) : null;
        this.role = role || null;
        this.token = token || null;
    
        console.log("Datos cargados desde localStorage en cliente:", {
          user: this.user,
          role: this.role,
          token: this.token,
        });
      } else {
        console.log("Intento de acceso a localStorage en el servidor prevenido.");
      }
    },    
    clearUser() {
      this.user = null;
      this.role = null;
      this.token = null;

      if (process.client) {
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("token");
      }
    },
  },
});
