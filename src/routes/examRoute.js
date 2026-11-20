import express from "express";

import {
    createExam,
    getAllExams, 
    getExamByMod,
    getExamById,
    updateExam,
    updatedExamStat
} from "../controllers/examController.js";

import { verifyToken, verifyAdmin, verifyAdminOrSuperadmin } from "../middlewares/auth.js";

const router = express.Router();
/* 
router.post("/create-exam", verifyToken, verifyAdmin, createExam);
router.get("/module/:learnModId", verifyToken, verifyAdmin, getExamByMod);
router.get("/:examId", verifyToken, verifyAdmin, getExamById);
router.put("/:examId", verifyToken, verifyAdmin, updateExam);
router.patch("/:examId/stats", verifyToken, verifyAdmin, updatedExamStat);
 */
router.post("/create-exam", verifyToken, verifyAdminOrSuperadmin, createExam);
router.get("/get-exams", verifyToken, getAllExams);
router.get("/module/:learnModId", verifyToken, getExamByMod);
router.get("/:examId/get-exam", verifyToken, getExamById);
router.put("/:examId", verifyToken, verifyAdminOrSuperadmin, updateExam);
router.patch("/:examId/stats", verifyToken, verifyAdminOrSuperadmin, updatedExamStat);

export default router;