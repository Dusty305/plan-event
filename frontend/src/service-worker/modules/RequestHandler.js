import { urlToPathnameSegments } from "@/service-worker/url-utils.js";
import { addEvent, getAllEvents, updateEvent } from "@/service-worker/indexedDB-utils.js";
import { NotImplementedError } from "@/service-worker/exceptions/NotImplementedError.js";

const SERVER_HOST = import.meta.env.VITE_BASE_HOST;

export class RequestHandler {
    constructor(request) {
        this.request = request;
        this.url = new URL(request.url);
        this.urlPathnameSegments = urlToPathnameSegments(this.url);
    }

    async prepareRequestBody() {
        try {
            this.requestBody = await this.request.json();
        } catch (err) {
            this.requestBody = null
        }
        return this.requestBody
    }

    handleRequest() {
        if (this.url.host === SERVER_HOST) {
            return this._handleServerRequest();
        }
        else {
            return this._handleClientRequest();
        }
    }

    _handleServerRequest() {
        console.log('Handling server request');
        if (this.urlPathnameSegments[0] !== 'api') {
            throw new Error('Error parsing server request url. Url has to start with "api/"')
        }
        switch (this.urlPathnameSegments[1]) {
            case 'events':
                return this._handleEventsApiRequest();
            default:
                throw new Error('Error parsing server request url. Wrong api url');
        }
    }

    async _handleEventsApiRequest() {
        switch (this.urlPathnameSegments[2]) {
            case undefined:
                return getAllEvents();
            case 'update_event':
                return updateEvent(this.requestBody);
            case 'save_event':
                return addEvent(this.requestBody);
            default:
                throw new NotImplementedError('API is not defined for ' + this.url.pathname);
        }
    }

    _handleClientRequest() {
        throw new NotImplementedError('Cache is not implemented');
    }
}
