import { createApp } from 'vue'
import App from './App.vue'
import { router } from "./router/index.js";

//
// Components
//

import FullCalendar from "@fullcalendar/vue3";

//
// Vuetify
//

import "@mdi/font/css/materialdesignicons.css"
import 'vuetify/styles'
import { createVuetify } from "vuetify";
const vuetify = createVuetify({
    iconfont: 'mdi',
})

//
// Pinia
//

import { createPinia } from "pinia";
const pinia = createPinia()

//
// Leaflet
//

import 'leaflet/dist/leaflet.css';

//
// Service worker
//

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register(
          '/service-worker.js',
          { type: (import.meta.env?.DEV ? 'module' : undefined) }
      );
      await registration.update();
      console.log('Service worker registered!', registration);
    } catch(err) {
      console.log('Service worker registration failed', err);
    }
  })
}

//
// Constants
//

export const BASE_API_URL = 'http://localhost:8080/api'

createApp(App)
    .use(router)
    .use(pinia)
    .use(vuetify)
    .component('FullCalendar', FullCalendar)
    .mount('#app')