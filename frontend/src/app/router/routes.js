import MapPage from "../../pages/MapPage.vue";
import Calendar from "../../modules/calendar/Calendar.vue";
import TestPage from "../../pages/TestPage.vue"

export const routes = [
    { path: '/calendar', name: 'calendar', component: Calendar },
    { path: '/map', name: 'map', component: MapPage }
]