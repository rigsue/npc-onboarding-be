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

router.get("/", verifyToken, verifyAdmin, verifySuperAdmin, getRoles);
router.get("/", verifyToken, verifyAdmin, verifySuperAdmin, getRoleById);

export default router;