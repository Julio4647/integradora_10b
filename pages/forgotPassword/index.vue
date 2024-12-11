<template>
  <div
    class="relative w-full min-h-screen flex items-center justify-center bg-white overflow-hidden"
  >
    <!-- Card de recuperación de contraseña -->
    <div
      class="relative p-10 border border-gray-600 rounded-lg w-full max-w-md z-10"
    >
      <div class="flex justify-center mb-6">
        <img src="../../assets/logo (3).png" alt="" srcset="" class="w-48 h-48">
      </div>

      <!-- Formulario -->
      <Form v-slot="{ errors }" @submit="(values) => recoverPassword(values)">
        <div class="relative mb-4">
          <Field
            name="email"
            as="input"
            type="email"
            id="email"
            class="w-full px-10 py-2 border rounded"
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

    <!-- Círculos responsivos -->
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
import { defineComponent } from "vue";
import { Form, Field, ErrorMessage, defineRule } from "vee-validate";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { useRuntimeConfig } from "#app";


// Reglas de validación
defineRule("required", (value: string) => {
  return value ? true : "Este campo es obligatorio";
});

defineRule("email", (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value) || "El correo debe ser válido";
});

export default defineComponent({
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const router = useRouter();
    const config = useRuntimeConfig();
    const ApiUrl = config.public.apiUrl;

    const recoverPassword = async (values: Record<string, any>) => {
      try {
        const email = values.email; // Extrae el email desde los valores
        if (!email) throw new Error("El correo electrónico es obligatorio.");

        const apiUrl =
          `${ApiUrl}/auth/forgot-password/token`;

        // Realizar la petición POST
        await axios.post(apiUrl, { email });

        localStorage.setItem("userEmail", email);

        // Mostrar alerta de éxito
        await Swal.fire({
          title: "¡Correo enviado!",
          text: "Revisa tu bandeja de entrada para continuar con la recuperación.",
          icon: "success",
          confirmButtonText: "Aceptar",
        });

        // Redirigir al formulario de cambio de contraseña
        router.push("/forgotPassword/update-password");
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

    return {
      recoverPassword,
    };
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
