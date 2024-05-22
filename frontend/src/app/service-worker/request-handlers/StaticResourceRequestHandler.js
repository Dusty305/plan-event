import {RequestHandler} from "@/app/service-worker/request-handlers/RequestHandler.js";

const CACHE_NAME = 'cache-v1'

export class StaticResourceRequestHandler extends RequestHandler {
    async handleRequest() {
        let response = null
        try {
            response = await super.handleRequest()
            await this._cacheResponse(response)
            return response
        } catch (e) {
            console.log('SW. StaticResourceRequestHandler error: ', e)
            return response?.ok ? response : await caches.match(this._request)
        }
    }

    async _cacheResponse(response) {
        try {
            const cache = await caches.open(CACHE_NAME)
            await cache.put(this._request, response.clone())
        } catch (e) {
            console.log('SW. Cache error: ', e)
        }
    }
}