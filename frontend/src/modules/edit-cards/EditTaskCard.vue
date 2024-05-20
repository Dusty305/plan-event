<script setup>
import {useEventsStore} from "../../app/stores/EventsStore.js";
import {useSnackbarStore} from "../../app/stores/SnackbarStore.js";
import {onBeforeMount} from "vue";
import DatePicker from "../../components/v-card-items/DatePicker.vue";
import GeoPicker from "../../components/v-card-items/GeoPicker.vue";
import NameTextField from "../../components/v-card-items/NameTextField.vue";
import DescriptionTextarea from "../../components/v-card-items/DescriptionTextarea.vue";
import HeaderCardItem from "../../components/v-card-items/HeaderCardItem.vue";
import EventPicker from "@/components/v-card-items/EventPicker.vue";

const props = defineProps({
  newTask: {
    required: false
  },
  taskId: {
    validator(value, props) {
      if (!props.newTask) {
        return value instanceof Number
      }
    }
  },
  eventId: {
    required: false
  }
})
const emit = defineEmits(['closeCard'])

const task = ref({})

//
// Stores
//

const eventsStore = useEventsStore()
const snackbarStore = useSnackbarStore()

//
// Actions
//

const updatePoint = (latitude, longitude, address) => {
  task.value.location.latitude = latitude
  task.value.location.longitude = longitude
  task.value.location.address = address
}

const handleSaveBtnClick = async () => {
  if (props.newTask) {
    await saveTask()
  }
  else {
    await updateTask()
  }
}

const handleCancelBtnClick = () => {
  emit('closeCard')
}

const saveTask = async () => {
  let response = await eventsStore.saveTask(task.value)
  if (response) {
    snackbarStore.showSnackbar('Мероприятие было добавлено', snackbarStore.SUCCESS_COLOR)
    emit('closeCard')
  }
  else {
    snackbarStore.showSnackbar('Не удалось добавить мероприятие', snackbarStore.ERROR_COLOR)
  }
}

const updateTask = async () => {
  let response = await eventsStore.updateTask(task.value)
  if (response) {
    snackbarStore.showSnackbar('Задание было обновлено', snackbarStore.SUCCESS_COLOR)
    emit('closeCard')
  }
  else {
    snackbarStore.showSnackbar('Не удалось обновить задание', snackbarStore.ERROR_COLOR)
  }
}

//
// Hooks
//

onBeforeMount(() => {
  if (props.newTask) {
    task.value = eventsStore.generateNewTask(props.eventId)
  }
  else {
    task.value = eventsStore.getTaskCopyById(props.taskId)
  }
})
</script>

<template>
  <v-card width="700" style="align-self: center">
    <HeaderCardItem
        :color="task.color"
        :latitude="task.location.latitude"
        :longitude="task.location.longitude"
    >
      <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-btn
              v-bind="props"
              :color="task.color"
              icon="mdi-format-color-fill"
              size="small"
              class="mx-2"
              color="grey-darken-1"
              fab
          />
        </template>
        <v-color-picker v-model="task.color"/>
      </v-menu>
    </HeaderCardItem>
    <v-card-item>
      <EventPicker
          v-model="task.eventId"
      />
    </v-card-item>
    <v-card-item>
      <NameTextField v-model="task.name"/>
    </v-card-item>
    <v-card-item>
      <DescriptionTextarea v-model="task.description"/>
    </v-card-item>
    <v-card-item>
      <DatePicker
          label="Дата начала"
          :current-date="task.date"
          @picked-date="(date) => task.date = date"
      />
    </v-card-item>
    <v-card-item>
      <GeoPicker
          :longitude="task.location.longitude"
          :latitude="task.location.latitude"
          @lat-lng-updated="updatePoint"
      />
    </v-card-item>
    <v-card-actions>
      <v-btn variant="elevated" class="ml-2" text="Сохранить" @click="handleSaveBtnClick"/>
      <v-btn variant="elevated" class="ml-2" text="Отменить" @click="handleCancelBtnClick"/>
    </v-card-actions>
  </v-card>
</template>