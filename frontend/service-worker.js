import { preCacheResources } from "./src/app/service-worker/utils/cache-utils.js";
import { RequestHandler } from "./src/app/service-worker/RequestHandler.js";
import { NotImplementedError } from "./src/app/service-worker/exceptions/NotImplementedError.js";

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
    const handleRequestPromise = handler.handleRequest()
        .catch(err => {
            if (err instanceof NotImplementedError) {
                console.log('SW. Not implemented')
            } else {
                console.log(err)
            }
        })
    event.respondWith(handleRequestPromise)
})
