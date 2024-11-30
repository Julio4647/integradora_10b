<template>
  <div class="flex flex-col min-h-screen">
    <NavHeader />
    <div class="flex flex-col sm:flex-row justify-between items-center my-4 px-4">
      <h1 class="text-2xl sm:text-3xl font-bold">Lista de Dispositivos</h1>
      <button
        @click="openRegisterModal"
        class="focus:outline-none hover:scale-105 transition-all cursor-pointer hover:text-primary mt-2 sm:mt-0 bg-blue-900 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
      >
        Registrar Nuevo Dispositivo
      </button>
    </div>

    <!-- Filtros -->
    <div class="flex flex-col sm:flex-row justify-between items-center px-4 mb-4 space-y-4 sm:space-y-0">
      <!-- Buscador -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar por modelo, marca o número de serie"
        class="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-1/2"
      />

      <!-- Select de tipos de dispositivos -->
      <select
        v-model="selectedDeviceType"
        class="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-1/4"
      >
        <option value="">Todos los tipos</option>
        <option
          v-for="(label, type) in deviceTypeTranslations"
          :key="type"
          :value="type"
        >
          {{ label }}
        </option>
      </select>
    </div>

    <!-- Contenedor principal -->
    <div class="flex-grow">
      <!-- Spinner de carga -->
      <div v-if="isLoading" class="flex justify-center items-center h-96">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-700 border-solid"></div>
      </div>

      <!-- Lista de dispositivos -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        <div
          v-for="(item, index) in filteredAndPaginatedItems"
          :key="index"
          class="bg-white rounded-lg shadow-lg p-6"
        >
          <div class="flex items-center justify-center mb-4">
            <Icon :icon="getIcon(item.deviceType.name)" class="w-12 h-12 text-gray-500" />
          </div>
          <div>
            <h3 class="text-lg sm:text-xl font-bold text-center">{{ item.model }}</h3>
            <div class="grid grid-cols-2 text-center mt-3">
              <div>
                <p class="text-sm sm:text-base text-gray-600 mt-1">
                  <strong>Marca:</strong>
                </p>
                <p class="text-sm sm:text-base text-gray-600 mt-1">
                  {{ item.brand }}
                </p>
              </div>
              <div>
                <p class="text-sm sm:text-base text-gray-600 mt-1">
                  <strong># de serie:</strong>
                </p>
                <p class="text-sm sm:text-base text-gray-600 mt-1">
                  {{ item.serialNumber }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Paginador fijo -->
    <div class="flex justify-center mt-6 mb-4">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="bg-blue-900 hover:bg-blue-700 text-white px-4 py-2 rounded mx-1"
      >
        Anterior
      </button>
      <span class="px-4 py-2">Página {{ currentPage }} de {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="bg-blue-900 hover:bg-blue-700 text-white px-4 py-2 rounded mx-1"
      >
        Siguiente
      </button>
    </div>

    <RegisterDevicesModal
      :isModalOpen="isRegisterModalOpen"
      @close="handleModalClose"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { Icon } from "@iconify/vue/dist/iconify.js";
import NavHeader from "~/components/navigation/NavHeader.vue";
import Swal from "sweetalert2";
import RegisterDevicesModal from "~/components/ModalDevices/RegisterDevicesModal.vue";
import axios from "axios";

interface Device {
  id: number;
  model: string;
  brand: string;
  serialNumber: string;
  deviceType: {
    id: number;
    name: string;
  };
}

export default defineComponent({
  name: "devicesList",
  components: {
    NavHeader,
    RegisterDevicesModal,
  },
  setup() {
    const isRegisterModalOpen = ref(false);
    const items = ref<Device[]>([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(6);
    const isLoading = ref(true);
    const searchQuery = ref(""); // Buscador
    const selectedDeviceType = ref(""); // Filtro por tipo de dispositivo
    const config = useRuntimeConfig();
    const ApiUrl = config.public.apiUrl;

    const openRegisterModal = () => {
      isRegisterModalOpen.value = true;
    };

    const fetchDevices = async () => {
      isLoading.value = true;
      try {
        const response = await axios.get(`${ApiUrl}/device/`);
        items.value = response.data.data;
      } catch (error) {
        console.error("Error fetching devices:", error);
      } finally {
        isLoading.value = false;
      }
    };

    const handleModalClose = () => {
      isRegisterModalOpen.value = false;
      location.reload(); // Esto recargará la página al cerrar el modal
    };

    onMounted(() => {
      fetchDevices();
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredItems.value.length / itemsPerPage.value);
    });

    const filteredItems = computed(() => {
      return items.value.filter((item) => {
        const matchesSearch =
          searchQuery.value.trim() === "" ||
          item.model.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          item.brand.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          item.serialNumber
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase());

        const matchesDeviceType =
          selectedDeviceType.value === "" ||
          item.deviceType.name === selectedDeviceType.value;

        return matchesSearch && matchesDeviceType;
      });
    });

    const filteredAndPaginatedItems = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredItems.value.slice(start, end);
    });

    const deleteDevice = (item: Device) => {
      Swal.fire({
        title: "¿Estás seguro?",
        text: `Estás a punto de eliminar el dispositivo "${item.model}". Esta acción no se puede deshacer.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          items.value = items.value.filter((i) => i.id !== item.id);
          Swal.fire(
            "¡Eliminado!",
            `El dispositivo "${item.model}" ha sido eliminado.`,
            "success"
          );
        }
      });
    };

    const getIcon = (deviceType: string) => {
      switch (deviceType) {
        case "LAPTOP":
          return "material-symbols:laptop-mac";
        case "DESKTOP":
          return "material-symbols:desktop-windows";
        case "TABLET":
          return "material-symbols:tablet";
        case "SMARTPHONE":
          return "material-symbols:smartphone";
        case "SMARTWATCH":
          return "material-symbols:watch";
        case "VIDEOGAME_CONSOLE":
          return "material-symbols:videogame-asset";
        default:
          return "material-symbols:device-unknown";
      }
    };

    const deviceTypeTranslations: Record<string, string> = {
      LAPTOP: "Portátil",
      DESKTOP: "Computadora de escritorio",
      TABLET: "Tableta",
      SMARTPHONE: "Teléfono inteligente",
      SMARTWATCH: "Reloj inteligente",
      VIDEOGAME_CONSOLE: "Consola de videojuegos",
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    return {
      isRegisterModalOpen,
      openRegisterModal,
      items,
      currentPage,
      itemsPerPage,
      totalPages,
      filteredAndPaginatedItems,
      isLoading,
      searchQuery,
      selectedDeviceType,
      deviceTypeTranslations,
      deleteDevice,
      getIcon,
      nextPage,
      prevPage,
      handleModalClose,
    };
  },
});
</script>
