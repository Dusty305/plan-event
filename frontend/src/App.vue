<script setup>
import {storeToRefs} from "pinia";
import {useUserStore} from "./app/stores/UserStore.js";
import {useCalendarStore} from "./app/stores/CalendarStore.js";
import {useSnackbarStore} from "./app/stores/SnackbarStore.js";
import CalendarViewMenu from "./components/CalendarViewMenu.vue";
import AuthTabbedSheet from "./modules/auth/AuthTabbedSheet.vue";
import {onBeforeMount} from "vue";
import EditEventCard from "./modules/edit-cards/EditEventCard.vue";
import {router} from "@/app/router/index.js";
import {useEventsStore} from "@/app/stores/EventsStore.js";
import EditTaskCard from "@/modules/edit-cards/EditTaskCard.vue";
import {addTask} from "@/app/service-worker/idb/events-service.js";
import {useAppStore} from "@/app/stores/AppStore.js";
import TasksList from "@/modules/sidebar/TasksList.vue";

//
// Pinia stores
//

const calendarStore = useCalendarStore()
const userStore = useUserStore()

const snackbarStore = useSnackbarStore()
const { snackbar, color, text } = storeToRefs(snackbarStore)

const appStore = useAppStore()
const { sidebarEvent, sidebar } = storeToRefs(appStore)

//
// Dialogs
//

const addEventDialog = ref(false)
const addTaskDialog = ref(false)
const editEventDialog = ref(false)
const editTaskDialog = ref(false)

const dialogIsOpen = computed(() => addEventDialog.value || addTaskDialog.value || editEventDialog.value || editTaskDialog.value)

const editEventId = ref(null)
const editTaskId = ref(null)

const authDialog = ref(false)

//
// Toolbar actions
//

const logButtonPressed = () => {
  if (userStore.authorized) {
    userStore.logoutUser()
    location.reload()
  }
  else {
    authDialog.value = true
  }
}

//
// Router button
//

const routerBtnText = computed(() => router.currentRoute.value.name === 'calendar' ? 'Карта' : 'Календарь')
const routerBtnIcon = computed(() => routerBtnText.value === 'Карта' ? 'mdi-map' : 'mdi-calendar')
const handleRouterBtnClicked = () => router.push(routerBtnText.value === 'Карта' ? 'map' : 'calendar')


onBeforeMount(async () => {
  await useUserStore().validateJWT()
})
onBeforeMount(async () => {
  await useEventsStore().refreshEvents()
})
</script>

<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-title>
        <v-btn icon="mdi-arrow-left" fab @click="calendarStore.decrement"/>
        <calendar-view-menu/>
        <v-btn icon="mdi-arrow-right" class="mr-1" fab @click="calendarStore.increment"/>
      </v-app-bar-title>
      <!--v-btn
          :prepend-icon="userStore.authorized ? 'mdi-logout' : 'mdi-login'"
          :text="userStore.authorized ? 'Выйти' : 'Войти'"
          @click="logButtonPressed"
      /-->
      <v-btn :prepend-icon="routerBtnIcon" :text="routerBtnText" @click="handleRouterBtnClicked">
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="sidebar" location="right" width="400">
      <TasksList
          :event="sidebarEvent"
          @add-task="(eventId) => { editEventId = eventId; addTaskDialog = true; }"
          @edit-task="(id) => { editTaskId = id; editTaskDialog = true; }"
      />
    </v-navigation-drawer>
    <v-main>
      <router-view
          @edit-event="(id) => { editEventId = id; editEventDialog = true; }"
          @edit-task="(taskId) => { editTaskId = taskId; editTaskDialog = true; }"
      />
      <v-menu location="right">
        <template v-slot:activator="{ props }">
          <v-btn
              :disabled="!userStore.authorized"
              v-bind="props"
              class="add-btn"
              size="large"
              elevation="6"
              icon="mdi-plus"
              fab
          />
        </template>
        <v-list>
          <v-list-item title="Add event" @click="addEventDialog = true"/>
          <v-list-item title="Add task" @click="addTaskDialog = true"/>
        </v-list>
      </v-menu>
      <v-dialog v-model="dialogIsOpen">
        <EditEventCard
            v-if="addEventDialog"
            :new-event="true"
            @close-card="addEventDialog = false"
        />
        <EditEventCard
            v-else-if="editEventDialog"
            :event-id="editEventId"
            @close-card="editEventDialog = false; editEventId = null;"
        />
        <EditTaskCard
            v-else-if="addTaskDialog"
            :new-task="true"
            :event-id="editEventId"
            @close-card="addTaskDialog = false"
        />
        <EditTaskCard
            v-else-if="editTaskDialog"
            :task-id="editTaskId"
            @close-card="editTaskDialog = false; editTaskId = null"
        />
        <AuthTabbedSheet
            v-else-if="authDialog"
            @close-dialog="authDialog = false"
        />
      </v-dialog>
      <v-snackbar v-model="snackbar" :text="text" :color="color"/>
    </v-main>
  </v-app>
</template>

<style scoped>
.add-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 100;
}
</style>
