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

  // Validación estricta para SUPERADMIN
  const isSuperAdmin = authStore.user && authStore.role === "SUPERADMIN";

  if (!isSuperAdmin) {
    console.warn("Acceso denegado: solo usuarios SUPERADMIN pueden acceder a esta vista. Redirigiendo...");
    return window.location.replace("/errors/401");
  }

  console.log("Usuario SUPERADMIN verificado. Permitiendo acceso.");
});
