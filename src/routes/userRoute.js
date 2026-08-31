import { Router } from "express";

import {
    createUserControl,
    getUsers,
    getUserById,
    updateUser,
    updatePassword,
    deactivateUser
} from "../controllers/userController.js";

import { verifySuperAdmin, verifyAdmin, verifyToken } from "../middlewares/auth.js";

const router = Router();

router.post("/create_user", verifyToken, verifySuperAdmin, createUserControl);
router.get("/get_user", verifyToken, getUsers);
router.get("/get_user_byid", verifyToken, getUserById);
router.put("/update_user", verifyToken, updateUser)
router.patch("/:id/password", verifyToken, updatePassword);
router.patcu("/:id/deactivate", verifyToken, deactivateUser);

export default router;