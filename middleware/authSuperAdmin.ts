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

  // Validación estricta para SUPERADMIN
  const isSuperAdmin = authStore.user && authStore.role === "SUPERADMIN";

  if (!isSuperAdmin) {
    return window.location.replace("/errors/401");
  }

});
