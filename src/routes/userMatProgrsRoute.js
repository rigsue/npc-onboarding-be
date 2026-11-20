import express from "express";

import {
    createUserMatProgrs,
    getUserMatProgById,
    getUserMatProgByUser,
    getUserMatProg,
    updateUserMatProgrs,
    getMyMaterialProgress
} from "../controllers/userMatProgrsController.js";

import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", verifyToken, createUserMatProgrs);
router.get("/me", verifyToken, getMyMaterialProgress);
router.get("/user/:userId/material/:learnmatId", verifyToken, getUserMatProg);
router.get("/user/:userId", verifyToken, getUserMatProgByUser);
router.get("/:id", verifyToken, getUserMatProgById);
router.put("/:id", verifyToken, updateUserMatProgrs);

export default router;