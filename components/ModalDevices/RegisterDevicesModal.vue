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
            <span class="material-icons">X</span>
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
              <label
                for="model"
                class="block text-md font-medium text-gray-700"
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
            <div>
              <label
                for="device_type"
                class="block text-md font-medium text-gray-700"
                >Tipo de dispositivo</label
              >
              <Field
                name="device_type"
                as="input"
                type="text"
                id="device_type"
                class="w-full px-10 py-2 border rounded pl-10"
                :class="{ 'border-red-500': errors.device_type }"
                placeholder="Ingrese el número de serie"
                rules="required"
              />
              <ErrorMessage name="device_type" class="text-red-500 text-sm" />
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
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { Form, Field, ErrorMessage, defineRule } from "vee-validate";
import Swal from "sweetalert2";
import * as QRCode from "qrcode";

// Definición de reglas de validación globales
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
  },
  setup(_, { emit }) {
    const router = useRouter();

    const submitForm = async (values: any) => {
      console.log("Formulario enviado", values);

      // Simulación de generación de ID único y nombre del equipo
      const productoId = "123456"; // ID único generado o recibido de la base de datos
      const productoNombre = values.modelo;

      // Genera el código QR con el ID y nombre del producto
      const qrData = `ID: ${productoId}, Nombre: ${productoNombre}`;
      const qrCodeUrl = await QRCode.toDataURL(qrData);

      // Función para mostrar el SweetAlert con el código QR
      const showQRCodeAlert = async () => {
        const result = await Swal.fire({
          title: "Equipo Registrado Exitosamente",
          html: `
        <div style="display: flex; flex-direction: column; align-items: center;">
          <p>Escanea el código QR para ver los detalles:</p>
          <img src="${qrCodeUrl}" alt="Código QR" style="width: 150px; height: 150px; margin-top: 10px;" />
          <a href="${qrCodeUrl}" download="codigo-qr.png" style="margin-top: 15px;">
            <button class="swal2-confirm swal2-styled" style="background-color: #3085d6; color: white;">
              Descargar QR
            </button>
          </a>
        </div>
      `,
          icon: "success",
          confirmButtonText: "Aceptar",
        });

        if (result.isConfirmed) {
          const closeConfirmation = await Swal.fire({
            title: "¿Estás seguro de cerrar el código QR?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, cerrar",
            cancelButtonText: "Cancelar",
          });

          if (closeConfirmation.isConfirmed) {
            // Redirigir al usuario a la página de devices
            Swal.fire({
              title: "Código QR cerrado",
              icon: "info",
              confirmButtonText: "Aceptar",
            }).then(() => {
                emit("close");
              router.push("/dashboard/devices");
            });
          } else {
            // Si el usuario cancela, volvemos a mostrar el QR
            showQRCodeAlert();
          }
        }
      };

      // Muestra el SweetAlert inicial con el QR
      showQRCodeAlert();
    };

    return {
      submitForm,
    };
  },
});
</script>

<style scoped>
/* Puedes agregar estilos adicionales si es necesario */
</style>
