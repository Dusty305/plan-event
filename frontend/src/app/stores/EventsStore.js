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

    const refreshEvents = async () => {
        refreshing.value = true
        try {
            let response = await fetch(`${API_URL}`, {
                method: 'GET',
                mode: "cors",
                headers: new Headers({
                    'Authorization': useUserStore().jwt
                })
            })
            if (response.ok) {
                events.value = (await response.json()).map(_objToEvent)
            }
            else {
                console.log("Не удалось получить мероприятия с сервера")
            }
            return response.ok
        } catch (err) {
            console.log('Events store error: ', err)
            refreshing.value = false
            return false
        } finally {
            refreshing.value = false
        }
    }

    const _objToEvent = (event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
    })

    // TODO: pass Event obj and send response
    const updateEventDataByID = async (id, data) => {
        const index = _getEventIndexById(id)
        if (index === -1 || !data) {
            return undefined
        }

        const event = events.value[index]
        let response = await _updateEvent(event)
        if (response.ok) {
            events.value[index] = { ...data }
        }
        return response
    }

    // TODO: complete 'todo' above and remove the method
    const _updateEvent = async (event) => {
        return await fetch(`${API_URL}/update_event`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(event),
            headers: new Headers({
                'Authorization': useUserStore().jwt,
                'Content-type': 'application/json'
            })
        })
    }

    const saveEvent = async (event) => {
        let response = await fetch(`${API_URL}/save_event`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(event),
            headers: new Headers({
                'Authorization': useUserStore().jwt,
                'Content-type': 'application/json'
            })
        })
        if (response.ok) {
            event = _objToEvent(await response.json())
            events.value.push(event)
        }
        return response
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
            if (response.ok) {
                const index = _getEventIndexById(event.id)
                events.value.splice(index, 1)
            }
            return response.ok
        } catch (err) {
            return false
        }
    }

    const saveTask = async (task) => {
        return await fetch(`${API_URL}/save_task`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(task),
            headers: new Headers({
                'Authorization': useUserStore().jwt
            })
        })
    }

    const updateTask = async (task) => {
        return await fetch(`${API_URL}/update_task`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(task),
            headers: new Headers({
                'Authorization': useUserStore().jwt
            })
        })
    }

    const _getEventIndexById = (id) => {
        const idIsEqual = (event) => event.id == id
        return events.value.findIndex(idIsEqual)
    }

    const _getEventById = (id) => {
        const index = _getEventIndexById(id)
        return events.value[index]
    }

    const getEventById = (id) => {
        return readonly(_getEventById(id))
    }

    const getEventCopyById = (id) => {
        const event = _getEventById(id);
        const rawEvent = JSON.parse(JSON.stringify(event))
        return _objToEvent(rawEvent)
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
        }
    })

    return {
        events: computed(() => events.value.map(event => ({ ...event, title: event.name }))),
        refreshing,
        saveEvent,
        saveTask,
        refreshEvents,
        removeEvent,
        updateEventDataByID,
        getEventById,
        getEventCopyById,
        generateNewEvent

    }
})