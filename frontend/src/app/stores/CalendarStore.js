import "../util/dateUtils.js"
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
    incrementWeek, incrementMonth, incrementYear,
    decrementWeek, decrementMonth, decrementYear,
    dateToWeekString, dateToMonthString, dateToYearString
} from "../util/dateUtils.js";

export const useCalendarStore = defineStore('calendar', () => {
    const INITIAL_CALENDAR_VIEW = 'dayGridMonth'
    const initialDate = new Date()

    //
    // State of calendar's current view
    //

    const viewsMap = {
        'Неделя': 'dayGridWeek',
        'Месяц':  'dayGridMonth',
        'Год':    'multiMonthYear'
    }
    const _view = ref(INITIAL_CALENDAR_VIEW)
    const fullCalendarView = computed(() => _view.value)

    // Sets the new view if it is available
    const setView = (view) => {
        if (!Object.values(viewsMap).includes(view)) {
            return false
        }
        _view.value = view
        return true
    }

    //
    // State of calendar's current date
    //

    const _date = ref(initialDate)
    const date = computed(() => _date.value)
    const dateString = computed(() => {
        switch (_view.value) {
            case 'dayGridWeek': return dateToWeekString(_date.value)
            case 'dayGridMonth': return dateToMonthString(_date.value)
            case 'multiMonthYear': return dateToYearString(_date.value)
        }
    })

    // Increments current date depending on calendar's current view
    const increment = () => {
        switch (_view.value) {
            case 'dayGridWeek':    _date.value = incrementWeek(_date.value);  break;
            case 'dayGridMonth':   _date.value = incrementMonth(_date.value); break;
            case 'multiMonthYear': _date.value = incrementYear(_date.value);  break;
        }
    }
    // Decrements current date depending on calendar's current view
    const decrement = () => {
        switch (_view.value) {
            case 'dayGridWeek':    _date.value = decrementWeek(_date.value);  break;
            case 'dayGridMonth':   _date.value = decrementMonth(_date.value); break;
            case 'multiMonthYear': _date.value = decrementYear(_date.value);  break;
        }
    }

    return {
        INITIAL_CALENDAR_VIEW,
        viewsMap,
        fullCalendarView,
        setView,
        date,
        dateString,
        initialDate,
        increment,
        decrement
    }
})
