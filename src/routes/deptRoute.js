import { Router } from "express";

import {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    activateDepartment,
    deactivateDepartment
} from "../controllers/deptController.js";

import { 
    verifySuperAdmin, verifyToken
 } from "../middlewares/auth.js";

 const router = Router();

 router.post("/create-department", verifyToken, verifySuperAdmin, createDepartment);
 router.get("/get-departments", verifyToken, verifySuperAdmin, getAllDepartments);
 router.get("/:departmentId", verifyToken, verifySuperAdmin, getDepartmentById);
 router.put("/:departmentId", verifyToken, verifySuperAdmin, updateDepartment);
 router.patch("/:departmentId/activate", verifyToken, verifySuperAdmin, activateDepartment);
 router.patch("/:departmentId/deactivate", verifyToken, verifySuperAdmin, deactivateDepartment);

 export default router;