import express from "express";
import importCal from "./importCal";

const router = express.Router();

router.post("/importCal", importCal);

module.exports = router;