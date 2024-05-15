const DB_NAME = 'planevent-db';
const EVENTS_STORE_NAME = 'events';
const VERSION = 1

let db = null
const dbExists = computed(() => db !== null)
const request = self.indexedDB.open(DB_NAME, VERSION)

request.onerror = (event) => {
    console.log('Could not open db', event)
}

request.onsuccess = (event) => {
    db = event.target.result
    db.onerror = (event) => {
        console.log('DB error:', event.target)
    }
}

request.onupgradeneeded = (event) => {
    const db = event.target.result
    db.createObjectStore(EVENTS_STORE_NAME, { keyPath: 'id', autoIncrement: true })
}

const rejectIfDBNonExistent = (reject) => {
    if (!dbExists) {
        const response = new Response('DB was not created', { status: 500 })
        return reject(response)
    }
}

export const getAllEvents = () => new Promise(async (resolve, reject) => {
    rejectIfDBNonExistent(reject)

    const transaction = db.transaction([EVENTS_STORE_NAME], 'readonly');
    const store = transaction.objectStore(EVENTS_STORE_NAME);

    const storeRequest = store.getAll()

    let response
    storeRequest.onsuccess = (event) => {
        const events = event.target.result
        transaction.commit()
        response = new Response(JSON.stringify(events), { status: 200 })
        return resolve(response)
    }
    storeRequest.onerror = () => {
        transaction.abort()
        response = new Response(null, { status: 400 })
        return reject(response)
    }
})

export const addEvent = (event) => new Promise(async (resolve, reject) => {
    rejectIfDBNonExistent(reject)

    const transaction = db.transaction([EVENTS_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(EVENTS_STORE_NAME);
    const storeRequest = store.add(event);

    let response
    storeRequest.onsuccess = (idbEvent) => {
        transaction.commit()
        event.id = idbEvent.target.result
        response = new Response(JSON.stringify(event), { status: 201 })
        return resolve(response)
    }
    storeRequest.onerror = () => {
        transaction.abort()
        response = new Response(null, { status: 400 })
        return reject(response)
    }
})

// Функция для обновления мероприятия
export const updateEvent = (event) => new Promise(async (resolve, reject) => {
    rejectIfDBNonExistent(reject)

    const transaction = db.transaction([EVENTS_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(EVENTS_STORE_NAME);
    const storeRequest = store.put(event)

    let response
    storeRequest.onsuccess = () => {
        transaction.commit()
        response = new Response(null, { status: 201 })
        return resolve(response)
    }
    storeRequest.onerror = () => {
        transaction.abort()
        response = new Response(null, { status: 400 })
        return reject(response)
    }
})

export const removeEvent = (eventId) => new Promise(async (resolve, reject) => {
    rejectIfDBNonExistent(reject)

    const transaction = db.transaction([EVENTS_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(EVENTS_STORE_NAME);
    const deleteRequest = store.delete(eventId)

    let response
    deleteRequest.onsuccess = () => {
        transaction.commit()
        response = new Response(event.id, { status: 200 })
        return resolve(response)
    }
    deleteRequest.onerror = () => {
        transaction.abort()
        response = new Response(null, { status: 400 })
        return reject(response)
    }
})
