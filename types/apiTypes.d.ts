export interface ImportCalResponse {
    error: string,
    events: Event[],
    calList: YahooCal[]
}

export interface Event {
    start: string, //YYYYMMDDHHmm
    end: string,
    allDay: boolean,
    name: string,
    place: string,
    calendar: string,
}

export interface YahooCal {
    name: string,
    color: string,
    count: number
}