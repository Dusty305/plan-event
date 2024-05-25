<script setup>
import Calendar from "@/modules/calendar/Calendar.vue";
import {storeToRefs} from "pinia";
import {useEventsStore} from "@/app/stores/EventsStore.js";

const { events } = storeToRefs(useEventsStore())
</script>

<template>
<Calendar class="h-100"/>
</template>