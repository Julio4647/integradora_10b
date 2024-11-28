import { useAuthStore } from "~/stores/user";

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();

  if (process.client) {
    if (!authStore.role || (authStore.role !== 'SUPERADMIN' && authStore.role !== 'ADMIN')) {
      return navigateTo('/login');
    }
  } else {
    return navigateTo('/login');
  }
});
