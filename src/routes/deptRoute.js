import { Router } from "express";

import {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deactivateDepartment
} from "../controllers/deptController.js";

import { 
    verifySuperAdmin,
    verifyToken
 } from "../middlewares/auth.js";

 const router = Router();

 router.post("create-department", verifyToken, verifySuperAdmin, createDepartment);
 router.get("/get-departments", verifyToken, verifySuperAdmin, getAllDepartments);
 router.get("/:department_id", verifyToken, verifySuperAdmin, getDepartmentById);
 router.put("/:department_id", verifyToken, verifySuperAdmin, updateDepartment);
 router.patch("/:department_id/deactivate", verifyToken, verifySuperAdmin, deactivateDepartment);

 export default router;