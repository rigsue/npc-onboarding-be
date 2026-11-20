import { Router } from "express";

import {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    activateDepartment,
    deactivateDepartment,
    getDeptUsers
} from "../controllers/deptController.js";

import { 
    verifyAdminOrSuperadmin,
    verifySuperAdmin, verifyToken
 } from "../middlewares/auth.js";

 const router = Router();

 router.post("/create-department", verifyToken, verifySuperAdmin, createDepartment);
 router.get("/get-departments", verifyToken, verifySuperAdmin, getAllDepartments);
 router.get("/:departmentId/users", verifyToken, verifySuperAdmin, getDeptUsers);
 router.get("/:departmentId", verifyToken, verifyAdminOrSuperadmin, getDepartmentById);
 router.put("/:departmentId", verifyToken, verifySuperAdmin, updateDepartment);
 router.patch("/:departmentId/activate", verifyToken, verifySuperAdmin, activateDepartment);
 router.patch("/:departmentId/deactivate", verifyToken, verifySuperAdmin, deactivateDepartment);

 export default router;