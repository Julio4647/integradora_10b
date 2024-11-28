<template>
  <div
    v-if="isModalOpen"
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg">
      <div class="flex justify-between items-center border-b pb-3">
        <h2 class="text-xl font-bold">Registrar Administrador</h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          ✕
        </button>
      </div>
      <!-- Form with VeeValidate -->
      <Form @submit="submitForm" v-slot="{ errors }">
        <!-- Form Fields -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label
              for="firstName"
              class="block text-md font-medium text-gray-700"
              >Nombre</label
            >
            <Field
              name="firstName"
              as="input"
              type="text"
              id="firstName"
              class="w-full px-3 py-2 border rounded"
              :class="{ 'border-red-500': errors.firstName }"
              placeholder="Ingresar nombre"
              rules="required"
              v-model="firstName"
            />
            <ErrorMessage name="firstName" class="text-red-500 text-sm" />
          </div>
          <div>
            <label
              for="lastName"
              class="block text-md font-medium text-gray-700"
              >Apellidos</label
            >
            <Field
              name="lastName"
              as="input"
              type="text"
              id="lastName"
              class="w-full px-3 py-2 border rounded"
              :class="{ 'border-red-500': errors.lastName }"
              placeholder="Ingresar Apellidos"
              rules="required"
              v-model="lastName"
            />
            <ErrorMessage name="lastName" class="text-red-500 text-sm" />
          </div>
          <div>
            <label for="email" class="block text-md font-medium text-gray-700"
              >Correo Electronico</label
            >
            <Field
              name="email"
              as="input"
              type="email"
              id="email"
              class="w-full px-3 py-2 border rounded"
              :class="{ 'border-red-500': errors.email }"
              placeholder="Ingresar Correo electronico"
              rules="required|email"
              v-model="email"
            />
            <ErrorMessage name="email" class="text-red-500 text-sm" />
          </div>
          <div>
            <label for="phone" class="block text-md font-medium text-gray-700"
              >Telefono</label
            >
            <Field
              name="phone"
              as="input"
              type="tel"
              id="phone"
              class="w-full px-3 py-2 border rounded"
              :class="{ 'border-red-500': errors.phone }"
              placeholder="Ingresar Telefono"
              rules="required"
              v-model="phone"
            />
            <ErrorMessage name="phone" class="text-red-500 text-sm" />
          </div>
          <div>
            <label
              for="password"
              class="block text-md font-medium text-gray-700"
              >Contraseña</label
            >
            <Field
              name="password"
              as="input"
              type="password"
              id="password"
              class="w-full px-3 py-2 border rounded"
              :class="{ 'border-red-500': errors.password }"
              placeholder="Ingresar Contraseña"
              rules="required|min:6"
              v-model="password"
            />
            <ErrorMessage name="password" class="text-red-500 text-sm" />
          </div>
        </div>

        <div class="flex justify-end gap-4 mt-6">
          <button
            type="submit"
            class="bg-blue-900 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Registrar
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Form, Field, ErrorMessage, defineRule } from "vee-validate";
import { useRouter } from "vue-router"; // Importa useRouter
import Swal from "sweetalert2";

// Validation rules
defineRule("required", (value: string) => {
  return value ? true : "Este campo es obligatorio";
});
defineRule("email", (value: string) => {
  return /.+@.+\..+/.test(value)
    ? true
    : "Ingresa una direccion de correo electronico valida";
});
defineRule("min", (value: string, [length]: [number]) => {
  return value.length >= length
    ? true
    : `Debe tener almenos ${length} caracteres`;
});

export default defineComponent({
  props: {
    isModalOpen: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup(_, { emit }) {
    const firstName = ref("");
    const lastName = ref("");
    const email = ref("");
    const phone = ref("");
    const password = ref("");
    const config = useRuntimeConfig();
    const ApiUrl = config.public.apiUrl;

    const submitForm = async () => {
      try {
        const payload = {
          name: firstName.value,
          lastname: lastName.value,
          email: email.value,
          phone: phone.value,
          password: password.value,
        };

        const response = await fetch(`${ApiUrl}/auth/signup/admin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (result) {
          await Swal.fire({
            icon: "success",
            title: "Administrador Registrado!",
            text: "El administrador se ha registrado exitosamente",
          });
          emit("close");
          emit("refresh"); // Emitimos el evento para actualizar la lista
        } else {
          await Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al registrar el administrador",
          });
        }
      } catch (error) {
        console.error("Error al registrar al administrador:", error);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Se produjo un error inesperado.",
        });
      }
    };

    return { firstName, lastName, email, phone, password, submitForm };
  },
});
</script>
