<template>
  <div>
    <NavHeader />
    <div v-if="isLoading" class="flex justify-center items-center h-screen">
      <div
        class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"
      ></div>
    </div>
    <div v-else class="profile-page container mx-auto p-6">
      <!-- Avatar and User Info -->
      <div class="profile-header flex flex-col md:flex-row items-center justify-center md:justify-start md:gap-24">
        <!-- Avatar -->
        <div class="avatar w-48 h-48 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-blue-500">
          <Icon icon="tdesign:user-filled" width="192" height="192" />
        </div>
        <!-- User Info -->
        <div class="user-info text-center md:text-left mt-6 md:mt-0">
          <h2 class="text-2xl font-bold">{{ user.name }} {{ user.lastname }}</h2>
          <p class="text-gray-600">{{ user.phone }}</p>
          <p class="text-gray-600">Teléfono: {{ user.email }}</p>
          <p class="text-gray-600">Rol: {{ user.authorities[0]?.authority || 'N/A' }}</p>
        </div>
      </div>
  
      <!-- User Details Section -->
      <div class="profile-details mt-8 md:mt-12">
        <h3 class="text-xl font-semibold mb-4 border-b pb-2">Información Adicional</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-medium text-gray-700">La sesión expira en:</h4>
            <p class="text-gray-600">{{ formatTime(loginInfo.expiresIn) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import NavHeader from "~/components/navigation/NavHeader.vue";
import { Icon } from "@iconify/vue/dist/iconify.js";

interface Authority {
  authority: string;
}

interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  authorities: Authority[];
}

interface LoginInfo {
  token: string;
  expiresIn: number;
}

export default defineComponent({
  components: {
    NavHeader,
    Icon,
  },
  setup() {
    const isLoading = ref(true); // Controla el estado de carga
    const user = ref<User>({
      id: 0,
      name: "",
      lastname: "",
      email: "",
      phone: "",
      authorities: [],
    });

    const loginInfo = ref<LoginInfo>({
      token: "",
      expiresIn: 0,
    });

    const formatTime = (milliseconds: number) => {
      const hours = Math.floor(milliseconds / 3600000);
      const minutes = Math.floor((milliseconds % 3600000) / 60000);
      return `${hours} horas y ${minutes} minutos`;
    };

    onMounted(() => {
      const storedUser = localStorage.getItem("user");
      const storedLoginInfo = localStorage.getItem("loginInfo");

      if (storedUser) {
        user.value = JSON.parse(storedUser);
      }

      if (storedLoginInfo) {
        loginInfo.value = JSON.parse(storedLoginInfo);
      }

      // Simulación de carga (puedes reemplazarla con un tiempo real si es necesario)
      setTimeout(() => {
        isLoading.value = false;
      }, 1000); // 1 segundo de carga
    });

    return {
      isLoading,
      user,
      loginInfo,
      formatTime,
    };
  },
});
</script>

<style scoped>
.profile-page {
  max-width: 800px;
}
</style>
