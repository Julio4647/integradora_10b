<template>
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
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4"
  >
    <div
      v-for="(item, index) in paginatedItems"
      :key="index"
      class="bg-white rounded-lg shadow-lg p-6"
    >
      <div class="flex items-center justify-center mb-4">
        <Icon :icon="getIcon(item.tipo)" class="w-12 h-12 text-gray-500" />
      </div>
      <div>
        <h3 class="text-lg sm:text-xl font-bold text-center">{{ item.modelo }}</h3>
        <div class="grid grid-cols-2 text-center mt-3">
          <div>
            <p class="text-sm sm:text-base text-gray-600 mt-1">
              <strong>Marca:</strong>
            </p>
            <p class="text-sm sm:text-base text-gray-600 mt-1">
              {{ item.marca }}
            </p>
          </div>
          <div>
            <p class="text-sm sm:text-base text-gray-600 mt-1">
              <strong># de serie:</strong>
            </p>
            <p class="text-sm sm:text-base text-gray-600 mt-1">
              {{ item.numeroSerie }}
            </p>
          </div>
        </div>
      </div>
      <div class="mt-4 flex justify-center">
        <button
          @click="deleteDevice(item)"
          class="rounded-full bg-red-700 shadow-lg hover:bg-red-500 p-4 flex items-center justify-center"
        >
          <Icon
            icon="material-symbols:delete-forever"
            class="w-5 h-5 text-white"
          />
        </button>
      </div>
    </div>
  </div>
  <div class="flex justify-center mt-6">
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
    @close="isRegisterModalOpen = false"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Icon } from "@iconify/vue/dist/iconify.js";
import NavHeader from "~/components/navigation/NavHeader.vue";
import Swal from "sweetalert2";

export default defineComponent({
  name: "devicesList",
  components: {
    NavHeader,
  },
  setup() {
    const isModalOpen = ref(false);
    const isRegisterModalOpen = ref(false);

    const openModal = () => {
      isModalOpen.value = true;
    };

    const openRegisterModal = () => {
      isRegisterModalOpen.value = true;
    };

    return {
      isModalOpen,
      isRegisterModalOpen,
      openModal,
      openRegisterModal,
    };
  },
  data() {
    return {
      items: [
        {
          id: 1,
          modelo: "iPhone 13",
          marca: "Apple",
          numeroSerie: "ABC123456",
          tipo: "celular",
        },
        {
          id: 2,
          modelo: "MacBook Pro",
          marca: "Apple",
          numeroSerie: "DEF789012",
          tipo: "laptop",
        },
        {
          id: 3,
          modelo: "Galaxy Watch 4",
          marca: "Samsung",
          numeroSerie: "GHI345678",
          tipo: "smartwatch",
        },
        {
          id: 4,
          modelo: "JBL Flip 5",
          marca: "JBL",
          numeroSerie: "JKL901234",
          tipo: "bocinas",
        },
        {
          id: 5,
          modelo: "PlayStation 5",
          marca: "Sony",
          numeroSerie: "MNO567890",
          tipo: "consola de videojuegos",
        },
        {
          id: 6,
          modelo: "Switch OLED",
          marca: "Nintendo",
          numeroSerie: "OPQ123456",
          tipo: "consola de videojuegos",
        },
        {
          id: 7,
          modelo: "Surface Pro 7",
          marca: "Microsoft",
          numeroSerie: "RST789012",
          tipo: "laptop",
        },
        {
          id: 8,
          modelo: "Google Pixel 6",
          marca: "Google",
          numeroSerie: "UVW345678",
          tipo: "celular",
        },
        {
          id: 9,
          modelo: "Huawei P40",
          marca: "Huawei",
          numeroSerie: "XYZ901234",
          tipo: "celular",
        },
      ],
      itemsPerPage: 8, // Mostrar 8 elementos por página
      currentPage: 1,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.items.slice(start, end);
    },
  },
  methods: {
    deleteDevice(item: any) {
      Swal.fire({
        title: "¿Estás seguro?",
        text: `Estás a punto de eliminar el dispositivo "${item.modelo}". Esta acción no se puede deshacer.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.items = this.items.filter((i) => i !== item);
          Swal.fire(
            "¡Eliminado!",
            `El dispositivo "${item.modelo}" ha sido eliminado.`,
            "success"
          );
        }
      });
    },
    getIcon(type: string | undefined) {
      if (!type) {
        return "material-symbols:device-unknown";
      }
      switch (type) {
        case "celular":
          return "material-symbols:smartphone";
        case "laptop":
          return "material-symbols:laptop-mac";
        case "smartwatch":
          return "material-symbols:watch";
        case "bocinas":
          return "material-symbols:speaker";
        case "consola de videojuegos":
          return "material-symbols:videogame-asset";
        default:
          return "material-symbols:device-unknown";
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
  },
});
</script>
