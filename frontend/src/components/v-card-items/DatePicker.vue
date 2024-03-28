<script setup>
const props = defineProps({
  currentDate: {
    required: true,
    type: Date
  },
  label: {
    required: false,
    default: 'Дата'
  }
})
const emit = defineEmits(['pickedDate'])

const date = ref(props.currentDate)
const dateMenu = ref(false)
const dateString = computed(() => props.currentDate.toDateString())

const dateChosen = () => {
  dateMenu.value = false
  emit('pickedDate', date)
}
</script>

<template>
  <v-menu
      v-model="dateMenu"
      :close-on-content-click="false"
  >
    <template v-slot:activator="{ props }">
      <v-text-field
          v-bind="props"
          :label="label"
          readonly
          v-model="dateString"
      ></v-text-field>
    </template>
    <v-date-picker
        v-model="date"
        @update:model-value="dateChosen"
        hide-header
    />
  </v-menu>
</template>

<style scoped>

</style>