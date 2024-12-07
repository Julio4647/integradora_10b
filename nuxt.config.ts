export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@vee-validate/nuxt', '@nuxtjs/tailwindcss'],
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL,
    },
  },
  css: [
    'vue-multiselect/dist/vue-multiselect.min.css'
  ],
  plugins: [
    "~/plugins/pinia", // Pinia debe inicializarse antes de cualquier plugin que use el store
    "~/plugins/auth.client",
    '~/plugins/mqtt-subscriber.ts'
  ],
});
