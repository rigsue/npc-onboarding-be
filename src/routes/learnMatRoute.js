import express from "express";

import {
    createMats,
    getAllMat,
    getMatByMod,
    getMatById,
    updateMatById,
    updateMatStat
} from "../controllers/learnMatController.js";

import { verifyToken, verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create-material", verifyToken, verifyAdmin, createMats);
router.get("/get-materials", verifyToken, verifyAdmin, getAllMat);
router.get("/:learnModId/by-mod", verifyToken, verifyAdmin, getMatByMod);
router.get("/:learnMatId", verifyToken, verifyAdmin, getMatById);
router.put("/:learnMatId", verifyToken, verifyAdmin, updateMatById);
router.patch("/:learnMatId/status", verifyToken, verifyAdmin, updateMatStat);

export default router;