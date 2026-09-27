import express from "express";

import {
    makeChoice,
    getAllChoices,
    getChoicesByQues,
    getChoiceById,
    updateChoice,
    updateChoiceStatus
} from "../controllers/choiceController.js";

import {verifyToken, verifyAdmin} from "../middlewares/auth.js";

const router = express.Router();

router.post("/create-choices", verifyToken, verifyAdmin, makeChoice);
router.get("/get-choice", verifyToken, getAllChoices);
router.get("/question/:questionId", verifyToken, getChoicesByQues);
router.get("/:id",verifyToken, getChoiceById);
router.put("/:id", verifyToken, verifyAdmin, updateChoice);
router.patch("/:id/status", verifyToken, verifyAdmin, updateChoiceStatus);

export default router;