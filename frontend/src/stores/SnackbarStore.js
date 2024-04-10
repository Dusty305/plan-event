import {defineStore} from "pinia";
import {computed} from "vue";

export const useSnackbarStore = defineStore("snackbar", () => {
    const _TIMEOUT = 4000
    const _timeoutID = ref(0)
    const _snackbar = ref(false)

    const snackbar = computed(() => _snackbar.value)
    const _text = ref('')
    const _color = ref('')

    const INFO_COLOR = 'info'
    const SUCCESS_COLOR = 'success'
    const WARNING_COLOR = 'warning'
    const ERROR_COLOR = 'error'

    const showSnackbar = (text, color) => {
        _text.value = text ? text : _text.value
        _color.value = color ? color : _color.value
        _clearTimeout()

        _snackbar.value = true
        _timeoutID.value = setTimeout(() => {
                _snackbar.value = false
                _timeoutID.value = 0
            },
            _TIMEOUT
        )
    }

    const _clearTimeout = () => {
        if (_timeoutID.value) {
            clearTimeout(_timeoutID.value)
        }
    }

    return {
        INFO_COLOR,
        SUCCESS_COLOR,
        WARNING_COLOR,
        ERROR_COLOR,
        snackbar,
        text: _text,
        color: _color,
        showSnackbar
    }
})