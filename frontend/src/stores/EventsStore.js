import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {BASE_API_URL} from "../main.js";
import {useUserStore} from "./UserStore.js";
import {incrementWeek} from "../util/dateUtils.js";

const _EVENTS_API = 'events'

export const useEventsStore = defineStore("events", () => {
    const events = ref([])
    const refreshing = ref(false)

    const refreshEvents = async () => {
        refreshing.value = true
        let response = await fetch(`${BASE_API_URL}/${_EVENTS_API}`, {
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
        refreshing.value = false
        console.log(events.value)
        return response
    }

    const _objToEvent = (event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
    })

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

    const _updateEvent = async (event) => {
        return await fetch(`${BASE_API_URL}/${_EVENTS_API}/update_event`, {
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
        let response = await fetch(`${BASE_API_URL}/${_EVENTS_API}/save_event`, {
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
        return await fetch(`${BASE_API_URL}/save_task`, {
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
