<template>
  <div class="flex flex-col min-h-screen">
    <NavHeader />
    <div
      class="flex flex-col sm:flex-row justify-between items-center my-4 px-4"
    >
      <button
        @click="goBack"
        class="focus:outline-none font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary mt-2 sm:mt-0 bg-blue-900 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
      >
        <Icon
          icon="material-symbols:arrow-circle-left-outline"
          width="24"
          height="24"
        />
      </button>
    </div>
    <div
      class="flex flex-col sm:flex-row justify-between items-center text-center my-4 px-4"
    >
      <h1 class="text-2xl sm:text-3xl font-bold">Registrar Nuevo Técnico</h1>
    </div>
    <div class="w-full h-full max-w-full flex flex-col p-3">
      <Form
        @submit="submitForm"
        v-slot="{ errors }"
        class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow mt-8"
      >
        <div>
          <label for="nombre" class="block text-md font-medium text-gray-700"
            >Nombre</label
          >
          <Field
            name="nombre"
            as="input"
            type="text"
            id="nombre"
            class="w-full px-10 py-2 border rounded pl-10"
            :class="{ 'border-red-500': errors.nombre }"
            placeholder="Ingrese el nombre"
            rules="required"
          />
          <ErrorMessage name="nombre" class="text-red-500 text-sm" />
        </div>

        <div>
          <label for="apellido" class="block text-md font-medium text-gray-700"
            >Apellido</label
          >
          <Field
            name="apellido"
            as="input"
            type="text"
            id="apellido"
            class="w-full px-10 py-2 border rounded pl-10"
            :class="{ 'border-red-500': errors.apellido }"
            placeholder="Ingrese el apellido"
            rules="required"
          />
          <ErrorMessage name="apellido" class="text-red-500 text-sm" />
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
            class="w-full px-10 py-2 border rounded pl-10"
            :class="{ 'border-red-500': errors.email }"
            placeholder="Ingrese el correo electrónico"
            rules="required|email"
          />
          <ErrorMessage name="email" class="text-red-500 text-sm" />
        </div>

        <div>
          <label for="telefono" class="block text-md font-medium text-gray-700"
            >Teléfono</label
          >
          <Field
            name="telefono"
            as="input"
            type="tel"
            id="telefono"
            class="w-full px-10 py-2 border rounded pl-10"
            :class="{ 'border-red-500': errors.telefono }"
            placeholder="Ingrese el número de teléfono"
            rules="required"
          />
          <ErrorMessage name="telefono" class="text-red-500 text-sm" />
        </div>

        <div class="md:col-span-2">
          <label for="direccion" class="block text-md font-medium text-gray-700"
            >Dirección</label
          >
          <Field
            name="direccion"
            as="input"
            type="text"
            id="direccion"
            class="w-full px-10 py-2 border rounded pl-10"
            :class="{ 'border-red-500': errors.direccion }"
            placeholder="Ingrese la dirección"
            rules="required"
          />
          <ErrorMessage name="direccion" class="text-red-500 text-sm" />
        </div>

        <div class="md:col-span-2 flex justify-end gap-4 mt-8">
          <button
            type="submit"
            class="focus:outline-none hover:scale-105 transition-all cursor-pointer hover:text-primary bg-blue-900 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Registrar
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import NavHeader from "~/components/navigation/NavHeader.vue";
import { Form, Field, ErrorMessage, defineRule } from "vee-validate";
import Swal from "sweetalert2";

defineRule("required", (value: string) => {
  return value ? true : "Este campo es obligatorio";
});
defineRule("email", (value: string) => {
  return /.+@.+\..+/.test(value)
    ? true
    : "Ingrese un correo electrónico válido";
});

export default defineComponent({
  name: "RegisterUserForm",
  components: {
    NavHeader,
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const router = useRouter();

    const submitForm = async (values: any) => {
      try {
        const response = true;

        if (response) {
          await Swal.fire({
            icon: "success",
            title: "¡Tecnico registrado!",
            text: "El Tecnico se ha registrado con éxito.",
          });

          router.push("/dashboard/technicians");
        } else {
          await Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al registrar el tecnico.",
          });
        }
      } catch (error) {
        console.error("Error al registrar el tecnico:", error);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error inesperado.",
        });
      }
    };

    const goBack = () => {
      router.push("/dashboard/technicians");
    };

    return {
      submitForm,
      goBack,
    };
  },
});
</script>

<style scoped>
/* Puedes agregar estilos adicionales si es necesario */
</style>
