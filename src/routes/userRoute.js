import { Router } from "express";

import {
    createUserControl,
    getUsers,
    getUserById,
    updateUser,
    updatePassword,
    deactivateUser
} from "../controllers/userController.js";

import { 
    verifySuperAdmin, 
    verifyToken 
} from "../middlewares/auth.js";

const router = Router();

router.post("/create-user", verifyToken, verifySuperAdmin, createUserControl);
router.get("/get-users", verifyToken, verifySuperAdmin, getUsers);
router.get("/:id/get-user", verifyToken, verifySuperAdmin, getUserById);
router.put("/:id/update-user", verifyToken, verifySuperAdmin, updateUser)
router.patch("/:id/password", verifyToken, verifySuperAdmin, updatePassword);
router.patch("/:id/deactivate", verifyToken, verifySuperAdmin, deactivateUser);

export default router;