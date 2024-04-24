<script setup>
import {useCalendarStore} from "../app/stores/CalendarStore.js";

const calendarStore = useCalendarStore()
</script>

<template>
  <v-menu transition="slide-y-transition">
    <template v-slot:activator="{ props }">
      <v-btn
          variant="outlined"
          prepend-icon="mdi-calendar-weekend"
          v-bind="props"
          :text="calendarStore.dateString"
      />
    </template>
    <v-list>
      <v-list-item
          v-for="( fullCalendarView, viewName ) in calendarStore.viewsMap"
          @click="calendarStore.setView(fullCalendarView)"
      >
        <template
            v-if="fullCalendarView === calendarStore.fullCalendarView"
            v-slot:append
        >
          <v-icon icon="mdi-check"/>
        </template>
        <v-list-item-title>
          {{ viewName }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>