import TestPage from "../../pages/TestPage.vue";
import Map from "../../pages/Map.vue";
import Calendar from "../../pages/Calendar.vue";

export const routes = [
    { path: '/calendar', name: 'calendar', component: Calendar },
    { path: '/map', name: 'map', component: Map }
]