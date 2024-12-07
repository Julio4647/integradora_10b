<template>
    <div>
      <h1>Mensajes MQTT</h1>
      <ul>
        <li v-for="(message, index) in messages" :key="index">
          {{ message }}
        </li>
      </ul>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, onBeforeUnmount, ref } from 'vue';
  
  export default defineComponent({
    setup() {
      const messages = ref<string[]>([]);
  
      onMounted(() => {
        const topic = 'mi/tema'; // Tema al que te suscribes
        const client = useNuxtApp().$mqtt;
  
        client.subscribe(topic, (err) => {
          if (err) {
            console.error(`Error al suscribirse al tema ${topic}:`, err);
          } else {
            console.log(`Suscrito al tema ${topic}`);
          }
        });
  
        client.on('message', (receivedTopic, message) => {
          if (receivedTopic === topic) {
            messages.value.push(message.toString());
          }
        });
      });
  
      onBeforeUnmount(() => {
        // Cerrar la conexión al destruir el componente
        const client = useNuxtApp().$mqtt;
        client.end();
      });
  
      return {
        messages,
      };
    },
  });
  </script>
  