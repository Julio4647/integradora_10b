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
    "~/plugins/pinia",
    "~/plugins/auth.client",
  ],

  compatibilityDate: '2024-12-08',
});