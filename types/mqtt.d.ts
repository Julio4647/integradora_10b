import { MqttClient } from 'mqtt';

declare module '#app' {
  interface NuxtApp {
    $mqtt: MqttClient;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $mqtt: MqttClient;
  }
}
