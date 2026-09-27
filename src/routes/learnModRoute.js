import express from "express";

import {
    createMod,
    getAllMods,
    getModsById,
    updateModule,
    updateModStat
} from "../controllers/learnModController.js";

import { verifyToken, verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create-module", verifyToken, verifyAdmin, createMod);
router.get("/get-modules", verifyToken, verifyAdmin, getAllMods);
router.get("/:learnModId", verifyToken, verifyAdmin, getModsById);
router.put("/:learnModId", verifyToken, verifyAdmin, updateModule);
router.patch("/:learnModId/status", verifyToken, verifyAdmin, updateModStat);

export default router;