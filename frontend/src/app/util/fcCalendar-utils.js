import {useEventsStore} from "@/app/stores/EventsStore.js";

const _getEventIdFromFcEventId = fcEventId => +fcEventId.split(' ')[0]
const _getTaskIdFcEventId = fcEventId => +fcEventId.split(' ')[1]

const _eventToFcEvent = event => ({
    ...event,
    id: `${event.id}`,
    title: event.name,
    tasks: undefined
})

const _taskToFcEvent = task => ({
    ...task,
    id: `${task.eventId} ${task.id}`,
    title: task.name
})

export const eventsToFullCalendarEvents = events => {
    return events.reduce((fcEvents, event) => {
        const tasks = event.tasks.map(_taskToFcEvent)
        event = _eventToFcEvent(event)
        return fcEvents.concat(tasks.concat(event))
    }, [])
}

export const isTaskByFcEventId = fcEventId => !isNaN(_getTaskIdFcEventId(fcEventId))

export const getEventByFcEventId = fcEventId => {
    const eventsStore = useEventsStore()
    const eventId = _getEventIdFromFcEventId(fcEventId)
    return eventsStore.getEventById(eventId)
}

export const getTaskByFcEventId = fcEventId => {
    const eventsStore = useEventsStore()
    const eventId = _getEventIdFromFcEventId(fcEventId)
    const taskId = _getTaskIdFcEventId(fcEventId)
    const event = eventsStore.getEventById(eventId)
    return eventsStore.getTaskByIdAndEvent(taskId, event)
}