import { useAuthStore } from "~/stores/user";

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();

  // Carga los datos desde localStorage solo en el cliente
  if (process.client) {
    authStore.loadUserFromStorage();

  }
});
