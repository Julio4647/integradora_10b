<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-5xl p-6">
      <!-- Cabecera del modal -->
      <div class="flex justify-between items-center border-b pb-4">
        <h2 class="text-xl font-bold">Detalles de Reparación</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <!-- Cuerpo del modal -->
      <div v-if="isLoading" class="flex justify-center items-center h-32">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"
        ></div>
      </div>
      <div v-else>
        <div
          v-if="repairDetails"
          class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4"
        >
          <div>
            <p><strong>Descripción del Problema:</strong></p>
            <p>{{ repairDetails.problem_description }}</p>
          </div>
          <div>
            <p><strong>Fecha de Ingreso:</strong></p>
            <p>{{ formatDate(repairDetails.entry_date) }}</p>
          </div>
          <div>
            <p><strong>Modelo:</strong></p>
            <p>{{ repairDetails.device.model }}</p>
          </div>
          <div>
            <p><strong>Marca:</strong></p>
            <p>{{ repairDetails.device.brand }}</p>
          </div>
          <div>
            <p><strong>Tipo de Dispositivo:</strong></p>
            <p>
              {{ translateDeviceType(repairDetails.device.deviceType.name) }}
            </p>
          </div>
          <div>
            <p><strong>Costo Estimado:</strong></p>
            <p>${{ repairDetails.diagnostic_estimated_cost.toFixed(2) }}</p>
          </div>
          <div>
            <p><strong>Precio Total:</strong></p>
            <p>${{ repairDetails.total_price.toFixed(2) }}</p>
          </div>
          <div>
            <p><strong>Tecnico:</strong></p>
            <p>
              {{ repairDetails.technician.name }}
              {{ repairDetails.technician.lastname }}
            </p>
          </div>
          <div>
            <p><strong>Cliente:</strong></p>
            <p>
              {{ repairDetails.client.name }}
              {{ repairDetails.client.lastname }}
            </p>
          </div>
          <div class="">
            <p><strong>Estado:</strong></p>
            <span
              :class="getStatusStyle(repairDetails.repairStatus.name)"
              class="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full"
            >
              <span
                :class="getStatusDotStyle(repairDetails.repairStatus.name)"
                class="w-2 h-2 me-1 rounded-full"
              ></span>
              {{ translateStatus(repairDetails.repairStatus.name) }}
            </span>
          </div>
          <div>
            <p><strong>Observacion Reparacion:</strong></p>
            <p>
              {{ repairDetails.repair_observations }}
            </p>
          </div>
          <div>
            <p><strong>Observacion diagnostico:</strong></p>
            <p>
              {{ repairDetails.diagnostic_observations }}
            </p>
          </div>

          <!-- Mostrar imágenes de diagnóstico -->
          <div
            v-if="
              repairDetails.diagnosticImage &&
              repairDetails.diagnosticImage.length > 0
            "
            class="col-span-2"
          >
            <p><strong>Imágenes de Diagnóstico:</strong></p>
            <div class="flex gap-4 flex-wrap">
              <img
                v-for="image in repairDetails.diagnosticImage"
                :key="image.id"
                :src="`${baseDiagnosisUrl}/${image.name}`"
                alt="Imagen de Diagnóstico"
                class="w-32 h-32 object-cover rounded-md border"
              />
            </div>
          </div>

          <!-- Mostrar imágenes de reparación -->
          <div
            v-if="
              repairDetails.repairImage && repairDetails.repairImage.length > 0
            "
            class="col-span-2"
          >
            <p><strong>Imágenes de Reparación:</strong></p>
            <div class="flex gap-4 flex-wrap">
              <img
                v-for="image in repairDetails.repairImage"
                :key="image.id"
                :src="`${baseRepairUrl}/${image.name}`"
                alt="Imagen de Reparación"
                class="w-32 h-32 object-cover rounded-md border"
              />
            </div>
          </div>
        </div>

        <div v-else>
          <p class="text-red-500">No se pudo cargar la información.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import axios from "axios";

interface RepairDetails {
  id: number;
  problem_description: string;
  entry_date: string;
  diagnostic_observations: string | null;
  diagnostic_parts: string | null;
  diagnostic_estimated_cost: number;
  total_price: number;
  repair_observations: string | null;
  repair_start: string | null;
  repair_end: string | null;
  paid: boolean;
  repairStatus: {
    id: number;
    name: string;
  };
  device: {
    id: number;
    model: string;
    brand: string;
    serialNumber: string;
    deviceType: {
      id: number;
      name: string;
    };
  };
  diagnosticImage: { id: number; name: string }[];
  repairImage: { id: number; name: string }[];
  client: {
    id: number;
    name: string;
    lastname: string;
    phone: string;
    email: string;
    new_user: boolean;
    active: boolean;
    userType: {
      id: number;
      name: string;
    };
    username: string;
  };
  technician: {
    id: number;
    name: string;
    lastname: string;
    phone: string;
    email: string;
    new_user: boolean;
    active: boolean;
    userType: {
      id: number;
      name: string;
    };
    username: string;
  };
}

export default defineComponent({
  name: "RepairDetailsModal",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    repairId: {
      type: [Number, null],
      required: false,
    },
  },
  emits: ["close"],
  setup(props, { emit }) {
    const isLoading = ref(false);
    const repairDetails = ref<RepairDetails | null>(null);
    const config = useRuntimeConfig();
    const ApiUrl = config.public.apiUrl;
    const baseDiagnosisUrl = `${ApiUrl}/images/diagnosis`;
    const baseRepairUrl = `${ApiUrl}/images/repair`;

    const fetchRepairDetails = async () => {
      try {
        isLoading.value = true;

        const response = await axios.get(`${ApiUrl}/repair/${props.repairId}`);
        repairDetails.value = response.data.data as RepairDetails;
      } catch (error) {
        console.error("Error al cargar detalles de reparación:", error);
      } finally {
        isLoading.value = false;
      }
    };

    const statusTranslations: Record<string, string> = {
      RECEIVED: "Recibido",
      QUOTATION: "Cotización",
      WAITING_FOR_PARTS: "Esperando piezas",
      REPAIRING: "En reparación",
      READY_FOR_COLLECTION: "Listo para entrega",
      COLLECTED: "Entregado",
      WAITING_FOR_CUSTOMER_APPROVAL: "Esperando aprobación del cliente",
    };

    // Mapa de traducción de tipos de dispositivos
    const deviceTypeTranslations: Record<string, string> = {
      LAPTOP: "Portátil",
      SMARTPHONE: "Teléfono inteligente",
      TABLET: "Tableta",
      DESKTOP: "Computadora de escritorio",
      VIDEOGAME_CONSOLE: "Consola de videojuegos",
    };

    const translateStatus = (status: string): string =>
      statusTranslations[status] || status;

    // Función para traducir tipos de dispositivos
    const translateDeviceType = (deviceType: string): string =>
      deviceTypeTranslations[deviceType] || deviceType;

    const getStatusStyle = (status: string) => {
      const styles: Record<string, string> = {
        RECEIVED: "bg-blue-500 text-white dark:bg-blue-700 dark:text-white",
        QUOTATION: "bg-gray-500 text-white dark:bg-gray-700 dark:text-white",
        WAITING_FOR_PARTS:
          "bg-purple-500 text-white dark:bg-purple-700 dark:text-white",
        REPAIRING: "bg-green-500 text-white dark:bg-green-700 dark:text-white",
        READY_FOR_COLLECTION:
          "bg-teal-500 text-white dark:bg-teal-700 dark:text-white",
        COLLECTED: "bg-pink-500 text-white dark:bg-pink-700 dark:text-white",
        WAITING_FOR_CUSTOMER_APPROVAL:
          "bg-orange-500 text-white dark:bg-orange-700 dark:text-white",
      };
      return styles[status] || "bg-red-500 text-white";
    };

    const getStatusDotStyle = (status: string) => {
      const dotStyles: Record<string, string> = {
        RECEIVED: "bg-blue-700",
        QUOTATION: "bg-gray-700",
        WAITING_FOR_PARTS: "bg-purple-700",
        REPAIRING: "bg-green-700",
        READY_FOR_COLLECTION: "bg-teal-700",
        COLLECTED: "bg-pink-700",
        WAITING_FOR_CUSTOMER_APPROVAL: "bg-orange-700",
      };
      return dotStyles[status] || "bg-red-700";
    };

    watch(
      () => props.repairId,
      (newValue) => {
        if (newValue) {
          fetchRepairDetails();
        }
      }
    );

    const closeModal = () => {
      emit("close");
    };

    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return date.toLocaleDateString("es-ES", options);
    };

    return {
      isLoading,
      repairDetails,
      closeModal,
      formatDate,
      translateStatus,
      translateDeviceType,
      getStatusStyle,
      getStatusDotStyle,
      baseDiagnosisUrl,
      baseRepairUrl,
    };
  },
});
</script>
