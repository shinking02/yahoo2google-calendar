export interface ImportResponse {
    error: boolean;
    message: string;
    events: Event[];
    calList: YahooCal[];
}

export interface ExportResponse {
    error: boolean;
    message: string;
}
export interface LoginStatus {
    isLogin: boolean;
    email: string;
    iconPath: string;
}
export interface Event {
    start: string; //YYYYMMDDHHmm
    end: string;
    allDay: boolean;
    name: string;
    place: string;
    calendar: string;
}

export interface YahooCal {
    name: string;
    color: string;
    count: number;
}