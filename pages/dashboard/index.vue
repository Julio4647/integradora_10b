<template>
  <div>
    <NavHeader />

    <div class="grid grid-cols-3 gap-6 p-3 mt-4 text-center">
      <!-- Card 1 -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="mt-4">
          <h3 class="text-xl font-bold">Equipos Reparados</h3>
          <p class="text-gray-600 mt-2">30</p>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="mt-4">
          <h3 class="text-xl font-bold">Equipos en reparacion</h3>
          <p class="text-gray-600 mt-2">50</p>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="mt-4">
          <h3 class="text-xl font-bold">Clientes registrados</h3>
          <p class="text-gray-600 mt-2">100</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavHeader from "~/components/navigation/NavHeader.vue";

export default defineComponent({
  components: {
    NavHeader, // Registrar el componente
  },
  methods: {
    getUsers() {
      this.$router.push("/users/viewUsers");
    },
  },
  setup() {
    return {
      powerPointUrl:
        "https://1drv.ms/p/s!An6SQ6Ft7VtOq-9GohJx4gExy8QR3w?e=HePPJt",
    };
  },
});
</script>

<style scoped></style>
