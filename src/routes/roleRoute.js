import { Router } from "express";

import {
    getRoles,
    getRoleById
} from "../controllers/roleController.js";

import { 
    // verifySuperAdmin, 
    // verifyAdmin, 
    verifyAdminOrSuperadmin,
    verifyToken 
} from "../middlewares/auth.js";

const router = Router();
/* 
router.get("/get-role", verifyToken, verifyAdmin, verifySuperAdmin, getRoles);
router.get("/:id/roles", verifyToken, verifyAdmin, verifySuperAdmin, getRoleById);
 */
router.get("/get-role", verifyToken, verifyAdminOrSuperadmin, getRoles);
router.get("/:id/roles", verifyToken, verifyAdminOrSuperadmin, getRoleById);
export default router;