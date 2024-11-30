<template>
    <div
      v-if="isModalOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div
        class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
      >
        <h2 class="text-xl font-bold text-gray-800 mb-4">Confirmar Entrega</h2>
        <p class="text-gray-700 mb-6">
          ¿Estás seguro de que deseas completar la entrega del dispositivo <strong>{{ repair?.device?.model }}</strong>?
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
          >
            Cancelar
          </button>
          <button
            @click="$emit('confirmDelivery')"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Completar Entrega
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  
  export default defineComponent({
    name: "DeliveryConfirmationModal",
    props: {
      isModalOpen: {
        type: Boolean,
        required: true,
      },
      repair: {
        type: Object as PropType<{
          device: {
            model: string;
          };
        }>,
        required: false,
      },
    },
  });
  </script>
  
  <style scoped>
  /* Estilo adicional opcional */
  </style>
  