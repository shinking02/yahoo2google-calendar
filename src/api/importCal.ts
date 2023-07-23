import express from "express";
import { Builder, By, Capabilities, Key, until, WebDriver, WebElement } from "selenium-webdriver";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import * as apiTypes from "../../types/apiTypes";

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
                } else {
                    const dateText = await row.findElement(By.className("list-event-date")).getText();
                    //日付が範囲内か確認する処理ここで　
                    const name = await row.findElement(By.className("list-event-title")).getText();
                    const place = await row.findElement(By.className("list-event-place")).getText();
                    const calElment = await row.findElement(By.className("list-event-cal"));
                    const calColor = await calElment.findElement(By.className("color-border")).getCssValue("border-left-color");
                    const calText = await calElment.getText();
                    if(dateText.includes("終日")) {
                        calData.push({
                            start: "",
                            end: "",
                            allDay: true,
                            name,
                            place,
                            calendar: calText,
                            color: calColor
                        });
                        continue;
                    }
                    const start = pageDate.year().toString() + dateText.slice(0, 2) + dateText.slice(3, 5);
                    console.log(start);
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
