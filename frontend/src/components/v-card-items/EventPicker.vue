<script setup>
import {useEventsStore} from "@/app/stores/EventsStore.js";
import {storeToRefs} from "pinia";
import {onBeforeMount} from "vue";

const eventsStore = useEventsStore()
const { events } = storeToRefs(eventsStore)
const eventId = defineModel()

function onChange(event) {
  if (event) {
    eventId.value = event.id
    eventName.value = event.name
  } else {
    this.$emit('change', null);
  }
}

const eventName = ref('')

onBeforeMount(() => {
  if (eventId.value) {
    const event = eventsStore.getEventById(eventId.value)
    onChange(event)
  }
})
</script>

<template>
  <v-autocomplete
      v-model="eventName"
      :items="events"
      label="Select an event"
      return-object
  >
    <template v-slot:item="{ props, item }">
      <v-list-item
          v-bind="props"
          :title="item.raw.name"
          :subtitle="item.raw.location.address"
          @click="onChange(item.raw)"
      />
    </template>
  </v-autocomplete>
  <!--
<v-autocomplete
    v-model="eventName"
    :items="events"
    placeholder="Мероприятие"
    :color="event ? event.color : null"
    variant="underlined"
>
  <template v-slot:selection="{ item }">
    <v-label :text="item.raw.name"/>
  </template>
  <template v-slot:item="{ props, item }">
    <v-list-item
        v-bind="props"
        :title="item.raw.name"
        :subtitle="item.raw.location.address"
    />
  </template>
</v-autocomplete>
-->
</template>

<style scoped>

</style>