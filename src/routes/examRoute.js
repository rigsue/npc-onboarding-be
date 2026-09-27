import express from "express";

import {
    createExam,
    getAllExams, 
    getExamByMod,
    getExamById,
    updateExam,
    updatedExamStat
} from "../controllers/examController.js";

import { verifyToken, verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create-exam", verifyToken, verifyAdmin, createExam);
router.get("/get-exam", verifyToken, verifyAdmin, getAllExams);
router.get("/:learnModId", verifyToken, verifyAdmin, getExamByMod);
router.get("/:examId", verifyToken, verifyAdmin, getExamById);
router.put("/:examId", verifyToken, verifyAdmin, updateExam);
router.patch("/:examId/stats", verifyToken, verifyAdmin, updatedExamStat);

export default router;