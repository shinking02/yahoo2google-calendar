import express from "express";
import google from "googleapis";

export default async function exportCal(req: express.Request, res: express.Response) {
    setTimeout(() => {
        res.send({
            error: true,
            message: "未実装です"
        });
    }, 2000);
};