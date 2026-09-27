import {
    makeDepartment,
    findAllDepartments,
    findDepartmentById,
    updateDepartmentById,
    deactivateDepartmentById
} from "../models/deptModel.js";

export async function createDepartment(req, res, next) {
    try {
        const {
            departmentName,
            description,
            isActive
        } = req.body;

        if (!departmentName) {
            return res.status(400).json({
                success: false,
                message: "Department name is required"
            });
        }

        const department = await makeDepartment({
            departmentName,
            description,
            isActive: isActive ?? true,
            createdBy: req.user.userId,
            updatedBy: req.user.userId
        });
        return res.status(201).json({
            message:"Successfully created a department",
            data: department
        });

    } catch (error) {
        next(error);
    }
}

export async function getAllDepartments(_req, res, next) {
    try{
        const departments = await findAllDepartments();

        return res.status(200).json({
            success: true,
            data: departments
        });
    } catch (error) {
        next(error);
    }
}

export async function getDepartmentById(req, res, next) {
    try{
        const { departmentId } = req.params;

        const department = await findDepartmentById(departmentId);

        if(!department) {
            return res.status(404).json({
                success: false,
                message: "department not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: department
        });
    } catch (error) {
        next(error);
    }
}

export async function updateDepartment(req, res, next) {
    try {
        const { departmentId } = req.params;

        const {
            departmentName,
            description,
            isActive,
        } = req.body;

        if (!departmentName) {
            return res.status(400).json({
                success: false,
                message: "Department name required"
            });
        }

        const department = await updateDepartmentById(
            departmentId,
            {
                departmentName,
                description,
                isActive,
                updatedBy: req.user.userId
            }
        );

        if(!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Department updated successfully",
            data: department
        });
    } catch (error) {
        next(error);
    }
}

export async function deactivateDepartment(req, res, next) {
    try {
        const { departmentId } = req.params;

        const department = await deactivateDepartmentById(
            departmentId,
            req.user.userId
        );
        if(!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Department deactivated successfully",
            data: department
        });
    } catch (error) {
        next(error);
    }
}