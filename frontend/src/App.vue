<script setup>
import {storeToRefs} from "pinia";
import {useUserStore} from "./stores/UserStore.js";
import {useCalendarStore} from "./stores/CalendarStore.js";
import {useSnackbarStore} from "./stores/SnackbarStore.js";
import CalendarViewMenu from "./components/toolbar/CalendarViewMenu.vue";
import AuthTabbedSheet from "./components/dialogs/auth/AuthTabbedSheet.vue";
import {onBeforeMount} from "vue";
import EditEventCard from "./components/dialogs/edit-cards/EditEventCard.vue";
import {router} from "@/router/index.js";
import {useEventsStore} from "@/stores/EventsStore.js";

//
// Pinia stores
//

const calendarStore = useCalendarStore()
const userStore = useUserStore()

const snackbarStore = useSnackbarStore()
const { snackbar, color, text } = storeToRefs(snackbarStore)

//
// Dialogs
//

const addEventDialog = ref(false)
//const addTaskDialog = ref(false)
const editEventDialog = ref(false)
const editEventId = ref(null)
//const editTaskDialog = ref(false)
//const editTaskId = ref(false)
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
    <v-main>
      <router-view @edit-event="(id) => { editEventId = id; editEventDialog = true }"/>
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
          <v-list-item title="Add task" @click="addEventDialog = true"/>
        </v-list>
      </v-menu>
      <v-snackbar v-model="snackbar" :text="text" :color="color"/>
      <v-dialog v-model="addEventDialog">
        <EditEventCard
            :new-event="true"
            @close-card="addEventDialog = false"/>
      </v-dialog>
      <v-dialog v-model="editEventDialog">
        <EditEventCard
            :event-id="editEventId"
            @close-card="editEventDialog = false; editEventId = null;"
        />
      </v-dialog>
      <!--v-dialog v-model="addTaskDialog">
        <EditEventCard
            :new-event="true"
            @close-card="addTaskDialog = false"/>
      </v-dialog-->
      <v-dialog v-model="authDialog">
        <AuthTabbedSheet @close-dialog="authDialog = false"/>
      </v-dialog>
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