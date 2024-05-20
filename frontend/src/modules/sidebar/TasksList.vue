<script setup>
import {useAppStore} from "@/app/stores/AppStore.js";
import {dateToMonthString} from "@/app/util/dateUtils.js";

const props = defineProps({
  event: {
    required: true,
    type: Object
  }
})
const emit = defineEmits(['editTask', 'addTask'])
const sortedTasks = computed(() => props.event?.tasks?.sort((task1, task2) => task1.date - task2.date))
</script>

<template>
  <v-toolbar density="compact">
    <v-toolbar-items>
      <v-btn icon="mdi-close" size="small" @click="useAppStore().closeTasksSidebar()"/>
    </v-toolbar-items>
  </v-toolbar>
  <v-list v-if="sortedTasks && sortedTasks.length > 0">
    <v-list-item v-for="task in sortedTasks">
      <template v-slot:prepend>
        <v-icon icon="mdi-checkbox-marked-outline"/>
      </template>
      <v-list-item-title>
        {{ task.name }}
      </v-list-item-title>
      <v-list-item-subtitle>
        {{ task.location.address }}
      </v-list-item-subtitle>
      <template v-slot:append>
        <v-btn fab icon="mdi-pen" size="small" elevation="0" @click="emit('editTask', task.id)"/>
      </template>
    </v-list-item>
  </v-list>
  <v-list v-else>
    <v-list-item
        title="У мероприятия нету задач"
        subtitle="Нажмите на плюс, чтобы добавить его"
    >
      <template v-slot:append>
        <v-btn fab icon="mdi-plus" size="small" elevation="0" @click="emit('addTask', props.event.id)"/>
      </template>
    </v-list-item>
  </v-list>
</template>

<style scoped>

</style>