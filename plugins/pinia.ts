import { createPinia } from "pinia";

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia();
  nuxtApp.vueApp.use(pinia); // Registra Pinia como plugin de Vue
});
