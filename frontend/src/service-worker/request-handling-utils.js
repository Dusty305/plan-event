import {addEvent, getAllEvents, updateEvent} from "@/service-worker/indexedDB-utils.js";
import {urlToPathnameSegments} from "@/service-worker/url-utils.js";

const SERVER_HOST = import.meta.env.VITE_BASE_HOST

export const handleRequest = (request) => {
    const url = new URL(request.url)
    if (url.host === SERVER_HOST) {
        console.log(request)
        return handleServerRequest(request)
    }
    else {
        return handleClientRequest(request)
    }
}

const handleServerRequest = (request) => {
    const url = new URL(request.url)
    const segments = urlToPathnameSegments(url)
    if (segments[0] !== 'api') {
        throw Error('Error parsing server request url. Url has to start with "api/"')
    }
    switch (segments[1]) {
        case 'events':
            return handleEventsApiRequest(request)
        default:
            throw Error('Error parsing server request url. Wrong api url')
    }
}
const handleEventsApiRequest = async (request) => {
    const body = await request.json()
    const url = new URL(request.url)
    const segments = urlToPathnameSegments(url)
    switch (segments[2]) {
        case undefined:
            return await getAllEvents()
        case 'update_event':
            return await updateEvent(body.event)
        case 'save_event':
            return await addEvent(body.event)
        default:
            throw Error()
    }
}

const handleClientRequest = (request) => {
    throw Error('error')
}