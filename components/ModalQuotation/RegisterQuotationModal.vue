<template>
  <div
    v-if="isModalOpen"
    class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6">
      <div class="flex justify-between items-center border-b pb-4">
        <h2 class="text-2xl font-bold">Cotización</h2>
        <button
          @click="$emit('close')"
          class="text-gray-600 hover:text-gray-800 transition"
        >
          <span class="material-icons">close</span>
        </button>
      </div>
      <div class="grid grid-cols-2 mt-4 gap-4">
        <div>
          <p><strong>Modelo:</strong></p>
          <p>{{ repair?.device.model || "N/A" }}</p>
        </div>
        <div>
          <p><strong>Piezas Diagnósticas:</strong></p>
          <p>{{ repair?.diagnostic_parts || "No se requieren" }}</p>
        </div>
        <div>
          <p><strong>Costo Estimado del Diagnóstico:</strong></p>
          <p>{{ repair?.diagnostic_estimated_cost || "No estimado" }}</p>
        </div>
      </div>
      <Form
        @submit="submitForm"
        v-slot="{ errors }"
        class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
      >
        <div>
          <label for="handwork_cost" class="block text-md font-medium text-gray-700"
            >Costo de Mano de Obra</label
          >
          <Field
            name="handwork_cost"
            as="input"
            type="text"
            id="handwork_cost"
            class="w-full px-4 py-2 border rounded"
            :class="{ 'border-red-500': errors.handwork_cost }"
            placeholder="Ingrese el costo de mano de obra"
            rules="required|numeric|min_value:0"
          />
          <ErrorMessage name="handwork_cost" class="text-red-500 text-sm" />
        </div>
        <div>
          <label for="parts_cost" class="block text-md font-medium text-gray-700"
            >Costo de Piezas</label
          >
          <Field
            name="parts_cost"
            as="input"
            type="text"
            id="parts_cost"
            class="w-full px-4 py-2 border rounded"
            :class="{ 'border-red-500': errors.parts_cost }"
            placeholder="Ingrese el costo de las piezas (o 0 si no aplica)"
            rules="required|numeric|min_value:0"
          />
          <ErrorMessage name="parts_cost" class="text-red-500 text-sm" />
        </div>
        <div>
          <label for="profit" class="block text-md font-medium text-gray-700"
            >Ganancia (Porcentaje)</label
          >
          <Field
            name="profit"
            as="input"
            type="text"
            id="profit"
            class="w-full px-4 py-2 border rounded"
            :class="{ 'border-red-500': errors.profit }"
            placeholder="Ingrese el porcentaje de ganancia"
            rules="required|numeric|min_value:0"
          />
          <ErrorMessage name="profit" class="text-red-500 text-sm" />
        </div>
        <div class="md:col-span-2 flex justify-end gap-4 mt-6">
          <button
            type="submit"
            class="focus:outline-none hover:scale-105 transition-all cursor-pointer hover:text-primary bg-blue-900 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Registrar Cotización
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Form, Field, ErrorMessage, defineRule } from "vee-validate";
import axios from "axios";
import Swal from "sweetalert2";

// Reglas de validación globales
defineRule("required", (value: string) => {
  return value ? true : "Este campo es obligatorio";
});

defineRule("numeric", (value: string) => {
  return !isNaN(Number(value)) || "Debe ser un número válido";
});

defineRule("min_value", (value: number, [min]: any[]) => {
  return value >= min || `Debe ser mayor o igual a ${min}`;
});

interface Repair {
  id: number;
  diagnostic_parts: string | null;
  diagnostic_estimated_cost: number | null;
  device: {
    model: string;
  };
}

export default defineComponent({
  name: "RegisterQuotationModal",
  props: {
    isModalOpen: {
      type: Boolean,
      required: true,
    },
    repair: {
      type: Object as PropType<Repair | null>,
      required: true,
    },
  },
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  emits: ["close"],
  setup(props, { emit }) {
    const submitForm = async (values: Record<string, string>) => {
      try {
        const payload = {
          id: props.repair?.id,
          handwork_cost: parseFloat(values.handwork_cost), // Convertir a número
          parts_cost: parseFloat(values.parts_cost), // Convertir a número
          profit: parseInt(values.profit), // Convertir a entero
        };

        console.log(payload)

        const config = useRuntimeConfig();
        const ApiUrl = config.public.apiUrl;

        const response = await axios.put(`${ApiUrl}/repair/status/quotation`, payload);

        if (response.status === 200) {
          await Swal.fire({
            icon: "success",
            title: "Cotización Registrada",
            text: `La cotización para ${props.repair?.device.model} ha sido registrada exitosamente.`,
          });
          emit("close");
        } else {
          throw new Error("Error en el servidor");
        }
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un problema al registrar la cotización.",
        });
      }
    };

    return {
      submitForm,
    };
  },
});
</script>

<style scoped>
/* Estilos personalizados */
</style>
