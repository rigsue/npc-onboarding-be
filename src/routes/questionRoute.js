import express from "express";

import {
    makeQuestion,
    getAllQuestions,
    getQuesByExam,
    getQuesById,
    updateQuestion,
    updateQuesStat
} from "../controllers/questionController.js";

import { verifyToken, verifyAdmin } 
from "../middlewares/auth.js";

const router = express.Router();

router.post("/create-question", verifyToken, verifyAdmin, makeQuestion);
router.get("/get-question", verifyToken, getAllQuestions);
router.get("/exam/:examId", verifyToken, getQuesByExam);
router.get("/:id", verifyToken, getQuesById);
router.put("/:id", verifyToken, verifyAdmin, updateQuestion);
router.patch("/:id/status", verifyToken, verifyAdmin, updateQuesStat);

export default router;