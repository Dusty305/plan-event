
//
// Date to string
//
export const dateToWeekString = (date) => {
    return date.getFullYear() + ', ' + Math.ceil(date.getDay() / 7).toString() + ' неделея'
}
export const dateToMonthString = (date) => {
    let options = { month: 'short' }
    if (new Date().getFullYear() !== date.getFullYear()) {
        options.year = 'numeric'
    }
    return date.toLocaleDateString('ru', options)
}
export const dateToYearString = (date) => {
    return date.toLocaleDateString('ru', { year: 'numeric' })
}

//
// Increment/decrement date by week/month/year
//
export const incrementYear = (date) => {
    date.setFullYear(date.getFullYear() + 1)
    return new Date(date)
}
export const incrementMonth = (date) => {
    if (date.getMonth() === 11) {
        date.setFullYear(date.getFullYear() + 1)
        date.setMonth(0)
    }
    else {
        date.setMonth(date.getMonth() + 1)
    }
    return new Date(date)
}
export const incrementWeek = (date) => {
    date.setDate(date.getDate() + 7)
    return new Date(date)
}
export const decrementYear = (date) => {
    date.setFullYear(date.getFullYear() - 1)
    return new Date(date)
}
export const decrementMonth = (date) => {
    if (date.getMonth() === 0) {
        date.setFullYear(date.getFullYear() - 1)
        date.setMonth(11)
    }
    else {
        date.setMonth(date.getMonth() - 1)
    }
    return new Date(date)
}
export const decrementWeek = (date) => {
    date.setDate(date.getDate() - 7)
    return new Date(date)
}