import {defineStore} from "pinia";
import {ref} from "vue";
import {BASE_API_URL} from "../main.js";

const _AUTH_API = 'auth'
const _LOCAL_STORAGE_JWT_KEY = 'jwt'

export const useUserStore = defineStore('user', () => {
    const authorized = ref(false)
    const jwt = computed(() => {
        if (authorized.value) {
            return `Bearer ${localStorage.getItem(_LOCAL_STORAGE_JWT_KEY)}`
        }
    })

    const authorizeUser = async (user) => {
        let response = await fetch(`${BASE_API_URL}/${_AUTH_API}/signin`, {
            method: 'POST',
            body: JSON.stringify(user),
            mode: 'cors',
            headers: new Headers({
                'Content-type': 'application/json;charset=UTF-8'
            })
        })
        if (response.ok) {
            let body = await response.text()
            localStorage.setItem(_LOCAL_STORAGE_JWT_KEY, body)
            authorized.value = true
        }
        return response.ok
    }

    const registerUser = async (user) => {
        let response = await fetch(`${BASE_API_URL}/${_AUTH_API}/signup`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(user),
            headers: new Headers({
                'Content-type': 'application/json;charset=UTF-8'
            })
        })
        return response.ok
    }

    const logoutUser = () => {
        localStorage.removeItem(_LOCAL_STORAGE_JWT_KEY)
        authorized.value = false
    }

    /*
    const validateJWT = async () => {
        const localStorageJWT = localStorage.getItem(_LOCAL_STORAGE_JWT_KEY)
        let response = await fetch(`${BASE_API_URL}/${_AUTH_API}/test`, {
            method: 'GET',
            mode: 'cors',
            headers: new Headers({
                'Authorization': `Bearer ${localStorageJWT}`
            })
        })
        if (response.ok) {
            authorized.value = true
        }
        return response.ok
    }
     */

    const validateJWT = async () => {
        authorized.value = true
        return true
    }


    return {
        authorized: readonly(authorized),
        jwt,
        validateJWT,
        registerUser,
        authorizeUser,
        logoutUser
    }
})
