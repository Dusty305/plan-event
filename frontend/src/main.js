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
// Constants
//

export const BASE_API_URL = 'http://localhost:8080/api'

createApp(App)
    .use(router)
    .use(pinia)
    .use(vuetify)
    .component('FullCalendar', FullCalendar)
    .mount('#app')