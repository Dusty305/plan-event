<script setup>
import {watch} from "vue";
import {reverseAddressPartsByLatLong} from "../../app/services/GeoService.js";
const props = defineProps({
  longitude: {
    required: false,
    type: Number
  },
  latitude: {
    required: false,
    type: Number
  },
  color: {
    required: true,
    type: String
  }
})

const onSurfaceColor = computed(() => {
  const red = Number(`0x${props.color.substring(1, 3)}`)
  const green = Number(`0x${props.color.substring(3, 5)}`)
  const blue = Number(`0x${props.color.substring(5, 7)}`)
  const threshold = red*0.299 + green*0.587 + blue*0.114 > 156
  return threshold ? '#000000' : '#FFFFFF'
})

const country = ref('')
const settlement = ref('')
const latLongDefined = computed(() => props.latitude && props.longitude)
const addressDefined = computed(() => country.value.length !== 0)

watch([() => props.latitude, () => props.longitude], async () => {
  if (!latLongDefined) {
    country.value = settlement.value = ''
    return
  }

  const address = await reverseAddressPartsByLatLong(props.latitude, props.longitude)
  if (address) {
    country.value = settlement.value = ''
  }
  country.value = address.country
  settlement.value = address.settlement
})
</script>

<template>
  <v-card-item
      :style="{ 'background-color': props.color }"
      class="py-2 pl-4"
  >
    <template v-slot:title>
      <p :style="{ color: onSurfaceColor }">{{ country }}</p>
    </template>
    <template v-slot:subtitle>
      <p :style="{ color: onSurfaceColor }">{{ settlement }}</p>
    </template>
    <template v-if="addressDefined" v-slot:prepend>
      <v-icon :color="onSurfaceColor" icon="mdi-web" class="mr-1" size="large"/>
    </template>
    <template v-slot:append>
      <slot/>
    </template>
  </v-card-item>
</template>