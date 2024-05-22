import { buildRequestHandler } from "@/app/service-worker/index.js";

self.addEventListener('install', (event) => {
    console.log('Service worker installed', event)
})

self.addEventListener('activate', (event) => {
    console.log('Service worker active', event)
    return self.clients.claim()
})

self.addEventListener('fetch', (event) => {
    const requestHandler = buildRequestHandler(event.request)
    event.respondWith(requestHandler.handleRequest())
})

