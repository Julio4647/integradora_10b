<template>
  <div class="flex flex-col min-h-screen">
    <NavHeader />
    <div
      class="flex flex-col sm:flex-row justify-between items-center my-4 px-4"
    >
      <h1 class="text-2xl sm:text-3xl font-bold">Dispositivos Entregados</h1>
    </div>

    <!-- Filtros de búsqueda -->
    <div
      class="flex flex-col sm:flex-row justify-between items-center px-4 mb-4 space-y-4 sm:space-y-0"
    >
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar por modelo, tipo de dispositivo, o cliente"
        class="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-1/2"
      />
    </div>

    <!-- Contenido principal -->
    <div class="flex-1 overflow-y-auto">
      <!-- Spinner de carga -->
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div
          class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"
        ></div>
      </div>

      <!-- Lista de reparaciones -->
      <div v-else class="grid grid-cols-1 gap-4 p-3 mt-4">
        <div
          v-for="repair in paginatedRepairs"
          :key="repair.id"
          class="p-6 border border-gray-300 rounded-lg w-full max-w mx-auto bg-white shadow-lg text-center"
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div class="flex flex-col">
              <h1 class="font-semibold text-gray-700">Modelo</h1>
              <p class="text-gray-600">{{ repair.device.model }}</p>
            </div>
            <div class="flex flex-col">
              <h1 class="font-semibold text-gray-700">Fecha de Ingreso</h1>
              <p class="text-gray-600">{{ formatDate(repair.entry_date) }}</p>
            </div>
            <div class="flex flex-col">
              <h1 class="font-semibold text-gray-700">Tipo Dispositivo</h1>
              <p class="text-gray-600">
                {{ translateDeviceType(repair.device.deviceType.name) }}
              </p>
            </div>
            <div class="flex gap-4 justify-center items-center">
              <div class="flex justify-center">
                <span
                  :class="getStatusStyle(repair.repairStatus.name)"
                  class="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full cursor-pointer"
                >
                  <span
                    :class="getStatusDotStyle(repair.repairStatus.name)"
                    class="w-2 h-2 me-1 rounded-full"
                  ></span>
                  {{ translateStatus(repair.repairStatus.name) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Mensaje si no hay datos -->
        <div v-if="!paginatedRepairs.length" class="text-center text-gray-500">
          No hay dispositivos entregados.
        </div>
      </div>
    </div>

    <!-- Paginador fijo -->
    <div
      class="fixed bottom-0 left-0 w-full flex justify-center space-x-4 bg-white py-4 shadow-md"
    >
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import axios from "axios";
import NavHeader from "~/components/navigation/NavHeader.vue";
import { definePageMeta } from "#imports";

definePageMeta({
  middleware: "auth",
});

interface Repair {
  id: number;
  problem_description: string;
  entry_date: string;
  diagnostic_observations: string | null;
  diagnostic_parts: string | null;
  diagnostic_estimated_cost: number;
  total_price: number;
  repair_observations: string | null;
  repair_start: string | null;
  repair_end: string | null;
  paid: boolean;
  repairStatus: {
    id: number;
    name: string;
  };
  device: {
    id: number;
    model: string;
    brand: string;
    serialNumber: string;
    deviceType: {
      id: number;
      name: string;
    };
  };
  diagnosticImage: any[];
  repairImage: any[];
}

export default defineComponent({
  components: {
    NavHeader,
  },
  name: "CollectedRepairsList",
  setup() {
    const repairs = ref<Repair[]>([]); 
    const isLoading = ref(true);
    const searchQuery = ref("");
    const itemsPerPage = 4;
    const currentPage = ref(1);

    const totalPages = computed(() =>
      Math.ceil(filteredRepairs.value.length / itemsPerPage)
    );

    const filteredRepairs = computed(() => {
      let filtered = repairs.value.filter(
        (repair) => repair.repairStatus.name === "COLLECTED"
      );

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(
          (repair) =>
            repair.device.model.toLowerCase().includes(query) ||
            repair.device.deviceType.name.toLowerCase().includes(query)
        );
      }

      return filtered;
    });

    const paginatedRepairs = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredRepairs.value.slice(start, end);
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

    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return date.toLocaleDateString("es-ES", options);
    };

    const deviceTypeTranslations: Record<string, string> = {
      LAPTOP: "Portátil",
      SMARTPHONE: "Teléfono inteligente",
      TABLET: "Tableta",
      DESKTOP: "Computadora de escritorio",
      VIDEOGAME_CONSOLE: "Consola de videojuegos",
    };

    const statusTranslations: Record<string, string> = {
      RECEIVED: "Recibido",
      QUOTATION: "Cotización",
      WAITING_FOR_PARTS: "Esperando piezas",
      REPAIRING: "En reparación",
      READY_FOR_COLLECTION: "Listo para entrega",
      COLLECTED: "Entregado",
      WAITING_FOR_CUSTOMER_APPROVAL: "Esperando aprobación del cliente",
    };

    const translateDeviceType = (deviceType: string): string =>
      deviceTypeTranslations[deviceType] || deviceType;

    const translateStatus = (status: string): string =>
      statusTranslations[status] || status;

    const getStatusStyle = (status: string) => {
      const styles: Record<string, string> = {
        RECEIVED: "bg-blue-500 text-white dark:bg-blue-700 dark:text-white",
        QUOTATION: "bg-gray-500 text-white dark:bg-gray-700 dark:text-white",
        WAITING_FOR_PARTS:
          "bg-purple-500 text-white dark:bg-purple-700 dark:text-white",
        REPAIRING: "bg-green-500 text-white dark:bg-green-700 dark:text-white",
        READY_FOR_COLLECTION:
          "bg-teal-500 text-white dark:bg-teal-700 dark:text-white",
        COLLECTED: "bg-pink-500 text-white dark:bg-pink-700 dark:text-white",
        WAITING_FOR_CUSTOMER_APPROVAL:
          "bg-orange-500 text-white dark:bg-orange-700 dark:text-white",
      };
      return styles[status] || "bg-red-500 text-white";
    };

    const getStatusDotStyle = (status: string) => {
      const dotStyles: Record<string, string> = {
        RECEIVED: "bg-blue-700",
        QUOTATION: "bg-gray-700",
        WAITING_FOR_PARTS: "bg-purple-700",
        REPAIRING: "bg-green-700",
        READY_FOR_COLLECTION: "bg-teal-700",
        COLLECTED: "bg-pink-700",
        WAITING_FOR_CUSTOMER_APPROVAL: "bg-orange-700",
      };
      return dotStyles[status] || "bg-red-700";
    };

    const fetchRepairs = async () => {
      try {
        isLoading.value = true;
        const config = useRuntimeConfig();
        const ApiUrl = config.public.apiUrl;

        const response = await axios.get(`${ApiUrl}/repair/`);
        repairs.value = response.data.data;
      } catch (error) {
        console.error("Error al cargar las reparaciones:", error);
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      fetchRepairs();
    });

    return {
      repairs,
      searchQuery,
      currentPage,
      totalPages,
      paginatedRepairs,
      filteredRepairs,
      prevPage,
      nextPage,
      formatDate,
      translateStatus,
      translateDeviceType,
      getStatusStyle,
      getStatusDotStyle,
      isLoading,
    };
  },
});
</script>
