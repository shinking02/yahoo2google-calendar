import express from "express";
import { OAuth2Client } from "googleapis-common";
import { google } from "googleapis";
import * as apiTypes from "../../types/apiTypes"

export default async function exportCal(req: express.Request, res: express.Response) {
    const auth = res.locals.oauthClient as OAuth2Client;
    const {events, calList} = req.body;

    try {
        const calendar = google.calendar({version: "v3", auth});
        for(const calName of calList) {
            const newCal = await calendar.calendars.insert({
                requestBody: {
                    summary: calName
                }
            });
            const newCalId = newCal.data.id || "";
            const calEvents = (events as apiTypes.Event[]).filter(e => e.calendar === calName);
            for(const event of calEvents) {
                if(event.allDay) {
                    calendar.events.insert({
                        calendarId: newCalId,
                        requestBody: {
                            summary: event.name,
                            location: event.place,
                            start: {
                                date: event.start,
                                timeZone: "Asia/Tokyo"
                            },
                            end: {
                                date: event.end,
                                timeZone: "Asia/Tokyo"
                            }
                        }
                    })
                } else {
                    calendar.events.insert({
                        calendarId: newCalId,
                        requestBody: {
                            summary: event.name,
                            location: event.place,
                            start: {
                                dateTime: event.start,
                                timeZone: "Asia/Tokyo"
                            },
                            end: {
                                dateTime: event.end,
                                timeZone: "Asia/Tokyo"
                            }
                        }
                    })
                }
                
            }
        }
        res.send({
            error: false,
            message: "エクスポート成功！"
        })
    } catch (error) {
        console.log(error);
        res.send({
            error: true,
            message: "エクスポートエラー"
        })
    }
};