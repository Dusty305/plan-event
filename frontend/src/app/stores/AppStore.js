import {useSnackbarStore} from "@/app/stores/SnackbarStore.js";
import {defineStore} from "pinia";

export const useAppStore = defineStore('app', () => {
    const sidebar = ref(false)
    const sidebarEvent = ref(null)

    const openTasksSidebar = (event) => {
        const snackbarStore = useSnackbarStore()
        if (!event) {
            snackbarStore.showSnackbar('Ошибка! Мероприятие не существует', snackbarStore.ERROR_COLOR)
        } else if (!event.tasks) {
            snackbarStore.showSnackbar('Ошибка! Задач у мероприятия не существует', snackbarStore.ERROR_COLOR)
        }

        sidebarEvent.value = event
        sidebar.value = true
    }

    const closeTasksSidebar = () => {
        sidebar.value = false
    }

    return {
        sidebar: sidebar,
        sidebarEvent: sidebarEvent,
        openTasksSidebar,
        closeTasksSidebar
    }
})