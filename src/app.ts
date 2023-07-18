import express from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use("/client/build", express.static(path.resolve(__dirname, "..", "client/build")));
app.use("/public", express.static(path.resolve(__dirname, "..", "public")));
app.get("/", (_, res) => {
    res.sendFile(path.resolve(__dirname, "..", "public", "index.html"));
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`http://localhost:${port}`)
})


