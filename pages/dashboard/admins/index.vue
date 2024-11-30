<template>
  <div class="flex flex-col min-h-screen">
    <NavHeader />

    <!-- Contenido principal -->
    <div class="flex-grow flex flex-col">
      <!-- Título, buscador y botón -->
      <div
        class="flex flex-col sm:flex-row justify-between items-center my-4 px-4"
      >
        <h1 class="text-2xl sm:text-3xl font-bold">Lista de Administradores</h1>
        <div class="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            @click="openRegisterModal"
            class="focus:outline-none hover:scale-105 transition-all cursor-pointer hover:text-primary bg-blue-900 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Registrar Nuevo Administrador
          </button>
        </div>
      </div>
      <div class="px-4 mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nombre o apellido"
          class="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-1/2"
        />
      </div>

      <!-- Spinner de carga -->
      <div v-if="isLoading" class="flex justify-center items-center flex-grow">
        <div
          class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-700"
        ></div>
      </div>

      <!-- Lista de administradores -->
      <div v-if="!isLoading && filteredAdmins.length" class="flex-grow">
        <div class="grid grid-cols-1 gap-4 p-3 mt-4">
          <div
            v-for="admin in paginatedAdmins"
            :key="admin.id"
            class="p-6 border border-gray-300 rounded-lg w-full max-w mx-auto bg-white shadow-lg text-center"
          >
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div class="flex flex-col">
                <h1 class="font-semibold text-gray-700">Nombre</h1>
                <p class="text-gray-600">{{ admin.name }}</p>
              </div>
              <div class="flex flex-col">
                <h1 class="font-semibold text-gray-700">Apellidos</h1>
                <p class="text-gray-600">{{ admin.lastname }}</p>
              </div>
              <div class="flex flex-col">
                <h1 class="font-semibold text-gray-700">Teléfono</h1>
                <p class="text-gray-600">{{ admin.phone }}</p>
              </div>
              <div class="flex flex-col">
                <h1 class="font-semibold text-gray-700">Email</h1>
                <p class="text-gray-600">{{ admin.email }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensaje cuando no hay administradores -->
      <div v-if="!isLoading && !filteredAdmins.length" class="text-center mt-10">
        <p class="text-gray-600">No hay administradores registrados.</p>
      </div>

      <!-- Paginador -->
      <div v-if="filteredAdmins.length" class="flex justify-center space-x-4 mt-4 mb-4">
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

    <EditAdminModal
      v-if="isModalOpen"
      :isModalOpen="isModalOpen"
      @close="isModalOpen = false"
    />
    <RegisterAdminModal
      v-if="isRegisterModalOpen"
      :isModalOpen="isRegisterModalOpen"
      @close="handleModalClose"
      @refresh="fetchAdmins"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import NavHeader from "~/components/navigation/NavHeader.vue";
import EditAdminModal from "~/components/ModalAdmin/EditAdminModal.vue";
import RegisterAdminModal from "~/components/ModalAdmin/RegisterAdminModal.vue";
import axios from "axios";

interface Admin {
  id: number;
  name: string;
  lastname: string;
  phone: string;
  email: string;
}

export default defineComponent({
  components: {
    NavHeader,
    EditAdminModal,
    RegisterAdminModal,
  },
  name: "AdminList",
  setup() {
    const isLoading = ref(true);
    const isModalOpen = ref(false);
    const isRegisterModalOpen = ref(false);
    const admins = ref<Admin[]>([]);
    const searchQuery = ref(""); // Query del buscador
    const currentPage = ref(1);
    const itemsPerPage = 4;
    const config = useRuntimeConfig();
    const ApiUrl = config.public.apiUrl;

    const fetchAdmins = async () => {
      try {
        isLoading.value = true;
        const response = await axios.get(`${ApiUrl}/user/admins`);
        admins.value = response.data.data;
      } catch (error) {
        console.error("Error fetching admins:", error);
      } finally {
        isLoading.value = false;
      }
    };

    const filteredAdmins = computed(() => {
      if (!searchQuery.value) {
        return admins.value; // Sin filtro, devolver todos los administradores
      }
      const query = searchQuery.value.toLowerCase();
      return admins.value.filter(
        (admin) =>
          admin.name.toLowerCase().includes(query) ||
          admin.lastname.toLowerCase().includes(query)
      );
    });

    const handleModalClose = () => {
      isRegisterModalOpen.value = false;
      location.reload(); // Esto recargará la página al cerrar el modal
    };

    const totalPages = computed(() =>
      Math.ceil(filteredAdmins.value.length / itemsPerPage)
    );

    const paginatedAdmins = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredAdmins.value.slice(start, end);
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

    const openRegisterModal = () => {
      isRegisterModalOpen.value = true;
    };

    onMounted(fetchAdmins);

    return {
      isLoading,
      admins,
      searchQuery,
      filteredAdmins,
      paginatedAdmins,
      currentPage,
      totalPages,
      prevPage,
      nextPage,
      isModalOpen,
      isRegisterModalOpen,
      openRegisterModal,
      fetchAdmins,
      handleModalClose
    };
  },
});
</script>

<style scoped></style>
