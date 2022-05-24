export function getFormattedDateTime (date){
    const dateObj = new Date(date)
    return dateObj.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false
        })    
}

export function DateToHoursAndMinutes(datestring) {
    const date = new Date(datestring)
    return date.toLocaleTimeString().slice(0, 5)
}