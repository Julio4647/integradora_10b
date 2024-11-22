<template>
  <div class="flex flex-col min-h-screen">
    <NavHeader />
    <div
      class="flex flex-col sm:flex-row justify-between items-center my-4 px-4"
    >
      <button
        @click="goBack"
        class="focus:outline-none font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary mt-2 sm:mt-0 bg-blue-900 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
      >
        <Icon
          icon="material-symbols:arrow-circle-left-outline"
          width="24"
          height="24"
        />
      </button>
    </div>
    <div
      class="flex flex-col sm:flex-row justify-between items-center text-center my-4 px-4"
    >
      <h1 class="text-2xl sm:text-3xl font-bold">Registrar Nuevo Equipo</h1>
    </div>
    <div class="w-full h-full max-w-full flex flex-col p-3">
      <Form
        @submit="submitForm"
        v-slot="{ errors }"
        class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow"
      >
        <!-- Modelo -->
        <div>
          <label for="modelo" class="block text-md font-medium text-gray-700"
            >Modelo</label
          >
          <Field
            name="modelo"
            as="input"
            type="text"
            id="modelo"
            class="w-full px-10 py-2 border rounded pl-10"
            :class="{ 'border-red-500': errors.modelo }"
            placeholder="Ingrese el modelo"
            rules="required"
          />
          <ErrorMessage name="modelo" class="text-red-500 text-sm" />
        </div>
        <div>
          <label for="marca" class="block text-md font-medium text-gray-700"
            >Marca</label
          >
          <Field
            name="marca"
            as="input"
            type="text"
            id="marca"
            class="w-full px-10 py-2 border rounded pl-10"
            :class="{ 'border-red-500': errors.marca }"
            placeholder="Ingrese la marca"
            rules="required"
          />
          <ErrorMessage name="marca" class="text-red-500 text-sm" />
        </div>

        <!-- Número de Serie -->
        <div>
          <label
            for="numeroSerie"
            class="block text-md font-medium text-gray-700"
            >Número de Serie</label
          >
          <Field
            name="numeroSerie"
            as="input"
            type="text"
            id="numeroSerie"
            class="w-full px-10 py-2 border rounded pl-10"
            :class="{ 'border-red-500': errors.numeroSerie }"
            placeholder="Ingrese el número de serie"
            rules="required"
          />
          <ErrorMessage name="numeroSerie" class="text-red-500 text-sm" />
        </div>

        <!-- Descripción del Problema -->
        <div class="md:col-span-2">
          <label
            for="descripcion"
            class="block text-md font-medium text-gray-700"
            >Descripción del Problema</label
          >
          <Field
            name="descripcion"
            as="textarea"
            id="descripcion"
            class="w-full px-10 py-2 border rounded pl-10"
            :class="{ 'border-red-500': errors.descripcion }"
            placeholder="Describa el problema"
            rules="required"
          />
          <ErrorMessage name="descripcion" class="text-red-500 text-sm" />
        </div>

        <!-- Cliente Propietario -->
        <div>
          <label for="cliente" class="block text-md font-medium text-gray-700"
            >Cliente Propietario</label
          >
          <Field
            name="cliente"
            as="select"
            id="cliente"
            class="w-full px-10 py-2 border rounded pl-10"
            :class="{ 'border-red-500': errors.cliente }"
            rules="required"
          >
            <option value="" disabled selected>Seleccione un cliente</option>
            <option
              v-for="cliente in clientes"
              :key="cliente.id"
              :value="cliente.id"
            >
              {{ cliente.nombre }}
            </option>
          </Field>
          <ErrorMessage name="cliente" class="text-red-500 text-sm" />
        </div>

        <!-- Técnico a Cargo -->
        <div>
          <label for="tecnico" class="block text-dm font-medium text-gray-700"
            >Técnico a Cargo</label
          >
          <Field
            name="tecnico"
            as="select"
            id="tecnico"
            class="w-full px-10 py-2 border rounded pl-10"
            :class="{ 'border-red-500': errors.tecnico }"
            rules="required"
          >
            <option value="" disabled selected>Seleccione un técnico</option>
            <option
              v-for="tecnico in tecnicos"
              :key="tecnico.id"
              :value="tecnico.id"
            >
              {{ tecnico.nombre }}
            </option>
          </Field>
          <ErrorMessage name="tecnico" class="text-red-500 text-sm" />
        </div>

        <!-- Fecha de Ingreso -->
        <div class="md:col-span-2">
          <label
            for="fechaIngreso"
            class="block text-dm font-medium text-gray-700"
            >Fecha de Ingreso</label
          >
          <Field
            name="fechaIngreso"
            as="input"
            type="date"
            id="fechaIngreso"
            class="w-full px-10 py-2 border rounded pl-10"
            :class="{ 'border-red-500': errors.fechaIngreso }"
            rules="required"
          />
          <ErrorMessage name="fechaIngreso" class="text-red-500 text-sm" />
        </div>
        <!-- Otros campos del formulario... -->
        <!-- Botones de Enviar y Regresar -->
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
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import NavHeader from "~/components/navigation/NavHeader.vue";
import { Form, Field, ErrorMessage, defineRule } from "vee-validate";
import Swal from "sweetalert2";
import * as QRCode from "qrcode";

// Definición de reglas de validación globales
defineRule("required", (value: string) => {
  return value ? true : "Este campo es obligatorio";
});

export default defineComponent({
  name: "RegisterEquipmentForm",
  components: {
    NavHeader,
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const router = useRouter();

    const clientes = ref([
      { id: 1, nombre: "Cliente A" },
      { id: 2, nombre: "Cliente B" },
    ]);

    const tecnicos = ref([
      { id: 1, nombre: "Técnico A" },
      { id: 2, nombre: "Técnico B" },
    ]);

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

    const goBack = () => {
      router.push("/dashboard/devices"); // Redirige a la página de administración
    };

    return {
      submitForm,
      goBack,
      clientes,
      tecnicos,
    };
  },
});
</script>

<style scoped>
/* Puedes agregar estilos adicionales si es necesario */
</style>
