import express from "express";
import google from "googleapis";

export default async function exportCal(req: express.Request, res: express.Response) {
    setTimeout(() => {
        res.send({
            error: false,
            message: "エクスポート成功!"
        });
    }, 2000);
};