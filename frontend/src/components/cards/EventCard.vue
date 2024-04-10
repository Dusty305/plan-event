<script setup>
import HeaderEditCardItem from "../v-card-items/HeaderCardItem.vue";

const props = defineProps({
  event: {
    required: true,
    type: Object
  }
})
const emit = defineEmits(['editBtnClicked', 'mapBtnClicked', 'closeCard'])

const eventDuration = computed(() => `${props.event.start.toDateString()} - ${props.event.end.toDateString()}`)
</script>

<template>
  <v-card width="350" height="225">
    <HeaderEditCardItem
        :longitude="props.event.location.longitude"
        :latitude="props.event.location.latitude"
        :color="props.event.color">
      <v-btn class="mx-2" elevation="4" :color="props.event.color" size="small" icon="mdi-pen" @click="emit('editBtnClicked'); emit('closeCard')"/>
      <v-btn class="mx-2" elevation="4" :color="props.event.color" size="small" icon="mdi-map" @click="emit('mapBtnClicked')"/>
      <v-btn class="mx-2" elevation="4" :color="props.event.color" size="small" icon="mdi-close" @click="emit('closeCard')"/>
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