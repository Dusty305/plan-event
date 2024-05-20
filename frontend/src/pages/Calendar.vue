<script setup>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from '@fullcalendar/daygrid'
import multiMonthPlugin from '@fullcalendar/multimonth'
import {computed, ref, watch, onMounted} from "vue";
import {useEventsStore} from "../app/stores/EventsStore.js";
import {storeToRefs} from "pinia";
import {useCalendarStore} from "../app/stores/CalendarStore.js";
import EventCard from "../modules/cards/EventCard.vue";
import {useSnackbarStore} from "@/app/stores/SnackbarStore.js";
import TaskCard from "@/modules/cards/TaskCard.vue";
import {
  eventsToFullCalendarEvents,
  getEventByFcEventId,
  getTaskByFcEventId,
  isTaskByFcEventId
} from "@/app/util/fcCalendar-utils.js";
import {useAppStore} from "@/app/stores/AppStore.js";

const emit = defineEmits(['edit-event', 'edit-task'])

//
// Pinia stores
//

const eventsStore = useEventsStore()
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

const { events } = storeToRefs(eventsStore)
const fcEvents = ref([])

const selectedEvent = ref(null)
const selectedTask = ref(null)
const calendarOptions = ref({
  plugins: [ dayGridPlugin, multiMonthPlugin ],
  initialView: INITIAL_CALENDAR_VIEW,
  events: fcEvents,
  // style
  height: "95%",
  headerToolbar: false,
  initialDate: initialDate,
  // actions
  eventClick: (info) => {
    const fcEventId = info.event.id
    const rect = info.el.getBoundingClientRect()
    eventCardPosition.value = calculatePositionFromRect(rect)
    if (!isTaskByFcEventId(fcEventId)) {
      selectedTask.value = null
      selectedEvent.value = getEventByFcEventId(fcEventId)
    }
    else {
      selectedEvent.value = null
      selectedTask.value = getTaskByFcEventId(fcEventId)
    }
  }
})

const routeToEventOnMap = () => {
  const snackbarStore = useSnackbarStore()
  snackbarStore.showSnackbar('Функционал в разработке', snackbarStore.INFO_COLOR)
}

const deleteSelectedEvent = () => {
  if (selectedEvent.value) {
    const snackbarStore = useSnackbarStore()
    if (eventsStore.removeEvent(selectedEvent.value)) {
      snackbarStore.showSnackbar('Мероприятие было удалено', snackbarStore.SUCCESS_COLOR)
      selectedEvent.value = null
    }
    else {
      snackbarStore.showSnackbar('Мероприятие не удалось удалить', snackbarStore.ERROR_COLOR)
    }
  }
}

const deleteSelectedTask = () => {
  if (selectedTask.value) {
    const snackbarStore = useSnackbarStore()
    if (eventsStore.removeTask(selectedEvent.value)) {
      snackbarStore.showSnackbar('Задание было удалено', snackbarStore.SUCCESS_COLOR)
      selectedTask.value = null
    }
    else {
      snackbarStore.showSnackbar('Задание не удалось удалить', snackbarStore.ERROR_COLOR)
    }
  }
}

//
// Watchers and hooks
//

const fullCalendar = ref(null)
let api
onMounted(() => api = fullCalendar.value.getApi())
watch(fullCalendarView, () => api.changeView(fullCalendarView.value))
watch(date, () => api.gotoDate(date.value))
watch(events, () => {
  fcEvents.value = eventsToFullCalendarEvents(events.value)
  api.removeAllEventSources()
  api.addEventSource(fcEvents)
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
      @edit-btn-clicked="emit('edit-event', selectedEvent.id); selectedEvent = null;"
      @delete-btn-clicked="deleteSelectedEvent"
      @close-card="selectedEvent = null"
      @map-btn-clicked="routeToEventOnMap"
      @show-tasks="useAppStore().openTasksSidebar(selectedEvent)"
  />
  <TaskCard
      v-else-if="selectedTask"
      :task="selectedTask"
      :style="cardStyle"
      @edit-btn-clicked="emit('edit-task', selectedTask.id); selectedTask = null;"
      @delete-btn-clicked="deleteSelectedTask"
      @close-card="selectedTask = null"
      @map-btn-clicked="routeToEventOnMap"
  />
</template>