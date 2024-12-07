import { useAuthStore } from "~/stores/user";

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // Prevenir la ejecución en el servidor
  if (!process.client) {
    console.log("Middleware ejecutado en el servidor. Saltando validación.");
    return;
  }

  // Cargar los datos desde localStorage si no están cargados
  if (!authStore.user || !authStore.role || !authStore.token) {
    authStore.loadUserFromStorage();
  }

  // Logs para depuración
  console.log("Estado del usuario en middleware:", authStore.$state);

  const allowedRoles = ["SUPERADMIN", "ADMIN"];
  const isAuthenticated = authStore.user && allowedRoles.includes(authStore.role || "");

  if (!isAuthenticated) {
    console.warn("Usuario no autenticado o sin permisos. Redirigiendo...");
    return window.location.replace("/errors/401");
  }

  console.log("El usuario tiene permisos. Permitiendo acceso.");
});
