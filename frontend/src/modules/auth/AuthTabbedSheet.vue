<script setup>
import {ref} from "vue";
import RegistrationCard from "./RegistrationCard.vue";
import AuthorizationCard from "./AuthorizationCard.vue";
import {useSnackbarStore} from "../../app/stores/SnackbarStore.js";

const emit = defineEmits(['closeDialog'])

//
// Current window tab state
//

const tab = ref(null)
const registrationTab = "Registration tab"
const authorizationTab = "Authorization tab"

//
// Child components event handler
//

const snackbarStore = useSnackbarStore()

const onRegistrationFailed = (message) => {
  snackbarStore.text = message ? message : 'Registration failed'
  snackbarStore.color = snackbarStore.ERROR_COLOR
  snackbarStore.showSnackbar()
}
const onRegistrationSucceeded = (message) => {
  snackbarStore.text = message ? message : 'Registration succeeded'
  snackbarStore.color = snackbarStore.SUCCESS_COLOR
  snackbarStore.showSnackbar()
  tab.value = authorizationTab
}
const onAuthFailed = (message) => {
  snackbarStore.text = message ? message : 'Authorization failed'
  snackbarStore.color = snackbarStore.ERROR_COLOR
  snackbarStore.showSnackbar()
}
const onAuthSucceeded = (message) => {
  snackbarStore.text = message ? message : 'Authorization succeeded'
  snackbarStore.color = snackbarStore.SUCCESS_COLOR
  snackbarStore.showSnackbar()
  emit('closeDialog')
}
</script>

<template>
  <v-sheet width="700" style="align-self: center">
    <v-tabs v-model="tab" align-tabs="center">
      <v-tab text="Регистрация" :value="registrationTab"/>
      <v-tab text="Авторизация" :value="authorizationTab"/>
    </v-tabs>
    <v-divider/>
    <v-window v-model="tab">
      <v-window-item :value="registrationTab">
        <RegistrationCard
            @failure="onRegistrationFailed"
            @success="onRegistrationSucceeded"
        />
      </v-window-item>
      <v-window-item :value="authorizationTab">
        <AuthorizationCard
            @failure="onAuthFailed"
            @success="onAuthSucceeded"
        />
      </v-window-item>
    </v-window>
  </v-sheet>
</template>