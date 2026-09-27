import express from "express";

import {
    makeNotif,
    getNotifById,
    getMyNotifs,
    markNotifyAsRead
} from "../controllers/notifController.js";

import { verifyToken, verifyAdminOrSuperadmin} from "../middlewares/auth.js";

const router = express.Router();

router.post("/create-notif", verifyToken, verifyAdminOrSuperadmin, makeNotif);
router.get("/:id", verifyToken, getNotifById);
router.get("/notifications", verifyToken, getMyNotifs);
router.patch("/:id/read", verifyToken, markNotifyAsRead);

export default router;