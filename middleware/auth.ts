import { useAuthStore } from "~/stores/user";

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // Prevenir la ejecución en el servidor
  if (!process.client) {
    return;
  }

  // Cargar los datos desde localStorage si no están cargados
  if (!authStore.user || !authStore.role || !authStore.token) {
    authStore.loadUserFromStorage();
  }

  // Logs para depuración

  const allowedRoles = ["SUPERADMIN", "ADMIN"];
  const isAuthenticated = authStore.user && allowedRoles.includes(authStore.role || "");

  if (!isAuthenticated) {
    return window.location.replace("/errors/401");
  }

});
