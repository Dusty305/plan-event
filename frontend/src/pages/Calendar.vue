<script setup>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from '@fullcalendar/daygrid'
import multiMonthPlugin from '@fullcalendar/multimonth'
import {computed, ref, watch, onMounted, onBeforeMount} from "vue";
import {useEventsStore} from "../app/stores/EventsStore.js";
import {storeToRefs} from "pinia";
import {useCalendarStore} from "../app/stores/CalendarStore.js";
import EventCard from "../modules/cards/EventCard.vue";
import {useSnackbarStore} from "@/app/stores/SnackbarStore.js";

const emit = defineEmits(['edit-event'])

//
// Pinia stores
//

const eventsStore = useEventsStore()
const { events } = storeToRefs(eventsStore)
const { fullCalendarView, date, INITIAL_CALENDAR_VIEW, initialDate } = storeToRefs(useCalendarStore())

//
// Styles
//

const eventCardPosition = ref({ x: 0, y: 0 })
const cardStyle = computed(() => ({
  position: 'absolute',
  left: `${eventCardPosition.value.x}px`,
  top: `${eventCardPosition.value.y}px`,
  zIndex: 9999
}))

//
// Utils
//

const calculatePositionFromRect = (rect) => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const cardWidth = 400
  const cardHeight = 300

  let x = rect.right;
  let y = rect.top;

  return {
    x: x + cardWidth  > windowWidth   ? windowWidth  - cardWidth  - 100 : x,
    y: y + cardHeight > windowHeight  ? windowHeight - cardHeight - 100 : y
  }
}

//
// FullCalendar options
//

const selectedEvent = ref(null)
const calendarOptions = ref({
  plugins: [ dayGridPlugin, multiMonthPlugin ],
  initialView: INITIAL_CALENDAR_VIEW,
  events: events,
  // style
  height: "95%",
  headerToolbar: false,
  initialDate: initialDate,
  // actions
  eventClick: (info) => {
    const rect = info.el.getBoundingClientRect()
    eventCardPosition.value = calculatePositionFromRect(rect)
    selectedEvent.value = eventsStore.getEventById(info.event.id)
    console.log(info.event)
    console.log(selectedEvent.value)
  }
})

const handleMapBtnClicked = () => {
  const snackbarStore = useSnackbarStore()
  snackbarStore.showSnackbar('Функционал в разработке', snackbarStore.INFO_COLOR)
}

//
// Watchers and hooks
//

const fullCalendar = ref(null)
let api
onMounted(() => api = fullCalendar.value.getApi())
onBeforeMount(async () => {
  await eventsStore.refreshEvents()
})
watch(fullCalendarView, () => api.changeView(fullCalendarView.value))
watch(date, () => api.gotoDate(date.value))
watch(events, () => {
  api.removeAllEventSources()
  api.addEventSource(events)
})
</script>

<template>
  <FullCalendar
      class="h-100"
      ref="fullCalendar"
      :options="calendarOptions"
  />
  <EventCard
      v-if="selectedEvent"
      :event="selectedEvent"
      :style="cardStyle"
      @edit-btn-clicked="emit('edit-event', selectedEvent.id)"
      @close-card="selectedEvent = null"
      @map-btn-clicked="handleMapBtnClicked"
  />
</template>