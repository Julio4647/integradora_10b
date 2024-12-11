<template>
  <div
    class="relative w-full min-h-screen flex items-center justify-center bg-white overflow-hidden"
  >
    <!-- Card de login -->
    <div class="relative p-10 rounded-lg w-full max-w-md z-10">
      <div class="flex justify-center mb-6">
        <img src="../assets/logo (3).png" alt="Logo" class="w-48 h-48" />
      </div>

      <!-- Formulario de login -->
      <Form
        :initialValues="{ email: '', password: '' }"
        @submit="loginSystem"
        v-slot="{ errors }"
      >
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
            Iniciar sesión
          </button>
        </div>
        <div class="flex justify-end mt-4">
          <div class="text-sm">
            <a
              href="#"
              @click.prevent="goToForgotPassword"
              class="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Forgot password?
            </a>
          </div>
        </div>
      </Form>
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
import { defineComponent, ref } from "vue";
import { Form, Field, ErrorMessage, defineRule } from "vee-validate";
import { useRouter } from "vue-router";
import { useRuntimeConfig } from "#app";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuthStore } from "~/stores/user";

// Define los valores esperados en el formulario
interface LoginFormValues {
  email: string;
  password: string;
}

// Define reglas de validación
defineRule(
  "required",
  (value: string) => !!value || "Este campo es obligatorio"
);
defineRule(
  "email",
  (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "El correo debe ser válido"
);
defineRule(
  "min",
  (value: string, [length]: [number]) =>
    value.length >= length ||
    `Este campo debe tener al menos ${length} caracteres`
);

export default defineComponent({
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const showPassword = ref(false);
    const router = useRouter();
    const config = useRuntimeConfig();
    const ApiUrl = config.public.apiUrl;
    const authStore = useAuthStore();

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const loginSystem = async (values: Record<string, any>) => {
      try {
        // Realiza la petición al backend
        const response = await axios.post(`${ApiUrl}/auth/login`, values, {
          headers: { "Content-Type": "application/json" },
        });


        // Extrae los datos desde la respuesta
        const userInfo = response.data.data?.userInfo;
        const loginInfo = response.data.data?.loginInfo;
        const error = response.data.error;

        if (error || !userInfo || !loginInfo) {
          throw new Error("Respuesta inválida del servidor");
        }

        const { id, name, lastname, email, authorities } = userInfo;
        const token = loginInfo.token;
        const role = authorities[0]?.authority;

        // Verifica si el usuario tiene permisos
        if (!["SUPERADMIN", "ADMIN"].includes(role)) {
          Swal.fire({
            icon: "error",
            title: "Acceso denegado",
            text: "No tienes permiso para acceder al sistema.",
          });
          return;
        }

        // Guarda el usuario en el store
        authStore.setUser({
          user: { id, name, lastname, email },
          role,
          token,
        });

        // Guarda la información en localStorage (solo en cliente)
        if (process.client) {
          localStorage.setItem("user", JSON.stringify(userInfo));
          localStorage.setItem("role", role);
          localStorage.setItem("token", token);
        }

        // Muestra un mensaje de éxito y redirige al dashboard
        Swal.fire({
          icon: "success",
          title: "Inicio de sesión exitoso",
          text: `Bienvenido, ${name} ${lastname}!`,
        });

        router.push("/dashboard");
      } catch (error: any) {
        console.error("Error en inicio de sesión:", error);

        if (error.response && error.response.status === 403) {
          Swal.fire({
            icon: "warning",
            title: "Cambio de contraseña requerido",
            text: "Debe cambiar su contraseña antes de continuar.",
            confirmButtonText: "Actualizar contraseña",
          }).then((result) => {
            if (result.isConfirmed) {
              // Redirige al usuario a la página de actualización de contraseña
              router.push(
                `/change-password?email=${encodeURIComponent(values.email)}`
              );
            }
          });
        } else if (error.response && error.response.status === 401) {
          Swal.fire({
            icon: "error",
            title: "Credenciales incorrectas",
            text: "El email o la contraseña son incorrectos. Intenta de nuevo.",
          });
        } else {
          // Manejo genérico para otros errores
          Swal.fire({
            icon: "error",
            title: "Error de inicio de sesión",
            text:
              error.response?.data?.message ||
              "Revisa tus credenciales e intenta nuevamente.",
          });
        }
      }
    };

    const goToForgotPassword = () => {
      router.push("/forgotPassword");
    };

    return {
      loginSystem,
      goToForgotPassword,
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
