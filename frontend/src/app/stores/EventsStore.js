import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {useUserStore} from "./UserStore.js";
import {incrementWeek} from "../util/dateUtils.js";

//
// Store for production
//

export const useEventsStore = defineStore("events", () => {
    const API_URL = `${import.meta.env.VITE_BASE_API_URL}/${import.meta.env.VITE_EVENTS_API}`
    const events = ref([])
    const refreshing = ref(false)

    //
    // Utility
    //

    // todo: do i even need to convert id?
    const _objToEvent = (event) => ({
        ...event,
        id: +event.id,
        start: new Date(event.start),
        end: new Date(event.end),
        tasks: event.tasks instanceof Array ? event.tasks.map(_objToTask) : []
    })
    const _objToTask = (task) => ({
        ...task,
        id: +task.id,
        date: new Date(task.date)
    })

    const _prepareEventToBeSent = (event) => {
        event = JSON.parse(JSON.stringify(event))
        event.tasks = undefined
        return event
    }

    const _getEventIndexById = (id) => {
        const idIsEqual = event => event.id === id
        return events.value.findIndex(idIsEqual)
    }
    const _getEventById = (id) => {
        const index = _getEventIndexById(id)
        return events.value[index]
    }

    const _getTaskIndexByIdFromEvent = (taskId, event) => {
        const idIsEqual = task => task.id === taskId
        return event.tasks.findIndex(idIsEqual)
    }
    const _getTaskByIdFromEvent = (taskId, event) => {
        const index = _getTaskIndexByIdFromEvent(taskId, event)
        return event.tasks[index]
    }

    const getEventById = id => {
        return readonly(_getEventById(id))
    }

    const getTaskByIdAndEvent = (id, event) => {
        return readonly(_getTaskByIdFromEvent(id, event))
    }

    const getEventCopyById = id => {
        const event = _getEventById(id);
        const rawEvent = JSON.parse(JSON.stringify(event))
        return _objToEvent(rawEvent)
    }
    const getTaskCopyById = (id) => {
        for (const event of events.value) {
            const task = _getTaskByIdFromEvent(id, event)
            if (task) {
                const rawTask = JSON.parse(JSON.stringify(task))
                return _objToTask(rawTask)
            }
        }
        return undefined
    }

    //
    // Events API
    //

    const refreshEvents = async () => {
        let response
        refreshing.value = true
        try {
            response = await fetch(`${API_URL}`, {
                method: 'GET',
                mode: "cors",
                headers: new Headers({
                    'Authorization': useUserStore().jwt
                })
            })
            if (response.ok) {
                const rawEvents = await response.json()
                events.value = rawEvents.map(_objToEvent)
            }
        } catch (e) {
            console.log('Error refreshing events - ', e)
        }
        refreshing.value = false
        return response?.ok
    }

    const saveEvent = async (event) => {
        try {
            const response = await fetch(`${API_URL}/save_event`, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(_prepareEventToBeSent(event)),
                headers: new Headers({
                    'Authorization': useUserStore().jwt,
                    'Content-type': 'application/json'
                })
            })
            if (!response.ok) {
                return false
            }
            event.id = await response.json()
            events.value.push(_objToEvent(event))
            return true
        } catch (e) {
            console.log('Error saving event - ', e)
            return false
        }
    }
    const updateEvent = async (event) => {
        try {
            const response = await fetch(`${API_URL}/update_event`, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(_prepareEventToBeSent(event)),
                headers: new Headers({
                    'Authorization': useUserStore().jwt,
                    'Content-type': 'application/json'
                })
            })
            if (!response.ok) {
                return false
            }
            const index = _getEventIndexById(event.id)
            events.value[index] = event
            return true
        } catch (e) {
            console.log('Error updating event - ', e)
            return false
        }
    }
    const removeEvent = async (event) => {
        try {
            const response = await fetch(`${API_URL}/remove_event`, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(event.id),
                headers: new Headers({
                    'Authorization': useUserStore().jwt
                })
            })
            if (!response.ok) {
                return false
            }
            const index = _getEventIndexById(event.id)
            events.value.splice(index, 1)
            return true
        } catch (e) {
            console.log('Error removing event - ', e)
            return false
        }
    }

    const saveTask = async (task) => {
        try {
            const response = await fetch(`${API_URL}/save_task`, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(task),
                headers: new Headers({
                    'Authorization': useUserStore().jwt
                })
            })
            if (!response.ok) {
                return false
            }
            task.id = await response.json()
            // saving the new task to the existing event
            let event = _getEventById(task.eventId)
            event.tasks.push(task)
            return true
        } catch (e) {
            console.log('Error saving task - ', e)
            return false
        }
    }
    const updateTask = async (task) => {
        try {
            const response = await fetch(`${API_URL}/update_task`, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(task),
                headers: new Headers({
                    'Authorization': useUserStore().jwt
                })
            })
            if (!response.ok) {
                return false
            }
            let event = _getEventById(task.eventId)
            const index = _getTaskIndexByIdFromEvent(task.id, event)
            event.tasks[index] = task
            return true
        } catch (e) {
            console.log('Error updating task - ', e)
            return false
        }
    }
    const removeTask = async (task) => {
        const requestBody = { taskId: task.id, eventId: task.eventId }
        try {
            const response = await fetch(`${API_URL}/remove_event`, {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(requestBody),
                headers: new Headers({
                    'Authorization': useUserStore().jwt
                })
            })
            if (!response.ok) {
                return false
            }
            let event = _getEventById(task.eventId)
            const index = _getTaskIndexByIdFromEvent(task.id, event)
            event.tasks.splice(index, 1)
            return true
        } catch (e) {
            console.log('Error deleting task - ', e)
            return false
        }
    }

    const generateNewEvent = () => ({
        name: '',
        description: '',
        start: new Date(),
        end: incrementWeek(new Date()),
        color: "#00FFFF",
        location: {
            address: null,
            latitude: null,
            longitude: null,
        },
        tasks: []
    })
    const generateNewTask = (eventId) => ({
        name: '',
        description: '',
        date: new Date(),
        location: {
            address: null,
            latitude: null,
            longitude: null,
        },
        color: "#00FFFF",
        eventId: eventId ?? null
    })

    return {
        events: computed(() => events.value.map(event => event)),
        refreshEvents, refreshing,
        saveEvent, updateEvent, removeEvent,
        saveTask, updateTask, removeTask,
        getEventById, getTaskByIdAndEvent,
        getEventCopyById, getTaskCopyById,
        generateNewEvent, generateNewTask
    }
})