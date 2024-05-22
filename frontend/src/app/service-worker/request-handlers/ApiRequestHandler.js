import {RequestHandler} from "@/app/service-worker/request-handlers/RequestHandler.js";
import {NotImplementedError} from "@/app/service-worker/exceptions/NotImplementedError.js";
import {
    addEvent,
    addTask,
    getAllEvents,
    removeEvent, removeTask,
    updateEvent,
    updateTask
} from "@/app/service-worker/idb/events-service.js";


export class ApiRequestHandler extends RequestHandler {
    async handleRequest() {
        try {
            return await super.handleRequest()
        } catch (e) {
            this._prepareUrlSegments()
            const requestHandlerPromise = this._deduceApiHandler()
            return await requestHandlerPromise
        }
    }

    _prepareUrlSegments() {
        const url = new URL(this._request.url)
        this._urlSegments = url.pathname.split('/').slice(1)
        return this._urlSegments
    }

    _deduceApiHandler() {
        switch(this._urlSegments[1]) {
            case 'events':
                return this._deduceEventsApiHandler()
            default:
                throw new Error('Error parsing server request url. Wrong api url');
        }
    }

    _deduceEventsApiHandler() {
        switch (this._urlSegments[2]) {
            case undefined:
                return getAllEvents();
            case 'save_event':
                return addEvent(this.requestBody)
            case 'update_event':
                return updateEvent(this.requestBody)
            case 'remove_event':
                return removeEvent(this.requestBody)
            case 'save_task':
                return addTask(this.requestBody)
            case 'update_task':
                return updateTask(this.requestBody)
            case 'remove_task':
                return removeTask(this.requestBody)
            default:
                throw new NotImplementedError('API is not defined for ' + this.url.pathname);
        }
    }
}