<template>
    <NavHeader />
    <div class="profile-page container mx-auto p-6">
      <!-- Avatar and User Info -->
      <div class="profile-header flex flex-col md:flex-row items-center justify-center md:justify-start md:gap-8">
        <!-- Avatar -->
        <div class="avatar w-48 h-48 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-blue-500">
            <Icon icon="tdesign:user-filled" width="192" height="192" />
        </div>
        <!-- User Info -->
        <div class="user-info text-center md:text-left mt-6 md:mt-0">
          <h2 class="text-2xl font-bold">Nombre del Usuario</h2>
          <p class="text-gray-600">email@ejemplo.com</p>
          <p class="text-gray-600">Ubicación: Ciudad, País</p>
          <p class="text-gray-600">Miembro desde: Enero 2020</p>
          <button class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all">
            Editar Perfil
          </button>
        </div>
      </div>
  
      <!-- User Details Section -->
      <div class="profile-details mt-8 md:mt-12">
        <h3 class="text-xl font-semibold mb-4 border-b pb-2">Información de Usuario</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- User Data Fields -->
          <div>
            <h4 class="font-medium text-gray-700">Teléfono:</h4>
            <p class="text-gray-600">+34 600 000 000</p>
          </div>
          <div>
            <h4 class="font-medium text-gray-700">Dirección:</h4>
            <p class="text-gray-600">Calle Ejemplo, 123, Ciudad</p>
          </div>
          <div>
            <h4 class="font-medium text-gray-700">Fecha de Nacimiento:</h4>
            <p class="text-gray-600">15 de Mayo, 1990</p>
          </div>
          <div>
            <h4 class="font-medium text-gray-700">Ocupación:</h4>
            <p class="text-gray-600">Desarrollador de Software</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  import NavHeader from "~/components/navigation/NavHeader.vue";
  import { Icon } from "@iconify/vue/dist/iconify.js";

  export default defineComponent({
    
    components: {
      NavHeader,
    },
    methods: {
      
    },
    setup() {
      
    },
  });
  </script>
  
  <style scoped>
  .profile-page {
    max-width: 800px;
  }
  </style>
  