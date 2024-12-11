<template>
  <div class="flex flex-col min-h-screen">
    <NavHeader />
    <div
      class="flex flex-col sm:flex-row justify-between items-center my-4 px-4"
    >
      <h1 class="text-2xl sm:text-3xl font-bold">Cotizaciones</h1>
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
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
            <div class="flex flex-col">
              <h1 class="font-semibold text-gray-700">Modelo</h1>
              <p class="text-gray-600">{{ repair.device.model }}</p>
            </div>
            <div class="flex flex-col">
              <h1 class="font-semibold text-gray-700">Fecha de Ingreso</h1>
              <p class="text-gray-600">{{ formatDate(repair.entry_date) }}</p>
            </div>
            <div class="flex flex-col">
              <h1 class="font-semibold text-gray-700">Tecnico</h1>
              <p class="text-gray-600">
                {{ repair.technician.name }} {{ repair.technician.lastname }}
              </p>
            </div>
            <div class="flex flex-col">
              <h1 class="font-semibold text-gray-700">Cliente</h1>
              <p class="text-gray-600">
                {{ repair.client.name }} {{ repair.client.lastname }}
              </p>
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
                  @click="openStatusModal(repair)"
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
          No hay dispositivos en cotización.
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
    <RegisterQuotationModal
      v-if="isStatusModalOpen && selectedRepair"
      :isModalOpen="isStatusModalOpen"
      :repair="selectedRepair"
      @close="handleModalClose"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import axios from "axios";
import NavHeader from "~/components/navigation/NavHeader.vue";
import RegisterQuotationModal from "~/components/ModalQuotation/RegisterQuotationModal.vue";
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
  diagnosticImage: { id: number; name: string }[];
  repairImage: { id: number; name: string }[];
  client: {
    id: number;
    name: string;
    lastname: string;
    phone: string;
    email: string;
    new_user: boolean;
    active: boolean;
    userType: {
      id: number;
      name: string;
    };
    username: string;
  };
  technician: {
    id: number;
    name: string;
    lastname: string;
    phone: string;
    email: string;
    new_user: boolean;
    active: boolean;
    userType: {
      id: number;
      name: string;
    };
    username: string;
  };
}

export default defineComponent({
  components: {
    NavHeader,
    RegisterQuotationModal,
  },
  name: "QuotationList",
  setup() {
    const isStatusModalOpen = ref(false);
    const selectedRepair = ref<Repair | null>(null);
    const repairs = ref<Repair[]>([]);
    const isLoading = ref(true);
    const searchQuery = ref("");
    const itemsPerPage = 4;
    const currentPage = ref(1);

    const openStatusModal = (repair: Repair) => {
      selectedRepair.value = repair;
      isStatusModalOpen.value = true;
    };

    const totalPages = computed(() =>
      Math.ceil(filteredRepairs.value.length / itemsPerPage)
    );

    const handleModalClose = () => {
      isStatusModalOpen.value = false;
      location.reload();
    };

    const filteredRepairs = computed(() => {
      let filtered = repairs.value.filter(
        (repair) => repair.repairStatus.name === "QUOTATION"
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

    // Reparaciones paginadas
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

    // Función para formatear fechas
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return date.toLocaleDateString("es-ES", options);
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

    // Mapa de traducción de tipos de dispositivos
    const deviceTypeTranslations: Record<string, string> = {
      LAPTOP: "Portátil",
      SMARTPHONE: "Teléfono inteligente",
      TABLET: "Tableta",
      DESKTOP: "Computadora de escritorio",
      VIDEOGAME_CONSOLE: "Consola de videojuegos",
    };

    const translateStatus = (status: string): string =>
      statusTranslations[status] || status;

    // Función para traducir tipos de dispositivos
    const translateDeviceType = (deviceType: string): string =>
      deviceTypeTranslations[deviceType] || deviceType;

    const getStatusStyle = (status: string) =>
      ({ QUOTATION: "bg-gray-500 text-white dark:bg-gray-700 dark:text-white" }[
        status
      ] || "bg-red-500 text-white");

    const getStatusDotStyle = (status: string) =>
      ({ QUOTATION: "bg-gray-700" }[status] || "bg-red-700");

    const fetchRepairs = async () => {
      try {
        isLoading.value = true;
        const config = useRuntimeConfig();
        const ApiUrl = config.public.apiUrl;

        const response = await axios.get(`${ApiUrl}/repair/`);
        repairs.value = response.data.data;
      } catch (error) {
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
      openStatusModal,
      isStatusModalOpen,
      selectedRepair,
      handleModalClose,
    };
  },
});
</script>
