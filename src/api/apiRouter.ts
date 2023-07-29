import express from "express";
import importCal from "./importCal";
import exportCal from "./exportCal";
import loginStatus from "./loginStatus";
const router = express.Router();

router.post("/importCal", importCal);
router.post("/exportCal", exportCal);
router.post("/loginStatus", loginStatus);

module.exports = router;