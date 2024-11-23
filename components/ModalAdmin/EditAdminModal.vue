<template>
  <div>
    <!-- Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg">
        <div class="flex justify-between items-center border-b pb-3">
          <h2 class="text-xl font-bold">Actualizar Administrador</h2>
          <button
            @click="closeModal"
            class="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ✕
          </button>
        </div>
        <div class="mt-4">
          <Form @submit="submitForm" v-slot="{ errors }">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="name" class="block text-md font-medium text-gray-700">Nombre</label>
                <Field
                  name="name"
                  as="input"
                  type="text"
                  id="name"
                  class="w-full px-3 py-2 border rounded"
                  :class="{ 'border-red-500': errors.name }"
                  placeholder="Ingresar nombre"
                  v-model="formData.name"
                  rules="required"
                />
                <ErrorMessage name="name" class="text-red-500 text-sm" />
              </div>
              <div>
                <label for="lastname" class="block text-md font-medium text-gray-700">Apellidos</label>
                <Field
                  name="lastname"
                  as="input"
                  type="text"
                  id="lastname"
                  class="w-full px-3 py-2 border rounded"
                  :class="{ 'border-red-500': errors.lastname }"
                  placeholder="Ingresar Apellidos"
                  v-model="formData.lastname"
                  rules="required"
                />
                <ErrorMessage name="lastname" class="text-red-500 text-sm" />
              </div>
              <div>
                <label for="email" class="block text-md font-medium text-gray-700">Correo Electronico</label>
                <Field
                  name="email"
                  as="input"
                  type="email"
                  id="email"
                  class="w-full px-3 py-2 border rounded"
                  :class="{ 'border-red-500': errors.email }"
                  placeholder="Ingresar Correo electronico"
                  v-model="formData.email"
                  rules="required|email"
                />
                <ErrorMessage name="email" class="text-red-500 text-sm" />
              </div>
              <div>
                <label for="phone" class="block text-md font-medium text-gray-700">Telefono</label>
                <Field
                  name="phone"
                  as="input"
                  type="tel"
                  id="phone"
                  class="w-full px-3 py-2 border rounded"
                  :class="{ 'border-red-500': errors.phone }"
                  placeholder="Ingresar Telefono"
                  v-model="formData.phone"
                  rules="required"
                />
                <ErrorMessage name="phone" class="text-red-500 text-sm" />
              </div>
              <div class="md:col-span-2">
                <label for="address" class="block text-md font-medium text-gray-700">Direccion</label>
                <Field
                  name="address"
                  as="input"
                  type="text"
                  id="address"
                  class="w-full px-3 py-2 border rounded"
                  :class="{ 'border-red-500': errors.address }"
                  placeholder="Ingresar Direccion"
                  v-model="formData.address"
                  rules="required"
                />
                <ErrorMessage name="address" class="text-red-500 text-sm" />
              </div>
            </div>
            <div class="flex justify-end gap-4 mt-4">
              <button
                type="button"
                @click="closeModal"
                class="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="bg-blue-900 hover:bg-blue-700 text-white py-2 px-4 rounded"
              >
                Actualizar
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { Form, Field, ErrorMessage, defineRule } from "vee-validate";
import Swal from "sweetalert2";

defineRule("required", (value: string) => {
  return value ? true : "Este campo es obligatorio";
});
defineRule("email", (value: string) => {
  return /.+@.+\..+/.test(value)
    ? true
    : "Ingresa una direccion de correo electronico valida";
});

export default defineComponent({
  name: "EditAdminModal",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  props: {
    isModalOpen: Boolean,
    adminId: Number,
  },
  emits: ["close"],
  setup(props, { emit }) {
    const formData = ref({
      name: "",
      lastname: "",
      email: "",
      phone: "",
      address: "",
    });

    const closeModal = () => {
      emit("close");
    };

    const submitForm = async () => {
      try {
        const response = true;

        if (response) {
          await Swal.fire({
            icon: "success",
            title: "Administrador Actualizado!",
            text: "El administrador a sido registrado exitosamente",
          });
          closeModal();
        } else {
          await Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al actualizar al administrador.",
          });
        }
      } catch (error) {
        console.error("Error al actualizar el administrador:", error);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Se produjo un error inesperado.",
        });
      }
    };

    onMounted(() => {
      formData.value = {
        name: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        phone: "123456789",
        address: "123 Fake Street",
      };
    });

    return {
      formData,
      closeModal,
      submitForm,
    };
  },
});
</script>

<style scoped>
</style>
