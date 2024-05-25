<script setup>
import { computed, onMounted, onBeforeMount, watch} from 'vue';
import { dateToMonthDayString } from "@/app/util/dateUtils.js";

const props = defineProps({
  events: {
    required: true,
    type: Array
  },
  currentDate: {
    required: true,
    type: Date
  }
});

const emit = defineEmits(['eventClick']);

const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

// Функция для получения начала дня в местном времени
const getLocalDate = dateStr => {
  const date = new Date(dateStr);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

// Дни месяца
const getDaysInMonthBetweenStartDateAndEndDate = (month, startDate, endDate) => {
  const days = [];
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    let events = props.events.filter(event => {
      const eventStartDate = getLocalDate(event.start);
      const eventEndDate = event.end ? getLocalDate(event.end) : eventStartDate;
      return eventStartDate <= date && eventEndDate >= date;
    });
    days.push({
      date: new Date(date),
      isCurrentMonth: date.getMonth() === month,
      dateString: date.toDateString(),
      events: events
    });
  }
  return days;
};

const daysInMonth = computed(() => {
  const year = props.currentDate.getFullYear();
  const month = props.currentDate.getMonth();

  // Определяем дату первого дня в виде
  let startDate = new Date(year, month, 1);
  while (startDate.getDay() !== 1) {
    startDate.setDate(startDate.getDate() - 1);
  }

  // Определяем дату последнего дня в виде
  let endDate = new Date(year, month + 1, 0);
  while (endDate.getDay() !== 0) {
    endDate.setDate(endDate.getDate() + 1);
  }

  return getDaysInMonthBetweenStartDateAndEndDate(month, startDate, endDate);
});

const getBorderColor = globalEventId => {
  const globalEvent = props.events.find(event => event.id === globalEventId);
  return globalEvent ? globalEvent.color : 'transparent';
};

const calculateEventClass = (day, event) => {
  // Если это однодневное мероприятие
  if (!event.end) {
    return 'event-single'
  }
  // Если это день начала мероприятия
  if (event.start.toDateString() === day.date.toDateString()) {
    return 'event-start'
  }
  // Если это день конца мероприятия
  else if (event.end.toDateString() === day.date.toDateString()) {
    return 'event-end'
  }
  // Если это день середины мероприятия
  else {
    return 'event-middle'
  }
}

const calculateEventTitleStyle = (day, event) => {
  // Если это первый день мероприятия
  let style = { paddingLeft: '3px' }
  style.opacity = +(event.start.toDateString() === day.date.toDateString() || day.date.getDay() === 1)
  return style
}

const handleEventClick = (event, eventData) => {
  emit('eventClick', eventData, { x: event.clientX, y: event.clientY });
}

onBeforeMount(() => {
  console.log(props)
  console.log('Events: ', props.events);
  console.log('Date: ', props.currentDate);
  console.log(props.currentDate instanceof Date);
});
</script>

<template>
  <div class="month-view">
    <div class="weekday-header">
      <div v-for="(day, index) in weekdays" :key="index" class="weekday">
        {{ day }}
      </div>
    </div>
    <div class="month-grid">
      <div
          v-for="day in daysInMonth"
          :key="day.date"
          :class="['day-cell', day.isCurrentMonth ? 'current-month' : 'other-month']"
      >
        <div class="date">
          {{ day.isCurrentMonth ? day.date.getDate() : dateToMonthDayString(day.date) }}
        </div>
        <div
            v-for="event in day.events"
            :key="event.id"
            class="event"
            :class="calculateEventClass(day, event)"
            :style="{ backgroundColor: event.color, borderColor: getBorderColor(event.globalEventId) }"
            @click="handleEventClick($event, event)"
        >
          <span :style="calculateEventTitleStyle(day, event)">
            {{ event.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.month-view {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Полная высота экрана */
  width: 100vw; /* Полная ширина экрана */
  overflow: hidden;
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 1fr; /* Убедимся, что ряды растягиваются равномерно */
  flex-grow: 1;
}

.day-cell {
  //padding: 5px;
  display: flex;
  flex-direction: column;
  background-color: white; /* Цвет фона ячейки */
  box-shadow: inset 0 0 0 1px #ccc; /* Внутренняя тень для создания эффекта границы */
}

.date {
  padding-top: 4px;
  padding-left: 8px;
}

.current-month .date {
  color: black; /* Черный цвет для текущего месяца */
}

.other-month .date {
  color: lightgray; /* Светло-серый цвет для дней другого месяца */
}

.event {
  border-bottom: 3px solid;
  padding: 2px;
  margin: 5px 8px;
  cursor: pointer; /* Курсор указывает, что элемент кликабельный */
}

.event-single {
  border-radius: 5px;
}

.event-start {
  margin-right: 0;
  border-top-left-radius: 5px; /* Закругления слева сверху */
  border-bottom-left-radius: 5px; /* Закругления слева снизу */
}

.event-end {
  margin-left: 0;
  border-top-right-radius: 5px; /* Закругления справа сверху */
  border-bottom-right-radius: 5px; /* Закругления справа снизу */
}

.event-middle {
  margin: 5px 0px;
  border-radius: 0; /* Отсутствие закруглений для середины мероприятия */
}

.weekday-header {
  display: flex; /* Использовать flex контейнер */
  text-align: center;
  font-size: 1.1em;
  font-weight: bold;
  margin: 6px 0;
}

.weekday {
  flex: 1; /* Равномерно распределять пространство между днями недели */
}
</style>
