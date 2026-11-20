import express from "express";

import {
    makeNotif,
    getNotifById,
    getMyNotifs,
    markNotifyAsRead,
    getNotifUnreadCount
} from "../controllers/notifController.js";

import { verifyToken, verifyAdminOrSuperadmin} from "../middlewares/auth.js";

const router = express.Router();

router.post("/create-notif", verifyToken, verifyAdminOrSuperadmin, makeNotif);
router.get("/:id/notif", verifyToken, getNotifById);
router.get("/notifications", verifyToken, getMyNotifs);
router.patch("/:id/read", verifyToken, markNotifyAsRead);
router.get("/notif/unread-count", verifyToken, getNotifUnreadCount);

export default router;