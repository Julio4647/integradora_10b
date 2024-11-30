import { useAuthStore } from "~/stores/user";

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();

  // Carga los datos desde localStorage solo en el cliente
  if (process.client) {
    authStore.loadUserFromStorage();
    console.log("Estado inicial del store después de cargar:", authStore.$state);
    console.log("Middleware ejecutado en:", process.client ? "cliente" : "servidor");

  }
});
