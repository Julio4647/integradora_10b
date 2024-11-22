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
      <h1 class="text-2xl sm:text-3xl font-bold">Editar Equipo</h1>
    </div>

    <div class="w-full h-full max-w-full flex flex-col p-3">
      <Form
        @submit="submitForm"
        v-slot="{ errors }"
        class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow"
      >
        <!-- Modelo -->
        <div>
          <label for="modelo" class="block text-md font-medium text-gray-700"
            >Modelo</label
          >
          <Field
              name="modelo"
              as="input"
              type="text"
              id="modelo"
              class="w-full px-10 py-2 border rounded pl-10"
              :class="{ 'border-red-500': errors.modelo }"
              placeholder="Ingrese el modelo"
              rules="required"
            />
            <ErrorMessage name="modelo" class="text-red-500 text-sm" />
          </div>
  
          <!-- Marca -->
          <div>
            <label for="marca" class="block text-md font-medium text-gray-700"
              >Marca</label
            >
            <Field
              name="marca"
              as="input"
              type="text"
              id="marca"
              class="w-full px-10 py-2 border rounded pl-10"
              :class="{ 'border-red-500': errors.marca }"
              placeholder="Ingrese la marca"
              rules="required"
            />
            <ErrorMessage name="marca" class="text-red-500 text-sm" />
          </div>
  
          <!-- Número de Serie -->
          <div>
            <label
              for="numeroSerie"
              class="block text-md font-medium text-gray-700"
              >Número de Serie</label
            >
            <Field
              name="numeroSerie"
              as="input"
              type="text"
              id="numeroSerie"
              class="w-full px-10 py-2 border rounded pl-10"
              :class="{ 'border-red-500': errors.numeroSerie }"
              placeholder="Ingrese el número de serie"
              rules="required"
            />
            <ErrorMessage name="numeroSerie" class="text-red-500 text-sm" />
          </div>
  
          <!-- Descripción del Problema -->
          <div class="md:col-span-2">
            <label
              for="descripcion"
              class="block text-md font-medium text-gray-700"
              >Descripción del Problema</label
            >
            <Field
              name="descripcion"
              as="textarea"
              id="descripcion"
              class="w-full px-10 py-2 border rounded pl-10"
              :class="{ 'border-red-500': errors.descripcion }"
              placeholder="Describa el problema"
              rules="required"
            />
            <ErrorMessage name="descripcion" class="text-red-500 text-sm" />
          </div>
  
          <!-- Cliente Propietario -->
          <div>
            <label for="cliente" class="block text-md font-medium text-gray-700"
              >Cliente Propietario</label
            >
            <Field
              name="cliente"
              as="select"
              id="cliente"
              class="w-full px-10 py-2 border rounded pl-10"
              :class="{ 'border-red-500': errors.cliente }"
              rules="required"
            >
              <option value="" disabled selected>Seleccione un cliente</option>
              <option
                v-for="cliente in clientes"
                :key="cliente.id"
                :value="cliente.id"
              >
                {{ cliente.nombre }}
              </option>
            </Field>
            <ErrorMessage name="cliente" class="text-red-500 text-sm" />
          </div>
  
          <!-- Técnico a Cargo -->
          <div>
            <label for="tecnico" class="block text-dm font-medium text-gray-700"
              >Técnico a Cargo</label
            >
            <Field
              name="tecnico"
              as="select"
              id="tecnico"
              class="w-full px-10 py-2 border rounded pl-10"
              :class="{ 'border-red-500': errors.tecnico }"
              rules="required"
            >
              <option value="" disabled selected>Seleccione un técnico</option>
              <option
                v-for="tecnico in tecnicos"
                :key="tecnico.id"
                :value="tecnico.id"
              >
                {{ tecnico.nombre }}
              </option>
            </Field>
            <ErrorMessage name="tecnico" class="text-red-500 text-sm" />
          </div>

        <div class="md:col-span-2 flex justify-end gap-4 mt-6">
          <button
            type="submit"
            class="focus:outline-none hover:scale-105 transition-all cursor-pointer hover:text-primary bg-blue-900 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Editar Equipo
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { Form, Field, ErrorMessage, defineRule } from "vee-validate";
import { defineComponent } from "vue";
import NavHeader from "~/components/navigation/NavHeader.vue";

defineRule("required", (value: string) => {
  return value ? true : "Este campo es obligatorio";
});

export default defineComponent({
  components: {
    NavHeader,
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const router = useRouter();

    const clientes = ref([
      { id: 1, nombre: "Cliente A" },
      { id: 2, nombre: "Cliente B" },
    ]);

    const tecnicos = ref([
      { id: 1, nombre: "Técnico A" },
      { id: 2, nombre: "Técnico B" },
    ]);

    const submitForm = async (values: any) => {
      try {
        // Aquí debes hacer la lógica para actualizar el dispositivo en el backend.
        // Simulamos la respuesta exitosa del backend
        const updateSuccessful = true; // Cambia esto por la lógica real de la API

        if (updateSuccessful) {
          // Muestra la alerta de éxito
          await Swal.fire({
            icon: "success",
            title: "¡Editado correctamente!",
            text: "El equipo ha sido actualizado con éxito.",
          });

          // Después de que se cierre el swal, redirigimos
          router.push("/dashboard/devices");
        } else {
          // Manejo de errores si la actualización falla
          await Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al editar el equipo.",
          });
        }
      } catch (error) {
        // Manejo de cualquier error inesperado
        console.error("Error al actualizar el equipo:", error);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al editar el equipo.",
        });
      }
    };

    const goBack = () => {
      router.go(-1); // Regresa a la pantalla anterior
    };

    return { submitForm,
         goBack,
        clientes,
        tecnicos };
  },
});
</script>

<style scoped>
/* Estilos adicionales (si los necesitas) */
</style>
