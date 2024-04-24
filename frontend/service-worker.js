import { preCacheResources } from "@/service-worker/cache-utils.js";
import { RequestHandler } from "@/service-worker/modules/RequestHandler.js";
import { NotImplementedError } from "@/service-worker/exceptions/NotImplementedError.js";

self.addEventListener('install', (event) => {
    event.waitUntil(preCacheResources())
    console.log('Service worker installed', event)
})

self.addEventListener('activate', (event) => {
    console.log('Service worker active', event)
    return self.clients.claim()
})

self.addEventListener('fetch', (event) => {
    const handler = new RequestHandler(event.request)
    handler.prepareRequestBody().then(() => {
        try {
            event.respondWith(handler.handleRequest())
        } catch (err) {
            if (err instanceof NotImplementedError) {
                console.log('Not implemented')
            } else {
                console.log(err)
            }
        }
    })


})
