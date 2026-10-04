import pool from "../config/db.js";
import bcrypt from "bcrypt";
import { 
    createUser,
    findUserByEmail,
    findAllUsers,
    findUserById,
    updateUserById,
    updateUserPassword,
    deactivateUserById,
    activateUserById
 } from "../models/userModel.js";

import { 
    createUserRole, updateUserRole 
    } from "../models/userRoleModel.js";

export async function createUserControl(req, res, next) {
    const connection = await pool.connect();

    try {
        const {
            firstName,
            lastName,
            email,
            password,
            isActive = true,
            roleId,
            departmentId,
            contactNumber,
            employeeNumber,
            position,
        } = req.body;

//  -   -   Basic validation    -   -
        if (!firstName 
            || !lastName 
            || !email 
            || !password 
            || !roleId 
            || !departmentId
        ) {
            connection.release();

            return res.status(400).json({
                message: "Name, email, password, roles and department are required."
            });
        }
//  -   -   check email if exist    -   -
        const existUser = await findUserByEmail(email, connection);

        if (existUser) {
            connection.release();

            return res.status(409).json({
                message: "Email already exist."
            });
        }

//  -   -   password hash here before data passed to createUser()   -   -
        const passwordHash = await bcrypt.hash(password, 10);

        const userData = {
            firstName,
            lastName,
            email,
            passwordHash,
            isActive,
            departmentId,
            roleId,
            contactNumber,
            employeeNumber,
            position,
            createdBy: req.user?.userId || null,
            updatedBy: req.user?.userId || null
        };
        //  -   - TRANSACTION starts here   -   -
        await connection.query("BEGIN");

        //  -   -   Create user -   -
        const newUser = await createUser(userData, connection);

        //  -   -   Create role assignment  -   -
        const newUserRole = await createUserRole({
                userId: newUser.user_id,
                roleId: roleId,
                updatedBy: req.user.userId
        },
            connection
    );
    //  -   -   commit TRANSACTION  -   -
        await connection.query("COMMIT");

        connection.release();

        return res.status(201).json({
            message: "User has been created successfully",
            data:{
                user: newUser,
                role: newUserRole
            }
        });
        
    } catch (error) {
        //  -   -   rollback TRANSACTION    -   -
        await connection.query("ROLLBACK");
        connection.release();
        next(error);
    }
}

export async function getUsers(_req, res, next) {
    try {
        // console.log("GET USERS: controller reached");
        const users = await findAllUsers();
/*         console.log("get users: db query is done")
        console.log("Get users = ", users) */

        return res.status(200).json({
            data: users
        });
    } catch (error) {
        // console.log("Get users error = ", error);
        next(error);
    }
    
}

export async function getUserById(req, res, next) {
    try {
        const { id } = req.params;


        const user = await findUserById(id);

        if(!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            data: user
        });
    }   catch (error) {
        next(error);
    }
}

export async function updateUser(req, res, next) {
        const connection = await pool.connect();

    try {
        const { id } = req.params;

        const {
            firstName,
            lastName,
            email,
            departmentId,
            contactNumber,
            employeeNumber,
            position,
            roleId,
        } = req.body;

        if (!firstName || !lastName || !email || !departmentId) {
            return res.status(400).json({
                message: "Name, email, department, role, position, empNUmber requireder."
            });
        }

        const targetUserId = Number(id);
        const loggedInUserId = Number(req.user.userId);
        const loggedInRole = req.user.roleName;

        const isSuperAdmin = loggedInRole === "Super admin";
        const isOwnAccount = loggedInUserId === targetUserId;

        if(!isSuperAdmin && !isOwnAccount) {
            return res.status(403).json({
                error: "Not authorized to change here"
            });
        }
        await connection.query("BEGIN");

        const updatedUser = await updateUserById(
            targetUserId,
            {
                firstName,
                lastName,
                email,
                departmentId,
                contactNumber,
                employeeNumber,
                position,
                updatedBy: req.user.userId
            },
            connection
        );

        if (!updatedUser) {
            await connection.query("ROLLBACK");
            connection.release();

            return res.status(404).json({
                message: "User was not found"
            });
        }

        const updatedUserRole = await updateUserRole(
            
            targetUserId,
            roleId,
            req.user.userId,
            connection
        );

        await connection.query("COMMIT");

        connection.release();

        return res.status(200).json({
            message: "User has been updated successfully",
            data: {
                user: updatedUser,
                role: updatedUserRole
            }
        });

    } catch (error) {
        await connection.query("ROLLBACK");
        connection.release();

        next(error);
    }
    
}

export async function updatePassword(req, res, next) {
    try {
        const { id } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                error: "Password is required"
            });
        }

        const targetUserId = Number(id);
        const loggedInUserId = Number(req.user.userId);
        const loggedInRole = req.user.roleName;

        const isSuperAdmin = loggedInRole ==="Super admin";
        const isOwnAccount = loggedInUserId === targetUserId;

        if(!isSuperAdmin && !isOwnAccount) {
            return res.status(403).json({
                error: "not authorized to change password"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const updatedUser = await updateUserPassword(
            targetUserId, passwordHash
        );

        if (!updatedUser) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        return res.status(200).json({
            message: "Password updated successfully"
        });
    } catch (error) {
        next(error);
    }
}

export async function deactivateUser(req, res, next) {
    try {
        const { id } = req.params;

        const deactivatedUser = await deactivateUserById(
            id,
        req.user.userId
    );

        if (!deactivatedUser) {
            return res.status(404).json({
                message: "User not found",
                data: deactivatedUser
            });
        }

        return res.status(200).json({
                message: "User deactivated successfully"
        });

    } catch (error) {
        next(error);
    }
}

export async function activateUser(req, res, next) {
    try{
        const { id } = req.params;

        const user = await activateUserById(
            id,
            req.user.userId
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }
        return res.status(200).json({
            message: "User has been activated successfully",
            data: user
        });
    } catch (error) {
        next(error);
    }
}