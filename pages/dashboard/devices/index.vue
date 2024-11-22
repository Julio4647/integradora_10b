<template>
  <NavHeader />
  <div class="flex flex-col sm:flex-row justify-between items-center my-4 px-4">
    <h1 class="text-2xl sm:text-3xl font-bold">Lista de Dispositivos</h1>
    <button
      @click="registerDevices"
      class="focus:outline-none hover:scale-105 transition-all cursor-pointer hover:text-primary  mt-2 sm:mt-0 bg-blue-900 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
    >
      Registrar Nuevo Dispositivo
    </button>
  </div>

  <!-- Grid de dispositivos -->
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-3 gap-3 mt-4"
  >
    <div
      v-for="(item, index) in paginatedItems"
      :key="index"
      class="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-sm"
    >
      <!-- Icono basado en el tipo de modelo -->
      <div class="flex items-center justify-center mb-4">
        <Icon :icon="getIcon(item.tipo)" class="w-12 h-12 text-gray-500" />
      </div>

      <!-- Información del Activo -->
      <div>
        <h3 class="text-lg sm:text-xl font-bold">{{ item.modelo }}</h3>
        <p class="text-sm sm:text-base text-gray-600 mt-1">
          <strong>Marca:</strong>
        </p>
        <p class="text-sm sm:text-base text-gray-600 mt-1">
          {{ item.marca }}
        </p>
        <p class="text-sm sm:text-base text-gray-600 mt-1">
          <strong>Número de serie:</strong>
        </p>
        <p class="text-sm sm:text-base text-gray-600 mt-1">
          {{ item.numeroSerie }}
        </p>
        <p class="text-sm sm:text-base text-gray-600 mt-1">
          <strong>Descripción del problema:</strong>
        </p>
        <p class="text-sm sm:text-base text-gray-600 mt-1">
          {{ item.descripcionProblema }}
        </p>
        <p class="text-sm sm:text-base text-gray-600 mt-1">
          <strong>Cliente propietario:</strong>
        </p>
        <p class="text-sm sm:text-base text-gray-600 mt-1">
          {{ item.clientePropietario }}
        </p>
        <p class="text-sm sm:text-base text-gray-600 mt-1">
          <strong>Técnico a cargo:</strong>
        </p>
        <p class="text-sm sm:text-base text-gray-600 mt-1">
          {{ item.tecnicoACargo }}
        </p>
        <p class="text-sm sm:text-base text-gray-600 mt-1">
          <strong>Fecha de ingreso:</strong>
        </p>
        <p class="text-sm sm:text-base text-gray-600 mt-1">
          {{ item.fechaIngreso }}
        </p>
      </div>

      <!-- Botones de Editar y Eliminar -->
      <div class="mt-4 flex justify-between">
        <button
          @click="editDevice(item)"
          class="rounded-full bg-yellow-500 shadow-lg hover:bg-yellow-300 p-4 flex items-center justify-center"
        >
          <Icon
            icon="material-symbols:box-edit-outline"
            class="w-5 h-5 text-white"
          />
        </button>
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

  <!-- Paginador -->
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
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Icon } from "@iconify/vue/dist/iconify.js";
import NavHeader from "~/components/navigation/NavHeader.vue";
import Swal from "sweetalert2";


export default defineComponent({
  name: "devicesList",
  components: {
    NavHeader,
  },
  data() {
    return {
      items: [
        {
          id: 1,
          modelo: "iPhone 13",
          marca: "Apple",
          numeroSerie: "ABC123456",
          descripcionProblema: "Pantalla rota",
          clientePropietario: "Juan Pérez",
          tecnicoACargo: "Técnico 1",
          fechaIngreso: "2024-10-01",
          tipo: "celular",
        },
        {
          id: 2,
          modelo: "MacBook Pro",
          marca: "Apple",
          numeroSerie: "DEF789012",
          descripcionProblema: "Problemas de batería",
          clientePropietario: "Ana López",
          tecnicoACargo: "Técnico 2",
          fechaIngreso: "2024-09-28",
          tipo: "laptop",
        },
        {
          id: 3,
          modelo: "Galaxy Watch 4",
          marca: "Samsung",
          numeroSerie: "GHI345678",
          descripcionProblema: "No enciende",
          clientePropietario: "Carlos García",
          tecnicoACargo: "Técnico 3",
          fechaIngreso: "2024-09-20",
          tipo: "smartwatch",
        },
        {
          id: 4,
          modelo: "JBL Flip 5",
          marca: "JBL",
          numeroSerie: "JKL901234",
          descripcionProblema: "Sonido distorsionado",
          clientePropietario: "Lucía Martínez",
          tecnicoACargo: "Técnico 1",
          fechaIngreso: "2024-10-05",
          tipo: "bocinas",
        },
        {
          id: 5,
          modelo: "PlayStation 5",
          marca: "Sony",
          numeroSerie: "MNO567890",
          descripcionProblema: "Problemas de sobrecalentamiento",
          clientePropietario: "Pedro Hernández",
          tecnicoACargo: "Técnico 4",
          fechaIngreso: "2024-10-07",
          tipo: "consola de videojuegos",
        },
        {
          id: 6,
          modelo: "Switch OLED",
          marca: "Nintendo",
          numeroSerie: "OPQ123456",
          descripcionProblema: "Error en los Joy-Con",
          clientePropietario: "Sofía Ortega",
          tecnicoACargo: "Técnico 5",
          fechaIngreso: "2024-10-10",
          tipo: "consola de videojuegos",
        },
        {
          id: 7,
          modelo: "Surface Pro 7",
          marca: "Microsoft",
          numeroSerie: "RST789012",
          descripcionProblema: "Pantalla congelada",
          clientePropietario: "Mario Fuentes",
          tecnicoACargo: "Técnico 6",
          fechaIngreso: "2024-10-12",
          tipo: "laptop",
        },
        {
          id: 8,
          modelo: "Google Pixel 6",
          marca: "Google",
          numeroSerie: "UVW345678",
          descripcionProblema: "Problemas de carga",
          clientePropietario: "Carla Nuñez",
          tecnicoACargo: "Técnico 3",
          fechaIngreso: "2024-10-15",
          tipo: "celular",
        },
        {
          id: 9,
          modelo: "Huawei P40",
          marca: "Huawei",
          numeroSerie: "XYZ901234",
          descripcionProblema: "Sin señal",
          clientePropietario: "Luis Santos",
          tecnicoACargo: "Técnico 2",
          fechaIngreso: "2024-10-18",
          tipo: "celular",
        },
      ],
      itemsPerPage: 4,
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
    registerDevices() {
      this.$router.push("devices/register");
    },
    editDevice(item: any) {
      console.log("Editar dispositivo:", item);
      this.$router.push("devices/[id]");
    },
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

<style scoped>
.w-12 {
  width: 3rem;
  height: 3rem;
}
</style>
