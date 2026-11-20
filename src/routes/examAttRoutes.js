import express from "express";

import {
    makeExamAtt,
    getAllExamAtt,
    getExamAttById,
    getExamAttByUserProgress,
    updateExamAttResult,
    updateExamAttStatus,
    closeExamAttempt
} from "../controllers/examAttController.js";

import { verifyToken, verifyAdmin, verifyAdminOrSuperadmin} from "../middlewares/auth.js";

const router = express.Router();

router.post("/", verifyToken, makeExamAtt);
router.get("/get-all-ex-att", verifyToken, getAllExamAtt);
router.get("/:id", verifyToken, getExamAttById);
router.get("/progress/:userProgressId", verifyToken, getExamAttByUserProgress);
router.put("/:id/result", verifyToken, verifyAdminOrSuperadmin, updateExamAttResult);
router.patch("/:id/stats", verifyToken, updateExamAttStatus);
router.patch("/:id/close", verifyToken, closeExamAttempt);
/* router.put("/:id/result", verifyToken, verifyAdmin, updateExamAttResult);
router.patch("/:id/stats", verifyToken, verifyAdmin, updateExamAttStatus); */

export default router;