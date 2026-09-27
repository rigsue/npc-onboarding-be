import express from "express";

import {
    createUserMatProgrs,
    getUserMatProgById,
    getUserMatProgByUser,
    getUserMatProg,
    updateUserMatProgrs
} from "../controllers/userMatProgrsController.js";

import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", verifyToken, createUserMatProgrs);
router.get("/:id", verifyToken, getUserMatProgById);
router.get("/user/:userId", verifyToken, getUserMatProgByUser);
router.get("/user/:userId/material/:learnmatId", verifyToken, getUserMatProg);
router.put("/:id", verifyToken, updateUserMatProgrs);

export default router;