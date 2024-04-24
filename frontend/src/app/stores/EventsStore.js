import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {BASE_API_URL} from "../../main.js";
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
            method: 'GET',
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
            events.value.push(event)
        }
        return response
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
        const event = _getEventById();
        return JSON.parse(JSON.stringify(event))
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
        updateEventDataByID,
        getEventById,
        getEventCopyById,
        generateNewEvent

    }
})

/*

//
// Store for GH Pages
//

export const useEventsStore = defineStore("events", () => {
    const events = ref([])
    const refreshing = ref(false)

    const refreshEvents = async () => {
        refreshing.value = true
        const eventsStr = localStorage.getItem('events')
        if (!eventsStr) {
            events.value = []
            _loadEventsToLocalStorage()
        }
        else {
            events.value = JSON.parse(eventsStr).map(_objToEvent)
        }
        refreshing.value = false
        console.log(events.value)
        return true
    }

    const updateEventDataByID = async (id, data) => {
        const index = _getEventIndexById(id)
        if (index === -1 || !data) {
            return false
        }
        events.value[index] = { ...data }
        _loadEventsToLocalStorage()
        return true
    }

    const saveEvent = async (event) => {
        events.value.push(event)
        _loadEventsToLocalStorage()
        return true
    }

    const generateNewEvent = () => ({
        id: _generateId(),
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

    const getEventById = (id) => readonly(_getEventById(id))

    const getEventCopyById = (id) => _objToEvent(JSON.parse(JSON.stringify(_getEventById(id))))

    const _generateId = () => {
        const l = events.value.length
        return l > 0 ? events.value[l - 1].id + 1 : 0
    }

    const _loadEventsToLocalStorage = () => localStorage.setItem('events', JSON.stringify(events.value))

    const _getEventIndexById = (id) => events.value.findIndex((event) => event.id == id)

    const _getEventById = (id) => events.value[_getEventIndexById(id)]

    const _objToEvent = (event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
    })

    return {
        events: computed(() => events.value.map(event => ({ ...event, title: event.name }))),
        refreshing,
        saveEvent,
        refreshEvents,
        updateEventDataByID,
        getEventById,
        getEventCopyById,
        generateNewEvent

    }
})
*/