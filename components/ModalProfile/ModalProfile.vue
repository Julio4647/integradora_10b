<template>
    <div>
      <!-- Modal -->
      <div
        v-if="isModalOpen"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div
          class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative"
        >
          <!-- Botón de cierre -->
          <button
            @click="closeModal"
            class="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
          >
            &times;
          </button>
  
          <div v-if="isLoading" class="flex justify-center items-center h-full">
            <div
              class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"
            ></div>
          </div>
  
          <div v-else>
            <!-- Avatar and User Info -->
            <div
              class="profile-header flex flex-col items-center justify-center gap-4"
            >
              <!-- Avatar -->
              <div
                class="avatar w-26 h-26 rounded-full overflow-hidden border-4 border-blue-500"
              >
                <Icon icon="tdesign:user-filled" width="96" height="96" />
              </div>
              <!-- User Info -->
              <div class="user-info text-center">
                <h2 class="text-2xl font-bold">
                  {{ user.name }} {{ user.lastname }}
                </h2>
                <p class="text-gray-600">Teléfono: {{ user.phone }}</p>
                <p class="text-gray-600">Email: {{ user.email }}</p>
                <p class="text-gray-600">
                  Rol: {{ user.authorities[0]?.authority || "N/A" }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref } from "vue";
  import { Icon } from "@iconify/vue/dist/iconify.js";
  
  export default defineComponent({
    name: "ProfileModal",
    setup() {
      const isModalOpen = ref(false);
      const isLoading = ref(true); // Controla el estado de carga
      const user = ref({
        id: 0,
        name: "",
        lastname: "",
        email: "",
        phone: "",
        authorities: [],
      });
  
      const loginInfo = ref({
        token: "",
        expiresIn: 0,
      });
  
      const openModal = () => {
        isModalOpen.value = true;
      };
  
      const closeModal = () => {
        isModalOpen.value = false;
      };
  
      const formatTime = (milliseconds: number) => {
        const hours = Math.floor(milliseconds / 3600000);
        const minutes = Math.floor((milliseconds % 3600000) / 60000);
        return `${hours} horas y ${minutes} minutos`;
      };
  
      onMounted(() => {
        const storedUser = localStorage.getItem("user");
        const storedLoginInfo = localStorage.getItem("loginInfo");
  
        if (storedUser) user.value = JSON.parse(storedUser);
        if (storedLoginInfo) loginInfo.value = JSON.parse(storedLoginInfo);
  
        // Simulación de carga
        setTimeout(() => {
          isLoading.value = false;
        }, 1000);
      });
  
      return {
        isModalOpen,
        isLoading,
        user,
        loginInfo,
        openModal,
        closeModal,
        formatTime,
      };
    },
  });
  </script>
  
  <style scoped>
  .profile-page {
    max-width: 800px;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  </style>
  