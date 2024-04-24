const CACHE_NAME = 'cache-v1'
const PRECACHED_RESOURCES = []

export const preCacheResources = async () => {
    const cache = await caches.open(CACHE_NAME);
    return await cache.addAll(PRECACHED_RESOURCES);
}

// Network first, then cache
export const getStaticResource = async (request) => {
    const fetchPromise = fetch(request).then(async (response) => {
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME)
            return await cache.put(request, response)
        }
        return response;
    });

    return (await fetchPromise) || (await caches.match(request))
}