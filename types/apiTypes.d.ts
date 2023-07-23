export interface ImportCalResponse {
    error: string,
    events: Event[]
}

export interface Event {
    start: string, //YYYYMMDDHHmm
    end: string,
    allDay: boolean,
    name: string,
    place: string,
    calendar: string,
    color: string
}