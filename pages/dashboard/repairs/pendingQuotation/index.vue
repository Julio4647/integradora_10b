<template>
  <div class="flex flex-col min-h-screen">
    <NavHeader />
    <div
      class="flex flex-col sm:flex-row justify-between items-center my-4 px-4"
    >
      <h1 class="text-2xl sm:text-3xl font-bold">Pendiente de Cotizacion</h1>
    </div>

    <div class="grid grid-cols-1 gap-4 p-3 mt-4">
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
            <h1 class="font-semibold text-gray-700">Costo Estimado</h1>
            <p class="text-gray-600">{{ repair.diagnostic_estimated_cost }}</p>
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
                class="w-5 h-5 mt-2 rounded-full"
              ></span>
            </div>
          <div class="flex gap-4 justify-center items-center">
            <div class="flex justify-center">
              <button
                @click="openModal()"
                class="rounded-lg bg-blue-900 shadow-lg hover:bg-blue-600 text-white p-3 flex items-center justify-center"
              >
                Cotizar
              </button>
            </div>
            <!--               <button
                @click="deleteRepair(repair.id)"
                class="rounded-full bg-red-700 shadow-lg hover:bg-red-500 p-4 flex items-center justify-center"
              >
                <Icon
                  icon="material-symbols:delete-forever"
                  class="w-5 h-5 text-white"
                />
              </button> -->
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

    <EditRepairModal
      v-if="isModalOpen"
      :isModalOpen="isModalOpen"
      @close="isModalOpen = false"
    />
    <RegisterRepairModal
      v-if="isRegisterModalOpen"
      :isModalOpen="isRegisterModalOpen"
      @close="isRegisterModalOpen = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import NavHeader from "~/components/navigation/NavHeader.vue";
import { Icon } from "@iconify/vue/dist/iconify.js";
import Swal from "sweetalert2";

export default defineComponent({
  components: {
    NavHeader,
  },
  name: "RepairList",
  setup() {
    const isModalOpen = ref(false);
    const isRegisterModalOpen = ref(false);

    const openModal = () => {
      isModalOpen.value = true;
    };

    const openRegisterModal = () => {
      isRegisterModalOpen.value = true;
    };

    const repairs = ref([
      {
        id: 1,
        model: "iPhone X",
        entry_date: "2024-11-01",
        diagnostic_estimated_cost: "$150",
        technician: "Carlos Pérez",
        diagnostic_parts: true,
      },
      {
        id: 2,
        model: "Samsung Galaxy S10",
        entry_date: "2024-11-02",
        diagnostic_estimated_cost: "$200",
        technician: "Ana García",
        diagnostic_parts: false,
      },
      // Más datos de ejemplo...
    ]);

    const itemsPerPage = 4;
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

    const deleteRepair = (repairId: number) => {
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
          removeRepair(repairId);

          Swal.fire({
            title: "¡Eliminado!",
            text: "La reparación ha sido eliminada.",
            icon: "success",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Aceptar",
          });
        }
      });
    };

    const removeRepair = (repairId: number) => {
      const index = repairs.value.findIndex((repair) => repair.id === repairId);
      if (index !== -1) {
        repairs.value.splice(index, 1);
      }
    };

    return {
      repairs,
      currentPage,
      totalPages,
      paginatedRepairs,
      prevPage,
      nextPage,
      isModalOpen,
      isRegisterModalOpen,
      openModal,
      openRegisterModal,
      deleteRepair,
    };
  },
});
</script>

<style scoped>
/* Estilos específicos para esta página */
</style>
