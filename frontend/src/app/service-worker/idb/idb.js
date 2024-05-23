const DB_NAME = 'planevent-db'
const VERSION = 4
export const EVENTS_STORE_NAME = 'events'
export const TASKS_STORE_NAME = 'tasks'

let db = null
const request = self.indexedDB.open(DB_NAME, VERSION)

request.onerror = (event) => {
    console.log('DB. Could not open db: ', event)
}

request.onsuccess = (event) => {
    db = event.target.result
    db.onerror = (event) => {
        console.log('DB error: ', event.target)
    }
}

request.onupgradeneeded = (event) => {
    const db = event.target.result
    if (!db.objectStoreNames.contains(EVENTS_STORE_NAME)) {
        db.createObjectStore(EVENTS_STORE_NAME, { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains(TASKS_STORE_NAME)) {
        db.createObjectStore(TASKS_STORE_NAME, { keyPath: 'id', autoIncrement: true });
    }
}

const throwIfDBNonExistent = () => {
    if (!db) {
        throw Error('db does not exist') // todo own error
    }
}

const requestObjectStoreMethods = ['getAll', 'get', 'put', 'delete', 'add']
const isRequestObjectStoreMethod = prop => requestObjectStoreMethods.find(method => method === prop) !== undefined

const createObjectStore = (transaction, storeName) => {
    const objectStore = transaction.objectStore(storeName)
    return new Proxy(objectStore, {
        get(target, prop) {
            if (typeof target[prop] !== "function") {
                return target[prop]
            }
            else if (isRequestObjectStoreMethod(prop)) {
                return (...args) => new Promise((resolve, reject) => {
                    const request = target[prop].apply(target, args)
                    request.onsuccess = (event) => {
                        resolve(event.target.result)
                    }
                    request.onerror = (err) => {
                        reject(err)
                    }
                })
            }
        }
    })
}

// Создаёт транзакцию, которая оборачивает функционал ObjectStore в промисы
export const createTransaction = (storeNames, mode) => {
    throwIfDBNonExistent()
    const transaction = db.transaction(storeNames, mode)
    return new Proxy(transaction, {
        get(target, prop) {
            if (prop === 'objectStore') {
                return storeName => createObjectStore(transaction, storeName)
            }
            else {
                const value = target[prop]
                return (typeof value === 'function') ? value.bind(target) : value
            }
        }
    })
}