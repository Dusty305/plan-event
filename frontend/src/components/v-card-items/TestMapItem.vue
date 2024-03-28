<template>
  <l-map
      :zoom="zoom"
      :center="center"
      style="height: 400px;"
  >
    <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    ></l-tile-layer>
    <l-marker
        :lat-lng="markerLatLng"
        @click="markerClicked"
    ></l-marker>
  </l-map>
</template>

<script setup>
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';

const zoom = ref(13)
const center = ref([51.505, -0.09])
const markerLatLng = ref([51.505, -0.09])

const markerClicked = () => {
  console.log('Маркер был нажат');
}
</script>