<template>
  <div
    class="relative w-full min-h-screen flex items-center justify-center bg-white overflow-hidden"
  >
    <div class="max-w-md w-full text-center">
      <h1 class="text-6xl font-bold text-red-500">401</h1>
      <p class="mt-4 text-lg text-gray-700">
        No autorizado. Parece que no tienes acceso a esta página.
      </p>
      <div class="mt-6">
        <button
          @click="login"
          class="focus:outline-none hover:scale-105 transition-all cursor-pointer hover:text-primary bg-blue-900 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Iniciar sesión
        </button>
      </div>
    </div>
    <div
      class="absolute top-0 right-0 w-[30vw] aspect-square bg-gray-900 rounded-bl-full animate-wave-1"
    >
      <div
        class="absolute top-0 right-0 w-[25vw] aspect-square bg-blue-950 rounded-bl-full"
      >
        <div
          class="absolute top-0 right-0 w-[20vw] aspect-square bg-blue-800 rounded-bl-full"
        ></div>
      </div>
    </div>
    <div
      class="absolute bottom-0 left-0 w-[30vw] aspect-square bg-gray-900 rounded-tr-full animate-wave-2"
    >
      <div
        class="absolute bottom-0 left-0 w-[25vw] aspect-square bg-blue-950 rounded-tr-full"
      >
        <div
          class="absolute bottom-0 left-0 w-[20vw] aspect-square bg-blue-800 rounded-tr-full"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
definePageMeta({
  layout: "error",
});
export default {
  name: "Error401",
  methods: {
    goHome() {
      // Redirige a la página de inicio
      this.$router.push("/");
    },
    login() {
      // Redirige a la página de inicio de sesión
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
body {
  font-family: "Poppins", sans-serif;
}

@keyframes wave {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.animate-wave-1 {
  animation: wave 6s ease-in-out infinite;
}

.animate-wave-2 {
  animation: wave 6s ease-in-out infinite;
}
</style>
