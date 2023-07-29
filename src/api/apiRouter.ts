import express from "express";
import importCal from "./importCal";
import exportCal from "./exportCal";

const router = express.Router();

router.post("/importCal", importCal);
router.post("/exportCal", exportCal);

module.exports = router;