import express from "express";

import {
    createMats,
    getAllMat,
    getMatByMod,
    getMatById,
    updateMatById,
    updateMatStat
} from "../controllers/learnMatController.js";

import { verifyToken, verifyAdmin, verifyAdminOrSuperadmin } from "../middlewares/auth.js";
import upload from "../middlewares/matUpload.js";

const router = express.Router();
/* 
router.post("/create-material", verifyToken, verifyAdmin, createMats);
router.get("/get-materials", verifyToken, verifyAdmin, getAllMat);
router.get("/:learnModId/by-mod", verifyToken, verifyAdmin, getMatByMod);
router.get("/:learnMatId", verifyToken, verifyAdmin, getMatById);
router.put("/:learnMatId", verifyToken, verifyAdmin, updateMatById);
router.patch("/:learnMatId/status", verifyToken, verifyAdmin, updateMatStat);
 */

router.post(
    "/create-material", 
    verifyToken, 
    verifyAdminOrSuperadmin, 
    upload.array("files", 20), 
    createMats
);
router.get("/get-materials", verifyToken, getAllMat);
router.get("/:learnModId/by-mod", verifyToken, getMatByMod);
router.get("/:learnMatId", verifyToken, verifyAdminOrSuperadmin, getMatById);
router.put("/:learnMatId", verifyToken, verifyAdminOrSuperadmin, updateMatById);
router.patch("/:learnMatId/status", verifyToken, verifyAdminOrSuperadmin, updateMatStat);

export default router;