import { Router } from "express";

import {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deactivateDepartment
} from "../controllers/departmentController.js";

import { 
    verifySuperAdmin,
    verifyToken
 } from "../middlewares/auth.js";

 const router = Router();

 router.post("create-department", verifyToken, verifySuperAdmin, createDepartment);
 router.get("/get-departments", verifyToken, verifySuperAdmin, getAllDepartments);
 router.get("/:id/get-department", verifyToken, verifySuperAdmin, getDepartmentById);
 router.put("/:id/update-department", verifyToken, verifySuperAdmin, updateDepartment);
 router.patch("/:id/deactivate", verifyToken, verifySuperAdmin, deactivateDepartment);

 export default router;