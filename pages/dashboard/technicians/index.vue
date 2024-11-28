<template>
  <div class="flex flex-col min-h-screen">
    <NavHeader />

    <!-- Contenido principal -->
    <div class="flex-grow flex flex-col">
      <!-- Título y botón -->
      <div
        class="flex flex-col sm:flex-row justify-between items-center my-4 px-4"
      >
        <h1 class="text-2xl sm:text-3xl font-bold">Lista de Técnicos</h1>
        <button
          @click="openRegisterModal"
          class="focus:outline-none hover:scale-105 transition-all cursor-pointer hover:text-primary mt-2 sm:mt-0 bg-blue-900 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Registrar Nuevo Técnico
        </button>
      </div>

      <!-- Spinner de carga -->
      <div v-if="isLoading" class="flex justify-center items-center flex-grow">
        <div
          class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-700"
        ></div>
      </div>

      <!-- Lista de técnicos -->
      <div v-if="!isLoading" class="flex-grow">
        <div class="grid grid-cols-1 gap-4 p-3 mt-4">
          <div
            v-for="technician in paginatedTechnicians"
            :key="technician.id"
            class="p-6 border border-gray-300 rounded-lg w-full max-w mx-auto bg-white shadow-lg text-center"
          >
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div class="flex flex-col">
                <h1 class="font-semibold text-gray-700">Nombre</h1>
                <p class="text-gray-600">{{ technician.name }}</p>
              </div>
              <div class="flex flex-col">
                <h1 class="font-semibold text-gray-700">Apellidos</h1>
                <p class="text-gray-600">{{ technician.lastname }}</p>
              </div>
              <div class="flex flex-col">
                <h1 class="font-semibold text-gray-700">Teléfono</h1>
                <p class="text-gray-600">{{ technician.phone }}</p>
              </div>
              <div class="flex flex-col">
                <h1 class="font-semibold text-gray-700">Email</h1>
                <p class="text-gray-600">{{ technician.email }}</p>
              </div>
             <!-- <div class="flex gap-4 justify-center items-center">
                <button
                  @click="openModal()"
                  class="rounded-full bg-yellow-500 shadow-lg hover:bg-yellow-300 p-4 flex items-center justify-center"
                >
                  <Icon
                    icon="material-symbols:box-edit-outline"
                    class="w-5 h-5 text-white"
                  />
                </button>
                <button
                  @click="deleteTechnician()"
                  class="rounded-full bg-red-700 shadow-lg hover:bg-red-500 p-4 flex items-center justify-center"
                >
                  <Icon
                    icon="material-symbols:delete-forever"
                    class="w-5 h-5 text-white"
                  />
                </button>
              </div>-->
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
    </div>

    <EditTechnicianModal
      v-if="isModalOpen"
      :isModalOpen="isModalOpen"
      @close="isModalOpen = false"
    />
    <RegisterTechnicianModal
      v-if="isRegisterModalOpen"
      :isModalOpen="isRegisterModalOpen"
      @close="handleModalClose"
    />
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import NavHeader from "~/components/navigation/NavHeader.vue";
import { Icon } from "@iconify/vue/dist/iconify.js";
import Swal from "sweetalert2";
import RegisterTechnicianModal from "~/components/ModalTechnician/RegisterTechnicianModal.vue";
import EditTechnicianModal from "~/components/ModalTechnician/EditTechnicianModal.vue";
import axios from "axios";

interface Technician {
  id: number;
  name: string;
  lastname: string;
  phone: string;
  email: string;
}

export default defineComponent({
  components: {
    NavHeader,
    RegisterTechnicianModal,
    EditTechnicianModal,
  },
  methods: {
    deleteTechnician() {
      // Mostrar alerta de confirmación
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás recuperar esta información!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
      }).then((result) => {
        if (result.isConfirmed) {
          // Aquí va la lógica para eliminar el cliente

          // Mostrar alerta de éxito después de la eliminación
          Swal.fire({
            title: "¡Eliminado!",
            text: "El cliente ha sido eliminado.",
            icon: "success",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Aceptar",
          });
        }
      });
    },
  },
  name: "TechnicianList",
  setup() {
    const isLoading = ref(true); // Estado de carga
    const isModalOpen = ref(false);
    const isRegisterModalOpen = ref(false);
    const technicians = ref<Technician[]>([]);
    const config = useRuntimeConfig();
    const ApiUrl = config.public.apiUrl;

    const fetchTechnicians = async () => {
      try {
        isLoading.value = true; // Activar estado de carga
        const response = await axios.get(`${ApiUrl}/user/technicians`);
        technicians.value = response.data.data;
      } catch (error) {
        console.error("Error fetching technicians:", error);
      } finally {
        isLoading.value = false; // Desactivar estado de carga
      }
    };

    const handleModalClose = () => {
      isRegisterModalOpen.value = false;
      location.reload();
    };

    onMounted(() => {
      fetchTechnicians();
    });

    const openModal = () => {
      isModalOpen.value = true;
    };

    const openRegisterModal = () => {
      isRegisterModalOpen.value = true;
    };

    const itemsPerPage = 4;
    const currentPage = ref(1);

    const totalPages = computed(() =>
      Math.ceil(technicians.value.length / itemsPerPage)
    );

    const paginatedTechnicians = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return technicians.value.slice(start, end);
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

    return {
      technicians,
      currentPage,
      totalPages,
      paginatedTechnicians,
      prevPage,
      nextPage,
      isLoading,
      isModalOpen,
      isRegisterModalOpen,
      openModal,
      openRegisterModal,
      handleModalClose
    };
  },
});
</script>

<style scoped>
/* Spinner CSS */
.animate-spin {
  border-radius: 9999px;
  border-width: 4px;
  border-color: transparent;
  border-top-color: #1d4ed8;
}
</style>
