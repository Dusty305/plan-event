const CACHE_NAME = 'cache-v1'
const PRECACHED_RESOURCES = []

export const preCacheResources = async () => {
    const cache = await caches.open(CACHE_NAME);
    return await cache.addAll(PRECACHED_RESOURCES);
}