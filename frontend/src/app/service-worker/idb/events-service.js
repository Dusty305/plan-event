import {createTransaction, EVENTS_STORE_NAME, TASKS_STORE_NAME} from "@/app/service-worker/idb/idb.js";

export const getAllEvents = async () => {
    const transaction = createTransaction([EVENTS_STORE_NAME, TASKS_STORE_NAME], 'readonly')
    try {
        const events = await transaction.objectStore(EVENTS_STORE_NAME).getAll()
        const tasks = await transaction.objectStore(TASKS_STORE_NAME).getAll()

        for (const task of tasks) {
            const event = events.find(event => event.id === task.eventId)
            if (!event.tasks) {
                event.tasks = []
            }
            event.tasks.push(task)
        }

        transaction.commit()
        return new Response(JSON.stringify(events), { status: 200 })
    } catch (err) {
        transaction.abort()
        return new Response(err, { status: 400 })
    }
}

export const addEvent = async (event) => {
    const transaction = createTransaction([EVENTS_STORE_NAME, TASKS_STORE_NAME], 'readwrite')
    try {
        const store = transaction.objectStore(EVENTS_STORE_NAME)
        event.id = await store.add(event)
        transaction.commit()
        return new Response(JSON.stringify(event.id), { status: 201 })
    }
    catch (err) {
        transaction.abort()
        return new Response(err, { status: 400 })
    }
}

export const updateEvent = async (event) => {
    const transaction = createTransaction([EVENTS_STORE_NAME], 'readwrite')
    try {
        const store = transaction.objectStore(EVENTS_STORE_NAME)
        await store.put(event)
        transaction.commit()
        return new Response(null, { status: 201 })
    }
    catch (err) {
        transaction.abort()
        return new Response(JSON.stringify(err), { status: 400 })
    }
}

export const removeEvent = async (eventId) => {
    const transaction = createTransaction([EVENTS_STORE_NAME, TASKS_STORE_NAME], 'readwrite')
    try {
        const tasksStore = transaction.objectStore(TASKS_STORE_NAME)
        const tasks = await tasksStore.getAll()
        for (const task of tasks) {
            if (task.eventId === eventId) {
                await tasksStore.delete(task.id)
            }
        }

        const eventsStore = transaction.objectStore(EVENTS_STORE_NAME)
        await eventsStore.delete(eventId)

        transaction.commit()
        return new Response(JSON.stringify(eventId), { status: 201 })
    }
    catch (err) {
        transaction.abort()
        return new Response(JSON.stringify(err), { status: 400 })
    }
}

export const addTask = async (task) => {
    const transaction = createTransaction([TASKS_STORE_NAME], 'readwrite')
    try {
        const store = transaction.objectStore(TASKS_STORE_NAME)
        task.id = await store.add(task)
        transaction.commit()
        return new Response(JSON.stringify(task.id), { status: 201 })
    }
    catch (err) {
        transaction.abort()
        return new Response(JSON.stringify(err), { status: 400 })
    }
}

export const updateTask = async (task) => {
    const transaction = createTransaction([TASKS_STORE_NAME], 'readwrite')
    try {
        const store = transaction.objectStore(TASKS_STORE_NAME)
        await store.put(task)
        transaction.commit()
        return new Response(null, { status: 201 })
    }
    catch (err) {
        transaction.abort()
        return new Response(JSON.stringify(err), { status: 400 })
    }
}

export const removeTask = async (taskId) => {
    const transaction = createTransaction([TASKS_STORE_NAME], 'readwrite')
    try {
        const store = transaction.objectStore(TASKS_STORE_NAME)
        await store.delete(taskId)
        transaction.commit()
        return new Response(JSON.stringify(taskId), { status: 200 })
    }
    catch (err) {
        transaction.abort()
        return new Response(JSON.stringify(err), { status: 400 })
    }
}