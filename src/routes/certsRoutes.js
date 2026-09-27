import express from "express";

import {
    makeCert,
    getCertById,
    verifyCert,
    getCertsByUserProgress,
    revokeCertificate
} from "../controllers/certsController.js";

import { verifyToken, verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create-cert", verifyToken, verifyAdmin, makeCert);
router.get("/:id", verifyToken, getCertById);
router.get("/:certNumber", verifyCert);
router.get("/:userProgressId", verifyToken, getCertsByUserProgress);
router.patch("/:id/revoke", verifyToken, verifyAdmin, revokeCertificate);

export default router;