<template>
  <div class="flex flex-col min-h-screen">
    <NavHeader />
    <div
      class="flex flex-col sm:flex-row justify-between items-center my-4 px-4"
    >
      <h1 class="text-2xl sm:text-3xl font-bold">Lista de Clientes</h1>
      <button
        @click="registerClient"
        class="focus:outline-none font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary mt-2 sm:mt-0 bg-blue-900 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
      >
        Registrar Nuevo Cliente
      </button>
    </div>

    <div class="grid grid-cols-1 gap-4 p-3 mt-4">
      <div
        v-for="client in paginatedClients"
        :key="client.id"
        class="p-6 border border-gray-300 rounded-lg w-full max-w mx-auto bg-white shadow-lg text-center"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <div class="flex flex-col">
            <h1 class="font-semibold text-gray-700">Nombre</h1>
            <p class="text-gray-600">{{ client.nombre }}</p>
          </div>
          <div class="flex flex-col">
            <h1 class="font-semibold text-gray-700">Fecha Nacimiento</h1>
            <p class="text-gray-600">{{ client.fechaNacimiento }}</p>
          </div>
          <div class="flex flex-col">
            <h1 class="font-semibold text-gray-700">Teléfono</h1>
            <p class="text-gray-600">{{ client.telefono }}</p>
          </div>
          <div class="flex flex-col">
            <h1 class="font-semibold text-gray-700">Email</h1>
            <p class="text-gray-600">{{ client.email }}</p>
          </div>
          <div class="flex gap-4 justify-center items-center">
            <button
              class="rounded-full bg-yellow-500 shadow-lg hover:bg-yellow-300 p-4 flex items-center justify-center"
            >
              <Icon
                icon="material-symbols:box-edit-outline"
                class="w-5 h-5 text-white"
              />
            </button>
            <button
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
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import NavHeader from "~/components/navigation/NavHeader.vue";
import { Icon } from "@iconify/vue/dist/iconify.js";

export default defineComponent({
  components: {
    NavHeader,
  },
  methods: {
    registerClient() {
      this.$router.push("/dashboard/clients/register");
    },
  },
  name: "TechnicianList",
  setup() {
    const clients = ref([
      {
        id: 1,
        nombre: "Julio Villalobos",
        fechaNacimiento: "03-12-03",
        telefono: "7774267336",
        email: "julio@gmail.com",
      },
      {
        id: 2,
        nombre: "Ana García",
        fechaNacimiento: "15-08-90",
        telefono: "5551234567",
        email: "ana@gmail.com",
      },
      {
        id: 3,
        nombre: "Carlos Mendoza",
        fechaNacimiento: "22-04-85",
        telefono: "1234567890",
        email: "carlos@gmail.com",
      },
      {
        id: 4,
        nombre: "María López",
        fechaNacimiento: "05-11-92",
        telefono: "9876543210",
        email: "maria@gmail.com",
      },
      {
        id: 5,
        nombre: "Pedro Sánchez",
        fechaNacimiento: "01-02-80",
        telefono: "1112223333",
        email: "pedro@gmail.com",
      },
      {
        id: 6,
        nombre: "Luis Torres",
        fechaNacimiento: "10-03-70",
        telefono: "4445556666",
        email: "luis@gmail.com",
      },
      {
        id: 7,
        nombre: "Sandra Flores",
        fechaNacimiento: "14-05-88",
        telefono: "7778889999",
        email: "sandra@gmail.com",
      },
      {
        id: 8,
        nombre: "Raúl Martínez",
        fechaNacimiento: "21-07-81",
        telefono: "2223334444",
        email: "raul@gmail.com",
      },
      {
        id: 9,
        nombre: "Lucía Fernández",
        fechaNacimiento: "09-09-93",
        telefono: "8889990000",
        email: "lucia@gmail.com",
      },
      {
        id: 10,
        nombre: "Javier Gómez",
        fechaNacimiento: "30-10-75",
        telefono: "5554443332",
        email: "javier@gmail.com",
      },
    ]);

    const itemsPerPage = 4;
    const currentPage = ref(1);

    // Calcular el número total de páginas
    const totalPages = computed(() =>
      Math.ceil(clients.value.length / itemsPerPage)
    );

    // Obtener los administradores que se mostrarán en la página actual
    const paginatedClients = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return clients.value.slice(start, end);
    });

    // Función para ir a la página anterior
    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    // Función para ir a la página siguiente
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    return {
      clients,
      currentPage,
      totalPages,
      paginatedClients,
      prevPage,
      nextPage,
    };
  },
});
</script>

<style scoped>
/* Estilos específicos para esta página */
</style>
