const CACHE_NAME = 'cache-v1'
const PRECACHED_RESOURCES = []

async function preCacheResources() {
    const cache = await caches.open(CACHE_NAME);
    return await cache.addAll(PRECACHED_RESOURCES);
}

window.addEventListener('install', () => {
    event.waitUntil(preCacheResources())
})

window.addEventListener('fetch', (event) => {
    try {
        event.respondWith(handleRequest(event.request))
    } catch (err) {
        // Что-то сделать, в зависимости от того, кем эта ошибка была проброшена
    }
})

const handleRequest = () => {

}

