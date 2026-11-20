import express from "express";

import {
    refreshSession, 
    logoutSession, 
    logoutAllSessions, 
    getActiveSessions,
    revokeSession
} from "../controllers/userSessionController.js"

import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/refresh", refreshSession);

router.post("/logout", verifyToken, logoutSession);

router.post("/logout-all", verifyToken, logoutAllSessions);

router.get("/active", verifyToken, getActiveSessions);

router.delete("/:sessionId", verifyToken, revokeSession);

export default router;