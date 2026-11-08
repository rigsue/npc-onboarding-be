import express from "express";

import {
    createExamAttAnswer,
    getAllExamAttAnswer,
    getExamAttAnsById,
    getExamAttAnsByAtt,
    updateExamAttAnswer
} from "../controllers/examAttAnsController.js";

import { verifyToken, verifyAdmin} from "../middlewares/auth.js";

const router = express.Router();

router.post("/", verifyToken, createExamAttAnswer);
router.get("/get-exam-att-ans", verifyToken, getAllExamAttAnswer);
router.get("/attempt/:attemptId", verifyToken, getExamAttAnsByAtt);
router.get("/:id", verifyToken, getExamAttAnsById);
router.put("/:id", verifyToken, updateExamAttAnswer);

export default router;