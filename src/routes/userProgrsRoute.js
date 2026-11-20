import express from "express";

import {
    createUserProgrs,
    getAllUserProgress,
    getMyUserProgress,
    getUserProgressById,
    getUserProgressByUser,
    updateUserProgrs
} from "../controllers/userProgrsController.js";

import { verifyToken, verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();


router.post("/", verifyToken, createUserProgrs);
router.get("/get-user-progress", verifyToken, getAllUserProgress);
router.get("/me", verifyToken, getMyUserProgress);
router.get("/user/:userId", verifyToken, getUserProgressByUser);
router.get("/:id", verifyToken, getUserProgressById);
router.put("/:id", verifyToken, updateUserProgrs);

export default router;