import {ApiRequestHandler} from "@/app/service-worker/request-handlers/ApiRequestHandler.js";
import {StaticResourceRequestHandler} from "@/app/service-worker/request-handlers/StaticResourceRequestHandler.js";
import {RequestHandler} from "@/app/service-worker/request-handlers/RequestHandler.js";

const SERVER_HOST = import.meta.env.VITE_BASE_HOST;
const CLIENT_HOST = import.meta.env.VITE_CLIENT_HOST;

export const buildRequestHandler = (request) => {
    const url = new URL(request.url)
    const urlSegments = url.pathname.split('/').slice(1)
    if (url.host === SERVER_HOST && urlSegments[0] === 'api') {
        return new ApiRequestHandler(request)
    }
    else if (url.host === CLIENT_HOST) {
        return new StaticResourceRequestHandler(request)
    }
    else {
        return new RequestHandler(request)
    }
}