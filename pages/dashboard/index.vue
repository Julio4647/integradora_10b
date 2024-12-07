<template>
  <div>
    <NavHeader />

    <!-- Spinner de carga -->
    <div v-if="isLoading" class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-700"></div>
    </div>

    <!-- Contenido del dashboard -->
    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-3 mt-4 text-center">
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

      <!-- Tabla de técnicos y reparaciones -->
      <div class="mt-6 bg-white rounded-lg p-6">
        <h3 class="text-xl font-bold mb-4">Top 5 Técnicos con Más Reparaciones</h3>
        <table class="min-w-full table-auto border-collapse border shadow-lg border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-4 py-2">Técnico</th>
              <th class="border border-gray-300 px-4 py-2">Total Reparaciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="technician in topTechnicians" :key="technician.id">
              <td class="border border-gray-300 px-4 py-2">
                {{ technician.name }} {{ technician.lastname }}
              </td>
              <td class="border border-gray-300 px-4 py-2">
                {{ technician.totalRepairs }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
definePageMeta({
  middleware: "auth",
});
import { defineComponent, ref, computed, onMounted } from "vue";
import axios from "axios";
import NavHeader from "~/components/navigation/NavHeader.vue";
import { useRuntimeConfig } from "#app";

interface Technician {
  id: number;
  name: string;
  lastname: string;
  phone: string;
  email: string;
  totalRepairs?: number; // Agregamos esta propiedad para almacenar el total de reparaciones
}

export default defineComponent({
  components: {
    NavHeader,
  },
  setup() {
    const isLoading = ref(true);
    const totalClients = ref(0);
    const totalCollected = ref(0);
    const totalQuotation = ref(0);
    const technicians = ref<Technician[]>([]);
    const config = useRuntimeConfig();
    const ApiUrl = config.public.apiUrl;

    // Computed para obtener los 5 técnicos con más reparaciones
    const topTechnicians = computed(() =>
      [...technicians.value]
        .sort((a, b) => (b.totalRepairs || 0) - (a.totalRepairs || 0))
        .slice(0, 5)
    );

    // Obtener técnicos y sus reparaciones
    const fetchTechniciansAndRepairs = async () => {
      try {
        const technicianResponse = await axios.get(
          `${ApiUrl}/user/technicians`
        );
        const technicianData = technicianResponse.data.data || [];

        // Obtener reparaciones para cada técnico
        const techniciansWithRepairs = await Promise.all(
          technicianData.map(async (technician: any) => {
            const repairResponse = await axios.get(
              `${ApiUrl}/repair/technician/${technician.id}`
            );
            const repairs = repairResponse.data.data || [];
            return {
              ...technician,
              totalRepairs: repairs.length, // Total de reparaciones
            };
          })
        );

        technicians.value = techniciansWithRepairs;
      } catch (error) {
        console.error("Error al cargar técnicos y reparaciones:", error);
      }
    };

    const fetchDeviceCounts = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/repair/`);
        const repairs = response.data.data || [];

        totalCollected.value = repairs.filter(
          (repair: any) => repair.repairStatus.name === "COLLECTED"
        ).length;

        totalQuotation.value = repairs.filter(
          (repair: any) => repair.repairStatus.name === "QUOTATION"
        ).length;
      } catch (error) {
        console.error("Error al cargar los dispositivos:", error);
      }
    };

    const fetchClients = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/user/clients`);
        const clients = response.data.data || [];
        totalClients.value = clients.length;
      } catch (error) {
        console.error("Error al cargar los clientes:", error);
      }
    };

    const fetchAllData = async () => {
      isLoading.value = true;
      await Promise.all([
        fetchDeviceCounts(),
        fetchClients(),
        fetchTechniciansAndRepairs(),
      ]);
      isLoading.value = false;
    };

    onMounted(() => {
      fetchAllData();
    });

    return {
      isLoading,
      totalClients,
      totalCollected,
      totalQuotation,
      technicians,
      topTechnicians,
    };
  },
});
</script>
