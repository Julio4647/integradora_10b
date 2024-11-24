<template>
  <div class="flex flex-col min-h-screen">
    <NavHeader />
    <div class="flex flex-col sm:flex-row justify-between items-center my-4 px-4">
      <h1 class="text-2xl sm:text-3xl font-bold">Pendiente de Cotización</h1>
    </div>

    <div class="grid grid-cols-1 gap-4 p-3 mt-2">
      <div
        v-for="repair in paginatedRepairs"
        :key="repair.id"
        class="p-6 border border-gray-300 rounded-lg w-full max-w mx-auto bg-white shadow-lg text-center"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
          <div class="flex flex-col">
            <h1 class="font-semibold text-gray-700">Modelo</h1>
            <p class="text-gray-600">{{ repair.model }}</p>
          </div>
          <div class="flex flex-col">
            <h1 class="font-semibold text-gray-700">Fecha de Ingreso</h1>
            <p class="text-gray-600">{{ repair.entry_date }}</p>
          </div>
          <div class="flex flex-col">
            <h1 class="font-semibold text-gray-700">Cliente</h1>
            <p class="text-gray-600">{{ repair.client }}</p>
          </div>
          <div class="flex flex-col">
            <h1 class="font-semibold text-gray-700">Técnico</h1>
            <p class="text-gray-600">{{ repair.technician }}</p>
          </div>
          <div class="flex flex-col items-center">
            <h1 class="font-semibold text-gray-700">Piezas</h1>
            <span
              :class="{
                'bg-green-500': repair.diagnostic_parts,
                'bg-red-500': !repair.diagnostic_parts,
              }"
              class="w-3 h-3 me-1 mt-2 rounded-full"
            ></span>
          </div>
          <div class="flex gap-4 justify-center items-center">
            <div class="flex justify-center">
              <span
                @click="openStatusModal(repair.status)"
                :class="getStatusStyle(repair.status)"
                class="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full cursor-pointer"
              >
                <span
                  :class="getStatusDotStyle(repair.status)"
                  class="w-2 h-2 me-1 rounded-full"
                ></span>
                {{ repair.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Paginador -->
    <div class="flex justify-center space-x-4 mt-4 mb-4">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-blue-900 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
      >
        Anterior
      </button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-blue-900 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>

    <!-- Modal de estado -->
    <RegisterQuotationModal
      v-if="isStatusModalOpen"
      :isModalOpen="isStatusModalOpen"
      :status="selectedStatus"
      @close="isStatusModalOpen = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import RegisterQuotationModal from "~/components/ModalQuotation/RegisterQuotationModal.vue";
import NavHeader from "~/components/navigation/NavHeader.vue";

export default defineComponent({
  components: {
    NavHeader,
    RegisterQuotationModal,
  },
  name: "RepairList",
  setup() {
    const isStatusModalOpen = ref(false);
    const selectedStatus = ref("");

    const openStatusModal = (status: string) => {
      selectedStatus.value = status;
      isStatusModalOpen.value = true;
    };

    const repairs = ref([
      {
        id: 1,
        model: "iPhone X",
        entry_date: "2024-11-01",
        client: "Miguel Gonzales",
        technician: "Carlos Pérez",
        diagnostic_parts: "Pila nueva, conector a corriente",
        status: "Cotizacion",
      },
      {
        id: 2,
        model: "Samsung Galaxy S10",
        entry_date: "2024-11-02",
        client: "Mar Salas",
        technician: "Ana García",
        diagnostic_parts: "",
        status: "Cotizacion",
      },
      {
        id: 3,
        model: "Samsung Galaxy S10",
        entry_date: "2024-11-02",
        client: "Roberto Mendoza",
        technician: "Ana García",
        diagnostic_parts: true,
        status: "Cotizacion",
      },
      {
        id: 4,
        model: "Samsung Galaxy S10",
        entry_date: "2024-11-02",
        client: "Luis",
        technician: "Ana García",
        diagnostic_parts: true,
        status: "Cotizacion",
      },
      {
        id: 5,
        model: "Samsung Galaxy S10",
        entry_date: "2024-11-02",
        client: "Luis",
        technician: "Ana García",
        diagnostic_parts: true,
        status: "Cotizacion",
      },
      // Más datos de ejemplo...
    ]);

    const itemsPerPage = 5;
    const currentPage = ref(1);

    const totalPages = computed(() =>
      Math.ceil(repairs.value.length / itemsPerPage)
    );

    const paginatedRepairs = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return repairs.value.slice(start, end);
    });

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const getStatusStyle = (status: string) => {
        const styles: Record<string, string> = {
          Ingresado: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
          Diagnóstico: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
          Cotizacion: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
          "En espera de aceptación del cliente": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
          "En espera de piezas": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
          "En reparación": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
          "Listo para entrega": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
          Entregado: "bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
        };
        return styles[status] || "bg-red-100 text-red-800";
      };

      const getStatusDotStyle = (status: string) => {
        const dotStyles: Record<string, string> = {
          Ingresado: "bg-blue-500",
          Diagnóstico: "bg-yellow-500",
          Cotización: "bg-gray-500",
          "En espera de aceptación del cliente": "bg-orange-500",
          "En espera de piezas": "bg-purple-500",
          "En reparación": "bg-green-500",
          "Listo para entrega": "bg-teal-500",
          Entregado: "bg-gray-500",
        };
        return dotStyles[status] || "bg-red-500";
      };

    return {
      repairs,
      currentPage,
      totalPages,
      paginatedRepairs,
      prevPage,
      nextPage,
      isStatusModalOpen,
      selectedStatus,
      openStatusModal,
      getStatusStyle,
      getStatusDotStyle,
    };
  },
});
</script>
