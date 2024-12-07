<template>
  <div
    v-if="isModalOpen"
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg">
      <div class="flex justify-between items-center border-b pb-3">
        <h2 class="text-xl font-bold">Registrar Cliente</h2>
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
              >Correo Electrónico</label
            >
            <Field
              name="email"
              as="input"
              type="email"
              id="email"
              class="w-full px-3 py-2 border rounded"
              :class="{ 'border-red-500': errors.email }"
              placeholder="Ingresar Correo Electrónico"
              rules="required|email"
              v-model="email"
            />
            <ErrorMessage name="email" class="text-red-500 text-sm" />
          </div>
          <div>
            <label for="phone" class="block text-md font-medium text-gray-700"
              >Teléfono</label
            >
            <Field
              name="phone"
              as="input"
              type="tel"
              id="phone"
              class="w-full px-3 py-2 border rounded"
              :class="{ 'border-red-500': errors.phone }"
              placeholder="Ingresar Teléfono"
              rules="required|phone"
              v-model="phone"
            />
            <ErrorMessage name="phone" class="text-red-500 text-sm" />
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
import Swal from "sweetalert2";
import axios from "axios";

// Validation rules
defineRule("required", (value: string) => {
  return value ? true : "Este campo es obligatorio";
});
defineRule("email", (value: string) => {
  return /.+@.+\..+/.test(value)
    ? true
    : "Ingresa una dirección de correo electrónico válida";
});
defineRule("min", (value: string, [length]: [number]) => {
  return value.length >= length
    ? true
    : `Debe tener al menos ${length} caracteres`;
});
defineRule("phone", (value: string) => {
  if (!/^\d+$/.test(value)) {
    return "El teléfono solo debe contener números";
  }
  return value.length === 10
    ? true
    : "El teléfono debe tener exactamente 10 dígitos";
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
    const ApiUrl = useRuntimeConfig().public.apiUrl;
    const firstName = ref("");
    const lastName = ref("");
    const email = ref("");
    const phone = ref("");
    const token = localStorage.getItem("token");

    const submitForm = async () => {
      try {
        const payload = {
          name: firstName.value,
          lastname: lastName.value,
          email: email.value,
          phone: phone.value,
        };

        const response = await axios.post(
          `${ApiUrl}/auth/signup/client`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
            },
          }
        );

        if (response.status === 201) {
          await Swal.fire({
            icon: "success",
            title: "Cliente Registrado!",
            text: "El cliente se ha registrado exitosamente",
          });
          emit("close");
          emit("refresh"); // Para actualizar la lista en el componente padre
        } else {
          throw new Error("Error al registrar cliente");
        }
      } catch (error) {
        console.error("Error al registrar al cliente:", error);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Se produjo un error al registrar el cliente.",
        });
      }
    };

    return {
      firstName,
      lastName,
      email,
      phone,
      submitForm,
    };
  },
});
</script>

<style scoped></style>
