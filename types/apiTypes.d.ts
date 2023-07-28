export interface ImportCalResponse {
    error: string,
    events: Event[],
    googleCal: GoogleCal[]
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

export interface GoogleCal {
    name: string,
    id: string
}