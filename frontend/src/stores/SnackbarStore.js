import {defineStore} from "pinia";
import {computed} from "vue";

export const useSnackbarStore = defineStore("snackbar", () => {
    const _TIMEOUT = 4000
    const _timeoutID = ref(0)
    const _snackbar = ref(false)

    const snackbar = computed(() => _snackbar.value)
    const text = ref('')
    const color = ref('')

    const INFO_COLOR = 'info'
    const SUCCESS_COLOR = 'success'
    const WARNING_COLOR = 'warning'
    const ERROR_COLOR = 'error'

    const showSnackbar = (text, color) => {
        if (text && text instanceof String) {
            text.value = text
        }
        if (color && [INFO_COLOR, SUCCESS_COLOR, WARNING_COLOR, ERROR_COLOR].includes(color)) {
            color.value = color
        }
        if (_timeoutID.value) {
            clearTimeout(_timeoutID.value)
        }
        _snackbar.value = true
        _timeoutID.value = setTimeout(() => {
                _snackbar.value = false
                _timeoutID.value = 0
            },
            _TIMEOUT
        )
    }

    return {
        INFO_COLOR,
        SUCCESS_COLOR,
        WARNING_COLOR,
        ERROR_COLOR,
        snackbar,
        text,
        color,
        showSnackbar
    }
})