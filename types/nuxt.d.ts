import { Pinia } from "pinia";

declare module "#app" {
  interface NuxtApp {
    $pinia: Pinia;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $pinia: Pinia;
  }
}
