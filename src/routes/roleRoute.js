import { Router } from "express";

import {
    getRoles,
    getRoleById
} from "../controllers/roleController.js";

import { 
    verifySuperAdmin, 
    verifyAdmin, 
    verifyToken 
} from "../middlewares/auth.js";

const router = Router();

router.get("/get-role", verifyToken, verifyAdmin, verifySuperAdmin, getRoles);
router.get("/:id/roles", verifyToken, verifyAdmin, verifySuperAdmin, getRoleById);

export default router;