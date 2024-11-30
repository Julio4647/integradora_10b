<template>
  <div
    v-if="isModalOpen"
    class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6">
      <div class="flex justify-between items-center border-b pb-4">
        <h2 class="text-2xl font-bold">Registrar Nuevo Equipo</h2>
        <button
          @click="$emit('close')"
          class="text-gray-600 hover:text-gray-800 transition"
        >
          ✕
        </button>
      </div>
      <div class="mt-4">
        <Form
          @submit="submitForm"
          v-slot="{ errors }"
          class="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <!-- Modelo -->
          <div>
            <label for="model" class="block text-md font-medium text-gray-700"
              >Modelo</label
            >
            <Field
              name="model"
              as="input"
              type="text"
              id="model"
              class="w-full px-10 py-2 border rounded pl-10"
              :class="{ 'border-red-500': errors.model }"
              placeholder="Ingrese el modelo"
              rules="required"
            />
            <ErrorMessage name="model" class="text-red-500 text-sm" />
          </div>

          <!-- Marca -->
          <div>
            <label for="brand" class="block text-md font-medium text-gray-700"
              >Marca</label
            >
            <Field
              name="brand"
              as="input"
              type="text"
              id="brand"
              class="w-full px-10 py-2 border rounded pl-10"
              :class="{ 'border-red-500': errors.brand }"
              placeholder="Ingrese la marca"
              rules="required"
            />
            <ErrorMessage name="brand" class="text-red-500 text-sm" />
          </div>

          <!-- Número de Serie -->
          <div>
            <label
              for="serial_number"
              class="block text-md font-medium text-gray-700"
              >Número de Serie</label
            >
            <Field
              name="serial_number"
              as="input"
              type="text"
              id="serial_number"
              class="w-full px-10 py-2 border rounded pl-10"
              :class="{ 'border-red-500': errors.serial_number }"
              placeholder="Ingrese el número de serie"
              rules="required"
            />
            <ErrorMessage name="serial_number" class="text-red-500 text-sm" />
          </div>

          <!-- Tipo de Dispositivo -->
          <div>
            <label
              for="device_type"
              class="block text-md font-medium text-gray-700"
              >Tipo de dispositivo</label
            >
            <Field
              name="device_type"
              as="select"
              id="device_type"
              class="w-full px-4 py-2 border rounded"
              :class="{ 'border-red-500': errors.device_type }"
              rules="required"
            >
              <option value="">Seleccione el tipo de dispositivo</option>
              <option value="1">LAPTOP</option>
              <option value="2">DESKTOP</option>
              <option value="3">TABLET</option>
              <option value="4">SMARTPHONE</option>
              <option value="5">SMARTWATCH</option>
              <option value="6">VIDEOGAME CONSOLE</option>
              <option value="7">SPEAKER</option>
            </Field>
            <ErrorMessage name="device_type" class="text-red-500 text-sm" />
          </div>

          <!-- Cliente -->
          <div>
            <label for="client" class="block text-md font-medium text-gray-700"
              >Cliente</label
            >
            <multiselect
              v-model="selectedClient"
              :options="clients"
              track-by="id"
              label="name"
              placeholder="Seleccione un Cliente"
              class="w-full"
            />
            <ErrorMessage name="client" class="text-red-500 text-sm" />
          </div>

          <!-- Técnico -->
          <div>
            <label
              for="technician"
              class="block text-md font-medium text-gray-700"
            >
              Técnico
            </label>
            <multiselect
              v-model="selectedTechnician"
              :options="technicians"
              track-by="id"
              label="name"
              placeholder="Seleccione un Técnico"
              class="w-full"
            />
            <ErrorMessage name="technician" class="text-red-500 text-sm" />
          </div>

          <!-- Comentarios -->
          <div>
            <label
              for="comments"
              class="block text-md font-medium text-gray-700"
            >
              Comentarios
            </label>
            <Field
              name="comments"
              as="textarea"
              id="comments"
              class="w-full px-4 py-2 border rounded"
              :class="{ 'border-red-500': errors.comments }"
              rules="required"
            ></Field>
            <ErrorMessage name="comments" class="text-red-500 text-sm" />
          </div>

          <div class="md:col-span-2 flex justify-end gap-4 mt-6">
            <button
              type="submit"
              class="focus:outline-none hover:scale-105 transition-all cursor-pointer hover:text-primary bg-blue-900 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
            >
              Registrar Equipo
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { Form, Field, ErrorMessage, defineRule } from "vee-validate";
import Multiselect from "vue-multiselect";
import axios from "axios";
import Swal from "sweetalert2";

interface Technician {
  id: number;
  name: string;
  lastname: string;
  phone: string;
  email: string;
}
interface Client {
  id: number;
  name: string;
  lastname: string;
  phone: string;
  email: string;
}

defineRule("required", (value: string) => {
  return value ? true : "Este campo es obligatorio";
});

export default defineComponent({
  name: "RegisterEquipmentFormModal",
  props: {
    isModalOpen: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    Form,
    Field,
    ErrorMessage,
    Multiselect,
  },
  setup(_, { emit }) {
    const ApiUrl = useRuntimeConfig().public.apiUrl;

    const clients = ref<Client[]>([]);
    const technicians = ref<Technician[]>([]);
    const selectedClient = ref<Client | null>(null);
    const selectedTechnician = ref<Technician | null>(null);

    const fetchTechnicians = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/user/technicians`);
        technicians.value = response.data.data;
      } catch (error) {
        console.error("Error al cargar técnicos:", error);
      }
    };

    const fetchClients = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/user/clients`);
        clients.value = response.data.data;
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      }
    };

    onMounted(() => {
      fetchTechnicians();
      fetchClients();
    });

    const submitForm = async (values: any) => {
      const devicePayload = {
        model: values.model,
        brand: values.brand,
        serialNumber: values.serial_number,
        deviceType: {
          id: Number(values.device_type),
        },
      };

      const repairPayload = {
        problem_description: values.comments,
        device: { id: "device_id_aqui" },
        client: { id: Number(selectedClient.value?.id) },
        technician: { id: Number(selectedTechnician.value?.id) },
      };

      try {
        const deviceResponse = await axios.post(
          `${ApiUrl}/device/`,
          devicePayload
        );

        if (deviceResponse.status === 201) {
          const createdDevice = deviceResponse.data;
          repairPayload.device.id = createdDevice.data.id;

          console.log(repairPayload)
          const repairResponse = await axios.post(
            `${ApiUrl}/repair/`,
            repairPayload,
            { responseType: "blob" }
          );

          if (repairResponse.status === 201) {
            const qrBlob = repairResponse.data;
            const qrUrl = URL.createObjectURL(qrBlob);

            const showQRModal = () => {
              Swal.fire({
                title: "¡QR Generado!",
                text: "Puedes descargar el QR o cerrarlo si ya no lo necesitas.",
                imageUrl: qrUrl,
                imageAlt: "Código QR generado",
                confirmButtonText: "Cerrar QR",
                showCancelButton: true,
                cancelButtonText: "Descargar QR",
              }).then((result) => {
                if (result.dismiss === Swal.DismissReason.cancel) {
                  // Descargar el QR
                  const link = document.createElement("a");
                  link.href = qrUrl;
                  link.download = "codigo-qr.png";
                  link.click();
                  emit("close");
                  emit("reload");
                } else if (result.isConfirmed) {
                  Swal.fire({
                    title: "¿Estás seguro de cerrar el QR?",
                    text: "Una vez cerrado, ya no estará visible.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Sí, cerrar",
                    cancelButtonText: "Cancelar",
                  }).then((confirmation) => {
                    if (confirmation.isConfirmed) {
                      // Cerrar QR y emitir eventos
                      emit("close");
                      emit("reload");
                    } else if (
                      confirmation.dismiss === Swal.DismissReason.cancel
                    ) {
                      // Volver a mostrar el modal del QR
                      showQRModal();
                    }
                  });
                }
              });
            };

            // Llamar a la función para mostrar el QR por primera vez
            showQRModal();
          }
        }
      } catch (error) {
        console.error("Error durante el registro del equipo:", error);
        Swal.fire(
          "Error",
          "Ocurrió un problema al registrar el equipo.",
          "error"
        );
      }
    };

    return {
      submitForm,
      clients,
      technicians,
      selectedClient,
      selectedTechnician,
    };
  },
});
</script>

<style scoped>
@import "vue-multiselect/dist/vue-multiselect.min.css";
</style>
