import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { google } from "googleapis";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;
const childProc = require("child_process");
const isWindows = process.platform === "win32";
const apiRoutes = require("./api/apiRouter");
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
);

app.use(cookieParser());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.json());
app.use("/client/build", express.static(path.resolve(__dirname, "..", "client/build")));
app.use("/public", express.static(path.resolve(__dirname, "..", "public")));

app.get("/auth", (_req, res) => {
    const authorizeUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"],
        prompt: "consent"
    });
    res.redirect(authorizeUrl);
});
app.get("/auth/callback", async(req: express.Request, res: express.Response) => {
    const code = req.query.code as string;
    const tokens = (await oauth2Client.getToken(code)).tokens;
    oauth2Client.setCredentials(tokens);
    res.cookie("access_token", tokens.access_token, {
        maxAge: 3600000,
        httpOnly: false
    });
    res.cookie("refresh_token", tokens.refresh_token, {
        maxAge: 3600000,
        httpOnly: false
    });
    res.redirect("/");
});
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if(!req.cookies["access_token"] || !req.cookies["refresh_token"]) {
        res.redirect("/auth");
        return;
    }
    oauth2Client.setCredentials({
        access_token: req.cookies["access_token"],
        refresh_token: req.cookies["refresh_token"]
    });
    res.locals.oauthClient = oauth2Client;
    next();
}
app.use("/api", authMiddleware, apiRoutes);

app.get("/", (_req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "public", "index.html"));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`http://localhost:${port}`)
    if (isWindows) {
        childProc.exec(`start "" "http://localhost:${port}"`);
    } else {
        childProc.exec(`open -a "Google Chrome" "http://localhost:${port}"`);
    }
});
