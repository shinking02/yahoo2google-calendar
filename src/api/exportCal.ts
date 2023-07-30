import express from "express";
import { OAuth2Client } from "googleapis-common";
import { calendar_v3, google } from "googleapis";
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
                const requestBody: calendar_v3.Schema$Event = {
                    summary: event.name,
                    location: event.place,
                    start: {
                        timeZone: "Asia/Tokyo"
                    },
                    end: {
                        timeZone: "Asia/Tokyo"
                    }
                };
                if(event.allDay) {
                    requestBody.start!.date = event.start;
                    requestBody.end!.date = event.end;
                } else {
                    requestBody.start!.dateTime = event.start;
                    requestBody.end!.dateTime = event.end;
                }
                await calendar.events.insert({
                    calendarId: newCalId,
                    requestBody
                })
                console.log(event.name + " is exported to " + calName);
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