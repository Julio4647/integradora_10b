<template>
  <div
    class="relative w-full min-h-screen flex items-center justify-center bg-white overflow-hidden"
  >
    <!-- Card de recuperación de contraseña -->
    <div
      class="relative p-10 border border-gray-600 rounded-lg w-full max-w-md z-10"
    >
      <div class="flex justify-center mb-6">
        <img src="../../../assets/logo (3).png" alt="" srcset="" class="w-48 h-48">
      </div>

      <Form @submit="updatePasswordWithToken" v-slot="{ errors }">
        <div class="relative mb-4">
          <Icon
            name="material-symbols:alternate-email"
            size="30"
            class="absolute left-2 top-1 text-gray-400"
          />
          <Field
            name="token"
            as="input"
            type="text"
            id="token"
            class="w-full px-10 py-2 border rounded pl-10"
            :class="{ 'border-red-500': errors.token }"
            placeholder="Ingresa el token"
            rules="required"
          />
          <ErrorMessage name="token" class="text-red-500 text-sm" />
        </div>
        <div class="relative mb-4">
          <Icon
            name="material-symbols:lock-outline"
            size="30"
            class="absolute left-2 top-1 text-gray-400"
          />
          <Field
            name="password"
            as="input"
            :type="showPassword ? 'text' : 'password'"
            id="password"
            class="w-full px-10 py-2 border rounded"
            :class="{ 'border-red-500': errors.password }"
            placeholder="Contraseña"
            rules="required|min:6"
          />
          <ErrorMessage name="password" class="text-red-500 text-sm" />
          <button
            type="button"
            @click="togglePasswordVisibility"
            class="absolute right-2 top-3 text-blue-600 hover:text-gray-600"
          >
            <Icon
              :icon="
                showPassword
                  ? 'material-symbols:visibility'
                  : 'material-symbols:visibility-off'
              "
              size="24"
            />
          </button>
        </div>

        <div class="text-center justify-center mt-4">
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-gray-900 px-4 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Actualizar contraseña
          </button>
        </div>
      </Form>
    </div>

    <!-- Círculos responsivos parte superior derecha -->
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

    <!-- Círculos responsivos parte inferior izquierda -->
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
import { defineComponent, ref } from "vue";
import { Form, Field, ErrorMessage, defineRule } from "vee-validate";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import axios from "axios";
import { useRuntimeConfig } from "#app";


// Definir reglas
defineRule("required", (value: string) => {
  return !!value || "Este campo es obligatorio";
});
defineRule("min", (value: string, [min]: string[]) => {
  return value.length >= Number(min) || `Debe tener al menos ${min} caracteres`;
});

export default defineComponent({
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const router = useRouter();
    const showPassword = ref(false);
    const config = useRuntimeConfig();
    const ApiUrl = config.public.apiUrl;

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const updatePasswordWithToken = async (values: Record<string, any>) => {
      try {
        const email = localStorage.getItem("userEmail"); // Recupera el email de localStorage
        if (!email) {
          throw new Error(
            "No se encontró el correo electrónico. Intenta nuevamente."
          );
        }

        // Construir el cuerpo de la solicitud
        const requestBody = {
          email: String(email),
          token: String(values.token),
          newPassword: String(values.password),
        };

        console.log(requestBody);

        const apiUrl =
          `${ApiUrl}/auth/forgot-password/update-password`;

        // Realizar la solicitud POST
        await axios.post(apiUrl, requestBody);

        // Mostrar alerta de éxito
        await Swal.fire({
          title: "¡Contraseña Actualizada!",
          text: "Contraseña actualizada con éxito. Inicia sesión nuevamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
        });

        // Redirigir al inicio de sesión
        router.push("/");
      } catch (error) {
        console.error("Error al actualizar la contraseña:", error);

        // Manejar errores
        await Swal.fire({
          title: "Error",
          text: "No se pudo actualizar la contraseña. Inténtalo nuevamente.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    };

    return {
      updatePasswordWithToken,
      togglePasswordVisibility,
      showPassword,
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
