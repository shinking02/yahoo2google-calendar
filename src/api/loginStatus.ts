import express from "express";
import { google } from "googleapis";
import { OAuth2Client } from "googleapis-common";

export default async function loginStatus(req: express.Request, res: express.Response) {
    const auth = res.locals.oauthClient as OAuth2Client;
    try {
        const userInfo = await google.oauth2("v2").userinfo.get({auth});
        res.send({
            isLogin: true,
            email: userInfo.data.email,
            iconPath: userInfo.data.picture
        })
    } catch (error) {
        console.log(error);
        res.send({
            isLogin: false,
            email: "",
            iconPath: ""
        })
    }
};