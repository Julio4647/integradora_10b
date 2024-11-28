<template>
  <div>
    <NavHeader />

    <!-- Spinner de carga -->
    <div v-if="isLoading" class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-700"></div>
    </div>

    <!-- Contenido del dashboard -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-3 mt-4 text-center">
      <!-- Card 3: Clientes Registrados -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="mt-4">
          <h3 class="text-xl font-bold">Clientes Registrados</h3>
          <p class="text-gray-600 mt-2">{{ totalClients }}</p>
        </div>
      </div>

      <!-- Card 4: Equipos Entregados -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="mt-4">
          <h3 class="text-xl font-bold">Equipos Entregados</h3>
          <p class="text-gray-600 mt-2">{{ totalCollected }}</p>
        </div>
      </div>

      <!-- Card 5: Equipos en Cotización -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="mt-4">
          <h3 class="text-xl font-bold">Equipos en Cotización</h3>
          <p class="text-gray-600 mt-2">{{ totalQuotation }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";
import NavHeader from "~/components/navigation/NavHeader.vue";
import { useRuntimeConfig } from "#app";

export default defineComponent({
  components: {
    NavHeader,
  },
  setup() {
    const isLoading = ref(true); // Indicador de carga
    const totalClients = ref(0); // Contador de clientes registrados
    const totalCollected = ref(0); // Contador de dispositivos entregados
    const totalQuotation = ref(0); // Contador de dispositivos en cotización
    const config = useRuntimeConfig();
    const ApiUrl = config.public.apiUrl;

    // Consulta para dispositivos
    const fetchDeviceCounts = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/repair/`);
        const repairs = response.data.data || [];

        // Contar los dispositivos con estatus COLLECTED
        totalCollected.value = repairs.filter(
          (repair: any) => repair.repairStatus.name === "COLLECTED"
        ).length;

        // Contar los dispositivos con estatus QUOTATION
        totalQuotation.value = repairs.filter(
          (repair: any) => repair.repairStatus.name === "QUOTATION"
        ).length;
      } catch (error) {
        console.error("Error al cargar los dispositivos:", error);
      }
    };

    // Consulta para clientes
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/user/clients`);
        const clients = response.data.data || [];
        totalClients.value = clients.length; // Total de clientes registrados
      } catch (error) {
        console.error("Error al cargar los clientes:", error);
      }
    };

    const fetchAllData = async () => {
      isLoading.value = true;
      await Promise.all([fetchDeviceCounts(), fetchClients()]);
      isLoading.value = false; // Datos cargados, ocultar el spinner
    };

    onMounted(() => {
      fetchAllData(); // Realiza ambas consultas al montar el componente
    });

    return {
      isLoading,
      totalClients,
      totalCollected,
      totalQuotation,
    };
  },
});
</script>

<style scoped>
</style>
