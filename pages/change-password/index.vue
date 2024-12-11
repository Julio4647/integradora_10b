<template>
  <div
    class="relative w-full min-h-screen flex items-center justify-center bg-white overflow-hidden"
  >
    <!-- Card de recuperación de contraseña -->
    <div class="relative p-10 rounded-lg w-full max-w-md z-10">
      <div class="flex justify-center mb-6">
        <img
          src="../../assets/logo (3).png"
          alt=""
          srcset=""
          class="w-48 h-48"
        />
      </div>

      <Form @submit="updatePasswordWithToken" v-slot="{ errors }">
        <!-- Email -->
        <div class="relative mb-4">
          <Icon
            name="material-symbols:mail-outline"
            size="30"
            class="absolute left-2 top-1 text-gray-400"
          />
          <p
            id="email"
            class="w-full px-10 py-2 border rounded bg-gray-100 text-gray-700"
          >
            {{ email }}
          </p>
        </div>

        <!-- Old Password -->
        <div class="relative mb-4">
          <Icon
            name="material-symbols:lock-outline"
            size="30"
            class="absolute left-2 top-1 text-gray-400"
          />
          <Field
            name="oldPassword"
            as="input"
            :type="showOldPassword ? 'text' : 'password'"
            id="oldPassword"
            class="w-full px-10 py-2 border rounded"
            :class="{ 'border-red-500': errors.oldPassword }"
            placeholder="Contraseña antigua"
            rules="required|min:6"
          />
          <button
            type="button"
            @click="toggleOldPasswordVisibility"
            class="absolute right-2 top-3 text-blue-600 hover:text-gray-600"
          >
            <Icon
              :icon="
                showOldPassword
                  ? 'material-symbols:visibility-off'
                  : 'material-symbols:visibility'
              "
              size="24"
            />
          </button>
          <ErrorMessage name="oldPassword" class="text-red-500 text-sm" />
        </div>

        <!-- New Password -->
        <div class="relative mb-4">
          <Icon
            name="material-symbols:lock-outline"
            size="30"
            class="absolute left-2 top-1 text-gray-400"
          />
          <Field
            name="newPassword"
            as="input"
            :type="showNewPassword ? 'text' : 'password'"
            id="newPassword"
            class="w-full px-10 py-2 border rounded"
            :class="{ 'border-red-500': errors.newPassword }"
            placeholder="Nueva contraseña"
            rules="required|min:6|noJsonOrSql"
          />
          <button
            type="button"
            @click="toggleNewPasswordVisibility"
            class="absolute right-2 top-3 text-blue-600 hover:text-gray-600"
          >
            <Icon
              :icon="
                showNewPassword
                  ? 'material-symbols:visibility-off'
                  : 'material-symbols:visibility'
              "
              size="24"
            />
          </button>
          <ErrorMessage name="newPassword" class="text-red-500 text-sm" />
        </div>

        <!-- Submit Button -->
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
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2";
import axios from "axios";
import { min } from "@vee-validate/rules";

// Definir reglas
defineRule("required", (value: string) => {
  return value && value.trim() !== "" ? true : "Este campo es obligatorio";
});

defineRule("email", (value: string) => {
  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "El correo debe ser válido"
  );
});

defineRule("min", (value: string, [length]: [number]) => {
  return (
    (value && value.length >= length) ||
    `Debe tener al menos ${length} caracteres`
  );
});

defineRule("noJsonOrSql", (value: string) => {
  const jsonRegex = /{.*}|:|,/; 
  const sqlRegex =
    /(select|insert|delete|update|drop|union|create|alter|where|--|' or '|;|--)/i; // Mejora para inyecciones SQL

  if (jsonRegex.test(value)) {
    return "No se permiten estructuras JSON en este campo";
  }
  if (sqlRegex.test(value)) {
    return "No se permiten comandos SQL en este campo";
  }
  return true;
});

export default defineComponent({
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const showOldPassword = ref(false);
    const showNewPassword = ref(false);
    const config = useRuntimeConfig();
    const ApiUrl = config.public.apiUrl;
    const email = route.query.email || "";

    const toggleOldPasswordVisibility = () => {
      showOldPassword.value = !showOldPassword.value;
    };

    const toggleNewPasswordVisibility = () => {
      showNewPassword.value = !showNewPassword.value;
    };

    const updatePasswordWithToken = async (values: Record<string, any>) => {
      try {
        const payload = {
          email,
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        };

        const response = await axios.post(
          `${ApiUrl}/auth/signup/update-password`,
          payload
        );

        if (response.status === 200) {
          await Swal.fire({
            title: "¡Contraseña Actualizada!",
            text: "Contraseña actualizada con éxito. Inicia sesión nuevamente.",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
          router.push("/");
        }
      } catch (error) {
        console.error("Error al actualizar la contraseña:", error);

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
      toggleOldPasswordVisibility,
      toggleNewPasswordVisibility,
      showOldPassword,
      showNewPassword,
      email,
    };
  },
});
</script>
