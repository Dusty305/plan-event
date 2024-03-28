<script setup>
import {LMap, LTileLayer, LMarker, LPopup} from "@vue-leaflet/vue-leaflet";
import 'leaflet/dist/leaflet.css'
import L from "leaflet";
import {reverseAddressNameByLatLong} from "../../services/GeoService.js";
import {watch, onMounted} from "vue";

const props = defineProps({
  longitude: {
    required: false,
    type: Number
  },
  latitude: {
    required: false,
    type: Number
  }
})
const emit = defineEmits(['latLngUpdated'])

//
// Refs to components
//

const map = ref(null)
const marker = ref(null)
const popup = ref(null)

//
// Attributes of l-map
//

const zoom = ref(13)
const center = ref([51.505, -0.09])
const options = { attributionControl: false }

//
// Marker position (latitude & longitude)
//

const longitude = ref(props.longitude)
const latitude = ref(props.latitude)
const markerLatLngUpdated = computed(() => props.longitude !== longitude.value || props.latitude !== latitude.value)
const markerLatLng = computed(() => {
  if (!latitude.value || !longitude.value) {
    return null
  }
  return L.latLng(latitude.value, longitude.value)
})
const address = ref(null)

//
// Action handlers
//

const updateMarkerPosition = async (event) => {
  latitude.value  = event.latlng.lat
  longitude.value = event.latlng.lng
}
const cancelLatLngUpdate = () => {
  latitude.value = props.latitude
  longitude.value = props.longitude
}
const updateLatLng = () => {
  emit('latLngUpdated', latitude.value, longitude.value, address.value)
}
watch([longitude, latitude], async () => {
  address.value = await reverseAddressNameByLatLong(latitude.value, longitude.value)
  if (popup.value !== null && marker.value !== null) {
    const lMarker = marker.value.leafletObject
    const lPopup = popup.value.leafletObject
    lMarker.bindPopup(lPopup).openPopup()
    //const propertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(lPopup));
    //console.log(propertyNames)
  }
})
</script>

<template>
  <!--v-text-field v-model="address" readonly persistent-placeholder label="Выберите точку на карте"/-->
  <l-map
      ref="map"
      style="{ width: auto; height: 350px; }"
      :zoom="zoom"
      :center="center"
      :options="options"
      @click="updateMarkerPosition"
  >
    <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
    <l-marker v-if="markerLatLng" ref="marker" :lat-lng="markerLatLng">
      <l-popup
          ref="popup"
          :options="{ closeButton: false, autoClose: false, closeOnClick: false }"
          :lat-lng="markerLatLng"
      >
        <p class="text-body-2">{{ address }}</p>
        <template v-if="markerLatLngUpdated">
          <div>
            <v-btn size="small" icon="mdi-check" @click.stop="updateLatLng"/>
            <v-btn size="small" icon="mdi-cancel" class="mx-2" @click.stop="cancelLatLngUpdate"/>
          </div>
        </template>
        <template v-else>
          <p class="align-self-end">Сохранено</p>
        </template>
      </l-popup>
    </l-marker>
  </l-map>
</template>