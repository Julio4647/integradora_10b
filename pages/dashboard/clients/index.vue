<template>
  <div class="flex flex-col min-h-screen">
    <!-- Encabezado -->
    <NavHeader />

    <!-- Contenido Principal -->
    <div class="flex-grow">
      <div
        class="flex flex-col sm:flex-row justify-between items-center my-4 px-4"
      >
        <h1 class="text-2xl sm:text-3xl font-bold">Lista de Clientes</h1>
        <button
          @click="openRegisterModal"
          class="focus:outline-none font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary mt-2 sm:mt-0 bg-blue-900 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Registrar Nuevo Cliente
        </button>
      </div>

      <!-- Buscador -->
      <div class="px-4 mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nombre o apellido"
          class="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-1/2"
        />
      </div>

      <!-- Spinner de carga -->
      <div v-if="isLoading" class="flex justify-center items-center h-96">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-700"></div>
      </div>

      <!-- Lista de clientes -->
      <div v-else class="grid grid-cols-1 gap-4 p-3 mt-4">
        <div
          v-for="client in filteredClients"
          :key="client.id"
          class="p-6 border border-gray-300 rounded-lg w-full max-w mx-auto bg-white shadow-lg text-center"
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div class="flex flex-col">
              <h1 class="font-semibold text-gray-700">Nombre</h1>
              <p class="text-gray-600">{{ client.name }}</p>
            </div>
            <div class="flex flex-col">
              <h1 class="font-semibold text-gray-700">Apellidos</h1>
              <p class="text-gray-600">{{ client.lastname }}</p>
            </div>
            <div class="flex flex-col">
              <h1 class="font-semibold text-gray-700">Teléfono</h1>
              <p class="text-gray-600">{{ client.phone }}</p>
            </div>
            <div class="flex flex-col">
              <h1 class="font-semibold text-gray-700">Email</h1>
              <p class="text-gray-600">{{ client.email }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Paginador -->
    <div class="flex justify-center space-x-4 mt-auto mb-4" v-if="!isLoading">
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

    <!-- Modales -->
    <EditClientModal
      v-if="isModalOpen"
      :isModalOpen="isModalOpen"
      @close="isModalOpen = false"
    />
    <RegisterClientModal
      v-if="isRegisterModalOpen"
      :isModalOpen="isRegisterModalOpen"
      @close="handleModalClose"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import NavHeader from "~/components/navigation/NavHeader.vue";
import RegisterClientModal from "~/components/ModalClient/RegisterClientModal.vue";
import EditClientModal from "~/components/ModalClient/EditClientModal.vue";
import axios from "axios";
import { definePageMeta } from "#imports";

definePageMeta({
  middleware: "auth", // Aplica el middleware 'auth' a esta página
});

interface Client {
  id: number;
  name: string;
  lastname: string;
  phone: string;
  email: string;
}

export default defineComponent({
  components: {
    NavHeader,
    RegisterClientModal,
    EditClientModal,
  },
  setup() {
    const isLoading = ref(true); // Indicador de carga
    const isModalOpen = ref(false);
    const isRegisterModalOpen = ref(false);
    const clients = ref<Client[]>([]);
    const searchQuery = ref(""); // Query del buscador
    const currentPage = ref(1);
    const itemsPerPage = 4;

    const config = useRuntimeConfig();
    const ApiUrl = config.public.apiUrl;

    const fetchClients = async () => {
      try {
        isLoading.value = true;
        const response = await axios.get(`${ApiUrl}/user/clients`);
        clients.value = response.data.data;
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        isLoading.value = false; // Detener la carga
      }
    };

    const handleModalClose = () => {
      isRegisterModalOpen.value = false;
      fetchClients(); // Actualizar la lista al cerrar el modal
    };

    const openModal = () => {
      isModalOpen.value = true;
    };

    const openRegisterModal = () => {
      isRegisterModalOpen.value = true;
    };

    const filteredClients = computed(() => {
      if (!searchQuery.value) {
        return clients.value; // Mostrar todos los clientes si no hay búsqueda
      }
      const query = searchQuery.value.toLowerCase();
      return clients.value.filter(
        (client) =>
          client.name.toLowerCase().includes(query) ||
          client.lastname.toLowerCase().includes(query)
      );
    });

    const totalPages = computed(() =>
      Math.ceil(filteredClients.value.length / itemsPerPage)
    );

    const paginatedClients = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredClients.value.slice(start, end);
    });

    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value--;
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
    };

    onMounted(() => {
      fetchClients();
    });

    return {
      isLoading,
      clients,
      searchQuery,
      currentPage,
      totalPages,
      paginatedClients,
      filteredClients,
      prevPage,
      nextPage,
      isModalOpen,
      isRegisterModalOpen,
      openModal,
      openRegisterModal,
      handleModalClose,
    };
  },
});
</script>

<style scoped></style>
