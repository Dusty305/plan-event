<script setup>
import HeaderEditCardItem from "../v-card-items/HeaderCardItem.vue";

const props = defineProps({
  event: {
    required: true,
    type: Object
  }
})
const emit = defineEmits(['editBtnClicked', 'mapBtnClicked'])

const eventDuration = computed(() => `${props.event.start.toDateString()} - ${props.event.end.toDateString()}`)
console.log(props.event.start)
console.log(props.event.end)
</script>

<template>
  <v-card width="350" height="225">
    <HeaderEditCardItem
        :longitude="props.event.location.longitude"
        :latitude="props.event.location.latitude"
        :color="props.event.color">
      <v-btn class="mx-2" elevation="4" :color="props.event.color" size="small" icon="mdi-pen" @click="emit('editBtnClicked')"/>
      <v-btn class="mx-2" elevation="4" :color="props.event.color" size="small" icon="mdi-map" @click="emit('mapBtnClicked')"/>
    </HeaderEditCardItem>
    <v-card-title>
      {{ props.event.name }}
    </v-card-title>
    <v-card-subtitle>
      {{ eventDuration }}
    </v-card-subtitle>
    <v-card-item>
      <p class="text-body-2">{{ props.event.description }}</p>
    </v-card-item>
  </v-card>
</template>