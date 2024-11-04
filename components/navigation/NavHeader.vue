<template>
    <div>
      <!-- Navbar -->
      <nav class="bg-white h-16 flex items-center justify-between px-4 shadow-md">
        <!-- Logo -->
        <div class="text-white text-xl font-bold">
          <img src="" alt="Logo" class="h-10 inline-block mr-2" />
        </div>
  
        <!-- Menú hamburguesa para pantallas pequeñas -->
        <div class="md:hidden">
          <button @click="toggleMobileMenu" class="focus:outline-none font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary">
            <!-- Icono de menú hamburguesa -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
  
        <!-- Enlaces de navegación centrados para pantallas medianas en adelante -->
        <div class="absolute left-1/2 transform -translate-x-1/2 hidden md:flex space-x-4">
          <a href="/dashboard" class="font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary">Inicio</a>
          <a href="/dashboard/devices" class="font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary">Dispositivos</a>
  
          <!-- Enlace de "Usuarios" con desglose -->
          <div class="relative">
            <button @click="toggleDropdownUsuarios" class="focus:outline-none flex font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary">
              Usuarios
              <!-- Icono para indicar el dropdown -->
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" stroke="currentColor" class="h-5 w-5 ml-1">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
  
            <!-- Dropdown para "Usuarios" -->
            <div v-if="dropdownUsuariosOpen" class="absolute mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20">
              <a href="/dashboard/admins" class="block px-4 py-2 font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary hover:bg-gray-200">Administradores</a>
              <a href="/dashboard/technicians" class="block px-4 py-2 font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary hover:bg-gray-200">Técnicos</a>
              <a href="/dashboard/clients" class="block px-4 py-2 font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary hover:bg-gray-200">Clientes</a>
            </div>
          </div>
        </div>
  
        <!-- Icono de perfil con menú desplegable en pantallas grandes -->
        <div class="relative hidden md:block">
          <button @click="toggleDropdown" class="focus:outline-none font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary">
            <!-- Icono de perfil -->
            <Icon icon="uil:user" width="26" height="26"/>
          </button>
  
          <!-- Menú desplegable para el icono de perfil -->
          <div v-if="dropdownOpen" @click.outside="closeDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20">
            <a href="#" class="block px-4 py-2 font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary hover:bg-gray-200">Perfil</a>
            <a href="#" class="block px-4 py-2 font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary hover:bg-gray-200">Cerrar Sesión</a>
          </div>
        </div>
      </nav>
  
      <!-- Menú hamburguesa desplegable para pantallas pequeñas -->
      <div v-if="mobileMenuOpen" class="md:hidden bg-white text-gray-800 space-y-2 p-4">
        <a href="/dashboard" class="block font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary hover:text-gray-900">Inicio</a>
        <a href="/dashboard/devices" class="block font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary hover:text-gray-900">Dispositivos</a>
  
        <!-- Enlace de "Usuarios" con desglose en menú hamburguesa -->
        <div class="relative">
          <button @click="toggleDropdownUsuarios" class="focus:outline-none font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary flex items-center w-full text-left">
            Usuarios
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-5 w-5 ml-1">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
  
          <!-- Dropdown para "Usuarios" en menú hamburguesa -->
          <div v-if="dropdownUsuariosOpen" class="mt-2 space-y-1">
            <a href="/dashboard/admins" class="block px-4 py-2 font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary hover:bg-gray-700 rounded">Administradores</a>
            <a href="/dashboard/technicians" class="block px-4 py-2 font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary hover:bg-gray-700 rounded">Técnicos</a>
            <a href="/dashboard/clients" class="block px-4 py-2 font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary hover:bg-gray-700 rounded">Clientes</a>
          </div>
        </div>
  
        <!-- Opciones de perfil y cerrar sesión en el menú hamburguesa -->
        <div class="mt-4 border-t border-gray-600 pt-2">
          <a href="#" class="block px-4 py-2 font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary hover:bg-gray-700 rounded">Perfil</a>
          <a href="#" class="block px-4 py-2 font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary hover:bg-gray-700 rounded">Cerrar Sesión</a>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from "vue";
  import { Icon } from "@iconify/vue/dist/iconify.js";
  
  export default defineComponent({
    name: "NavHeader",
    setup() {
      const dropdownUsuariosOpen = ref(false);
      const dropdownOpen = ref(false);
      const mobileMenuOpen = ref(false);
  
      const toggleDropdownUsuarios = () => {
        dropdownUsuariosOpen.value = !dropdownUsuariosOpen.value;
      };
  
      const toggleDropdown = () => {
        dropdownOpen.value = !dropdownOpen.value;
      };
  
      const closeDropdown = () => {
        dropdownOpen.value = false;
        dropdownUsuariosOpen.value = false;
      };
  
      const toggleMobileMenu = () => {
        mobileMenuOpen.value = !mobileMenuOpen.value;
      };
  
      return {
        dropdownUsuariosOpen,
        dropdownOpen,
        mobileMenuOpen,
        toggleDropdownUsuarios,
        toggleDropdown,
        closeDropdown,
        toggleMobileMenu,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Estilos adicionales */
  </style>
  