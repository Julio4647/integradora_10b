<template>
  <div
    v-if="isModalOpen"
    class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6">
      <div class="flex justify-between items-center border-b pb-4">
        <h2 class="text-2xl font-bold">Cotizacion</h2>
        <button
          @click="$emit('close')"
          class="text-gray-600 hover:text-gray-800 transition"
        >
          <span class="material-icons">X</span>
        </button>
      </div>
      <div class="grid grid-cols-2 mt-4">
        <div>
          <p><strong>Diagnóstico de Partes :</strong></p>
          <p>Nueva pila, Nuevo lente de camara</p>
        </div>
        <div>
          <p><strong>Costo estimado :</strong></p>
          <p>500</p>
        </div>
      </div>
      <Form
        @submit="submitForm"
        v-slot="{ errors }"
        class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
      >
        <div>
          <label for="labour" class="block text-md font-medium text-gray-700"
            >Precio Mano de Obra</label
          >
          <Field
            name="labour"
            as="input"
            type="number"
            id="labour"
            class="w-full px-10 py-2 border rounded pl-10"
            :class="{ 'border-red-500': errors.labour }"
            placeholder="Ingrese el costo de mano de obra"
            rules="required"
          />
          <ErrorMessage name="labour" class="text-red-500 text-sm" />
        </div>
        <div>
          <label
            for="price_per_piece"
            class="block text-md font-medium text-gray-700"
            >Precio Piezas</label
          >
          <Field
            name="price_per_piece"
            as="input"
            type="number"
            id="price_per_piece"
            class="w-full px-10 py-2 border rounded pl-10"
            :class="{ 'border-red-500': errors.price_per_piece }"
            placeholder="Ingrese el costo del precio de las piezas"
            rules="required"
          />
          <ErrorMessage name="price_per_piece" class="text-red-500 text-sm" />
        </div>
        <div class="md:col-span-2 flex justify-end gap-4 mt-6">
          <button
            type="submit"
            class="focus:outline-none hover:scale-105 transition-all cursor-pointer hover:text-primary bg-blue-900 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Aceptar Cotizacion
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Form, Field, ErrorMessage, defineRule } from "vee-validate";
import Swal from "sweetalert2";

defineRule("required", (value: string) => {
  return value ? true : "Este campo es obligatorio";
});

export default defineComponent({
  name: "StatusModal",
  props: {
    isModalOpen: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  emits: ["close"],
  methods: {
    closeModal() {
      this.$emit("close");
    },
  },
  setup(_, { emit }) {
    const submitForm = async () => {
        try {
          const response = true;
  
          if (response) {
            await Swal.fire({
              icon: "success",
              title: "Cotización Aprobada!",
              text: "Cotización Aprobada exitosamente",
            });
            emit("close");
          } else {
            await Swal.fire({
              icon: "error",
              title: "Error",
              text: "Hubo un problema al completar la cotización",
            });
          }
        } catch (error) {
          await Swal.fire({
            icon: "error",
            title: "Error",
            text: "Se produjo un error inesperado.",
          });
        }
      };

      return {
        submitForm
      }
  }
});
</script>

<style scoped>
/* Añade tus estilos aquí */
</style>
