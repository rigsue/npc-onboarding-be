import pool from "../config/db.js"
import {
    findAllRoles,
    findRoleById
} from "../models/roleModel.js";

export async function getRoles(req, res, next) {
    try {
        const roles = await findAllRoles();

        return res.status(200).json({
            data: roles
        });
    } catch (error) {
        next (error);
    }
}

export async function getRoleById(res, req, next) {
    try {
        const { id } = req.params;

        const role = await findRoleById(id);

        if (!role) {
            return res.status(404).json({
                message: "Role not found"
            });
        }
        return res.status(200).json({
            data: role
        });
    } catch (error) {
        next(error);
    }
}