import mqtt, { MqttClient } from 'mqtt';

/*export default defineNuxtPlugin((nuxtApp) => {
  const brokerUrl = 'ws://ec2-107-23-52-108.compute-1.amazonaws.com:1888'; // Cambia esta URL al broker MQTT que estés usando
  const options = {
    clientId: `nuxt-subscriber-${Math.random().toString(16).substr(2, 8)}`,
    clean: true, // Borra los datos del cliente en reconexión
    reconnectPeriod: 1000, // Reconecta cada 1s
  };

  const client: MqttClient = mqtt.connect(brokerUrl, options);

  client.on('connect', () => {
    console.log('MQTT conectado como suscriptor.');
  });

  client.on('error', (err) => {
    console.error('Error en MQTT:', err);
  });

  client.on('close', () => {
    console.log('Conexión MQTT cerrada.');
  });

  // Inyectar el cliente en el contexto de Nuxt
  nuxtApp.provide('mqtt', client);
});*/
