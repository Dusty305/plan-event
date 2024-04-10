<script setup>
import {LMap, LMarker, LPopup, LTileLayer} from "@vue-leaflet/vue-leaflet";
import {storeToRefs} from "pinia";
import {useEventsStore} from "@/stores/EventsStore.js";
import L from "leaflet";

const emit = defineEmits(['edit-event'])

const zoom = ref(13)
const center = ref([51.505, -0.09])
const options = { attributionControl: false }

const { events } = storeToRefs(useEventsStore())
</script>

<template>
  <!--style="{ width: auto; height: 350px; }" -->
  <l-map
      :zoom="zoom"
      :center="center"
      :options="options"
  >
    <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
    <template v-for="event in events">
      <l-marker
          v-if="event.location.latitude && event.location.longitude"
          :lat-lng="L.latLng(event.location.latitude, event.location.longitude)"
      >
        <l-popup>
          <p class="text-body-2">{{ event.location.address }}</p>
          <v-btn icon="mdi-pen" fab @click="emit('edit-event', event.id)"/>
        </l-popup>
      </l-marker>
    </template>
  </l-map>
</template>

<style scoped>

</style>