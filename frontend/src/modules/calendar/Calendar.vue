<script setup>
import MonthView from './MonthView.vue';
import WeekView from './WeekView.vue';
import YearView from './YearView.vue';
import {useCalendarStore} from "@/app/stores/CalendarStore.js";
import {storeToRefs} from "pinia";
import {incrementMonth, incrementWeek} from "@/app/util/dateUtils.js";
import {onBeforeMount, onMounted, ref} from "vue";
import {useAppStore} from "@/app/stores/AppStore.js";
import EventCard from "@/modules/cards/EventCard.vue";
import TaskCard from "@/modules/cards/TaskCard.vue";
import {getEventByFcEventId, getTaskByFcEventId, isTaskByFcEventId} from "@/app/util/fcCalendar-utils.js";
import {useSnackbarStore} from "@/app/stores/SnackbarStore.js";
import {useEventsStore} from "@/app/stores/EventsStore.js";

const emit = defineEmits(['edit-event'])

const calendarStore = useCalendarStore()
const { fullCalendarView, date } = storeToRefs(calendarStore)

const eventsStore = useEventsStore()
const events = storeToRefs(eventsStore)

const selectedEvent = ref(null)

const currentView = computed(() => {
  switch (fullCalendarView.value) {
    case 'dayGridWeek': return WeekView
    case 'dayGridMonth': return MonthView
    case 'multiMonthYear': return YearView
    default: return MonthView
  }
})

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

const calculatePositionFromMouseClick = (mouseClick) => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const cardWidth = 400
  const cardHeight = 300

  const { x, y } = mouseClick

  return {
    x: x + cardWidth  > windowWidth   ? windowWidth  - cardWidth  - 100 : x,
    y: y + cardHeight > windowHeight  ? windowHeight - cardHeight - 100 : y
  }
}

const handleEventClick = (event, mouseClick) => {
  console.log(event, mouseClick)
  eventCardPosition.value = calculatePositionFromMouseClick(mouseClick)
  selectedEvent.value = event
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

const editSelectedEvent = () => {
  emit('edit-event', selectedEvent.value.id);
  selectedEvent.value = null;
}

const routeToEventOnMap = () => {
  const snackbarStore = useSnackbarStore()
  snackbarStore.showSnackbar('Функционал в разработке', snackbarStore.INFO_COLOR)
}

onMounted(() => {
  console.log('Calendar events: ')
})
</script>

<template>
  <!-- fixme: WTF with the events?? -->
  <component
      :is="currentView"
      :currentDate="date"
      :events="events.events.value"
      @event-click="handleEventClick"
  />
  <EventCard
      v-if="selectedEvent"
      :event="selectedEvent"
      :style="cardStyle"
      @edit-btn-clicked="editSelectedEvent"
      @delete-btn-clicked="deleteSelectedEvent"
      @close-card="selectedEvent = null"
      @map-btn-clicked="routeToEventOnMap"
      @show-tasks="useAppStore().openTasksSidebar(selectedEvent)"
  />
</template>

<style scoped>

</style>