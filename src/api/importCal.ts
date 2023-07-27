import express from "express";
import { Builder, By, Capabilities, Key, until, WebDriver, WebElement } from "selenium-webdriver";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import * as apiTypes from "../../types/apiTypes";
import { HotModuleReplacementPlugin } from "webpack";

export default async function importCal(req: express.Request, res: express.Response) {
    const { from, to } = req.body;
    const capabilities: Capabilities = Capabilities.chrome();
    capabilities.set("chromeOptions", {
        args: [
            '--window-size=1920,1080'
        ],
        w3c: false
    });
    const driver: WebDriver = await new Builder().withCapabilities(capabilities).build();
    dayjs.extend(customParseFormat);
    try {
        await driver.get("https://login.yahoo.co.jp/config/login?.src=yc&.done=https%3A%2F%2Fcalendar.yahoo.co.jp%2F");
        const listButton = await driver.wait(until.elementLocated(By.className("js-ToolBar__viewList--list")), 120000);
        await listButton.click();
        const prevButton = await driver.findElement(By.className("bc-button-prev"));
        const now = dayjs();
        const clickCount = (now.year() - dayjs(from).year()) * 12 + now.month() - dayjs(from).month();
        const calData: apiTypes.Event[] = [];
        for(let i = 0; i < clickCount + 1; i++) {
            const ym = await driver.findElement(By.className("month")).getText();
            const mIndex = ym.indexOf("月");
            const pageDate = dayjs(ym.slice(0, mIndex + 1), "YYYY年M月");
            if(pageDate.isAfter(to)) {
                await prevButton.click();
                continue;
            }
            const tBody = await driver.findElement(By.className("list-tbody"));
            const rows = await tBody.findElements(By.className("list-row"));
            let startDate: string = ""; // MMDD
            for(const row of rows) {
                const className = await row.getAttribute("class");
                if(!className.includes("list-event-detail")) {
                    const md = await row.findElement(By.className("row-date")).getText();
                    const dateArr = md.split(/\s|\//);
                    startDate = dateArr[0].padStart(2, '0') + dateArr[1].padStart(2, '0');
                    const startDayjs = dayjs(pageDate.year().toString() + startDate, "YYYYMMDD");
                    if(startDayjs.isAfter(to) || dayjs(from).isAfter(startDate)) { //日付単位の範囲はここで制限
                        continue;
                    }
                } else {
                    const dateText = await row.findElement(By.className("list-event-date")).getText();
                    const name = await row.findElement(By.className("list-event-title")).getText();
                    const place = await row.findElement(By.className("list-event-place")).getText();
                    const calElment = await row.findElement(By.className("list-event-cal"));
                    const calColor = await calElment.findElement(By.className("color-border")).getCssValue("border-left-color");
                    const calText = await calElment.getText();
                    if(dateText.includes("終日")) {
                        calData.push({
                            start: pageDate.year().toString() + startDate + "----",
                            end: "",
                            allDay: true,
                            name,
                            place,
                            calendar: calText,
                            color: calColor
                        });
                        continue;
                    }
                    const eventStart = pageDate.year().toString() + startDate + dateText.slice(0, 2) + dateText.slice(3, 5);
                    const eventEnd = (() => {
                        const timeRegex = /(\d{2}:\d{2})/g;
                        const timeMatches = dateText.slice(5).match(timeRegex);
                        if(dateText.length > 16) {
                            const dateRegex = /(\d{1,2}\/\d{1,2})/g;
                            const dateMatches = dateText.match(dateRegex);
                            if(dateMatches && dateMatches.length && timeMatches && timeMatches.length) {
                                const [month, day] = dateMatches[0].split("/");
                                const [hour, minute] = timeMatches[0].split(":")
                                const endDate = month.padStart(2, "0") + day.padStart(2, "0");
                                const endString = pageDate.year().toString() + endDate + hour + minute;
                                if(Number(endString) - Number(eventStart) < 0) {
                                    return pageDate.add(1, "year").year().toString() + endDate + hour + minute;
                                }
                                return endString;
                            }
                        }
                        if(timeMatches && timeMatches.length) {
                            const [hour, minute] = timeMatches[0].split(":")
                            return pageDate.year() + startDate + hour + minute;
                        }
                        return "";
                    })();
                    calData.push({
                        start: eventStart,
                        end: eventEnd,
                        place,
                        name,
                        calendar: calText,
                        color: calColor,
                        allDay: false
                    });
                }
            }
            await prevButton.click();
        }
        await driver.close();
        res.json(calData);
    } catch(error) {
        console.log(error);
        res.json({
            error: "seleniumでエラーが発生しました"
        })
    }
}
