<script setup>
import {useEventsStore} from "../../app/stores/EventsStore.js";
import {useSnackbarStore} from "../../app/stores/SnackbarStore.js";
import {onBeforeMount} from "vue";
import DatePicker from "../../components/v-card-items/DatePicker.vue";
import GeoPicker from "../../components/v-card-items/GeoPicker.vue";
import NameTextField from "../../components/v-card-items/NameTextField.vue";
import DescriptionTextarea from "../../components/v-card-items/DescriptionTextarea.vue";
import ColorPicker from "../../components/v-card-items/ColorPicker.vue";
import HeaderCardItem from "../../components/v-card-items/HeaderCardItem.vue";

const props = defineProps({
  newEvent: {
    required: false
  },
  eventId: {
    validator(value, props) {
      if (!props.newEvent) {
        return value instanceof Number
      }
    }
  }
})
const emit = defineEmits(['closeCard'])

const event = ref({})

//
// Stores
//

const eventsStore = useEventsStore()
const snackbarStore = useSnackbarStore()

//
// Actions
//

const updatePoint = (latitude, longitude, address) => {
  event.value.location.latitude = latitude
  event.value.location.longitude = longitude
  event.value.location.address = address
}

const handleSaveBtnClick = async () => {
  if (props.newEvent) {
    await saveEvent()
  }
  else {
    await updateEvent()
  }
}

const handleCancelBtnClick = () => {
  emit('closeCard')
}

const saveEvent = async () => {
  let response = await eventsStore.saveEvent(event.value)
  if (response) {
    snackbarStore.showSnackbar('Мероприятие было добавлено', snackbarStore.SUCCESS_COLOR)
    emit('closeCard')
  }
  else {
    snackbarStore.showSnackbar('Не удалось добавить мероприятие', snackbarStore.ERROR_COLOR)
  }
}

const updateEvent = async () => {
  let response = await eventsStore.updateEventDataByID(props.eventId, event.value)
  if (response) {
    snackbarStore.showSnackbar('Мероприятие было обновлено', snackbarStore.SUCCESS_COLOR)
    emit('closeCard')
  }
  else {
    snackbarStore.showSnackbar('Не удалось обновить мероприятие', snackbarStore.ERROR_COLOR)
  }
}

//
// Hooks
//

onBeforeMount(() => {
  console.log(props.newEvent)
  console.log(props.eventId)
  if (props.newEvent) {
    event.value = eventsStore.generateNewEvent()
  }
  else {
    event.value = eventsStore.getEventCopyById(props.eventId)
  }
})
</script>

<template>
  <v-card width="700" style="align-self: center">
    <HeaderCardItem
        :color="event.color"
        :latitude="event.location.latitude"
        :longitude="event.location.longitude"
    >
      <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-btn
              v-bind="props"
              :color="event.color"
              icon="mdi-format-color-fill"
              size="small"
              class="mx-2"
              color="grey-darken-1"
              fab
          />
        </template>
        <v-color-picker v-model="event.color"/>
      </v-menu>
    </HeaderCardItem>
    <v-card-item>
      <NameTextField v-model="event.name"/>
    </v-card-item>
    <v-card-item>
      <DescriptionTextarea v-model="event.description"/>
    </v-card-item>
    <v-card-item>
      <v-row>
        <v-col>
          <DatePicker
              label="Дата начала"
              :current-date="event.start"
              @picked-date="(date) => event.start = date"/>
        </v-col>
        <v-col>
          <DatePicker
              label="Дата конца"
              :current-date="event.end"
              @picked-date="(date) => event.end = date"/>
        </v-col>
      </v-row>
    </v-card-item>
    <v-card-item>
      <GeoPicker
          :longitude="event.location.longitude"
          :latitude="event.location.latitude"
          @lat-lng-updated="updatePoint"
      />
    </v-card-item>
    <v-card-item>
      <ColorPicker/>
    </v-card-item>
    <v-card-actions>
      <v-btn variant="elevated" class="ml-2" text="Сохранить" @click="handleSaveBtnClick"/>
      <v-btn variant="elevated" class="ml-2" text="Отменить" @click="handleCancelBtnClick"/>
    </v-card-actions>
  </v-card>
</template>