<template>
    <div
      class="relative w-full min-h-screen flex items-center justify-center bg-white overflow-hidden"
    >
      <!-- Card de recuperación de contraseña -->
      <div class="relative p-10 border border-gray-600 rounded-lg w-full max-w-md z-10">
        <div class="flex justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 3h18M3 7h18M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z"
            />
          </svg>
        </div>
  
        <Form @submit="recoverPassword" v-slot="{ errors }">
          <div class="relative mb-4">
            <Icon
              name="material-symbols:alternate-email"
              size="30"
              class="absolute left-2 top-1 text-gray-400"
            />
            <Field
              name="email"
              as="input"
              type="email"
              id="email"
              class="w-full px-10 py-2 border rounded pl-10"
              :class="{ 'border-red-500': errors.email }"
              placeholder="Correo electrónico"
              rules="required|email"
            />
            <ErrorMessage name="email" class="text-red-500 text-sm" />
          </div>
  
          <div class="text-center justify-center mt-4">
            <button
              type="submit"
              class="flex w-full justify-center rounded-md bg-gray-900 px-4 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Recuperar contraseña
            </button>
          </div>
        </Form>
      </div>
  
      <!-- Círculos responsivos parte superior derecha -->
      <div class="absolute top-0 right-0 w-[30vw] aspect-square bg-gray-900 rounded-bl-full animate-wave-1">
        <div class="absolute top-0 right-0 w-[25vw] aspect-square bg-blue-950 rounded-bl-full">
          <div class="absolute top-0 right-0 w-[20vw] aspect-square bg-blue-800 rounded-bl-full"></div>
        </div>
      </div>
  
      <!-- Círculos responsivos parte inferior izquierda -->
      <div class="absolute bottom-0 left-0 w-[30vw] aspect-square bg-gray-900 rounded-tr-full animate-wave-2">
        <div class="absolute bottom-0 left-0 w-[25vw] aspect-square bg-blue-950 rounded-tr-full">
          <div class="absolute bottom-0 left-0 w-[20vw] aspect-square bg-blue-800 rounded-tr-full"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  import { Form, Field, ErrorMessage, defineRule } from "vee-validate";
  import { useRouter } from "vue-router";
  import Swal from "sweetalert2";
  
  // Definir reglas
  defineRule("required", (value: string) => {
    return !!value || "Este campo es obligatorio";
  });
  defineRule("email", (value: string) => {
    return (
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "El correo debe ser válido"
    );
  });
  
  export default defineComponent({
    components: {
      Form,
      Field,
      ErrorMessage,
    },
    setup(props, { emit }) {
      const router = useRouter();
  
      const recoverPassword = async (values: Record<string, any>) => {
      // Simulación del envío del correo
      try {
        console.log("Correo de recuperación enviado a:", values.email);

        // Mostrar la alerta de éxito
        await Swal.fire({
          title: "¡Correo enviado!",
          text: "Revisa tu bandeja de entrada para continuar con la recuperación.",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        router.push("/");
      } catch (error) {
        console.error("Error al enviar el correo:", error);

        // Mostrar alerta de error
        await Swal.fire({
          title: "Error",
          text: "No se pudo enviar el correo. Inténtalo nuevamente.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    };
  
      return { recoverPassword };
    },
  });
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
  