import { addEvent, getAllEvents, updateEvent } from "@/app/service-worker/utils/indexedDB-utils.js";
import { NotImplementedError } from "@/app/service-worker/exceptions/NotImplementedError.js";
import {getStaticResource} from "@/app/service-worker/utils/cache-utils.js";

const SERVER_HOST = import.meta.env.VITE_BASE_HOST;

export class RequestHandler {
    constructor(request) {
        this.request = request;
        this.url = new URL(request.url);
        this.urlPathnameSegments = this.url.pathname.split('/').slice(1)
    }

    async handleRequest() {
        await this._prepareRequestBody()
        if (this.url.host === SERVER_HOST) {
            return await this._handleServerRequest();
        }
        else {
            return await this._handleClientRequest();
        }
    }

    async _prepareRequestBody() {
        try {
            this.requestBody = await this.request.json();
        } catch (err) {
            this.requestBody = null
        }
        return this.requestBody
    }

    _handleServerRequest() {
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
        return getStaticResource(this.request);
    }
}
