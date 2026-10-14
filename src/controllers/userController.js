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
import { type } from "node:os";

    // create users
export async function createUserControl(req, res, next) {
    let connection;
    let transactionActive = false;

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

            return res.status(400).json({
                message: "Name, email, password, roles and department are required."
            });
        }
        connection = await pool.connect();
//  -   -   check email if exist    -   -
        const existUser = await findUserByEmail(email, connection);

        if (existUser) {

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
        transactionActive = true;

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
        transactionActive = false;

        return res.status(201).json({
            message: "User has been created successfully",
            data:{
                user: newUser,
                role: newUserRole
            }
        });
        
    } catch (error) {
        //  -   -   rollback TRANSACTION    -   -
        if (transactionActive && connection) {
            try {
                await connection.query("ROLLBACK");
                transactionActive = false;
            } catch (rollbackError) {
                console.error("Transaction rollback failed for create user:", rollbackError);
            }
        }
        return next(error);
    } finally {
        connection?.release();
    }
}

// get all users
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

// get user by id
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

// update user for all roles
export async function updateUser(req, res, next) {
    let conn;
    let transactionActive = false;

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
            aboutMe,
            roleId,
        } = req.body;

            if (
                (firstName !== undefined && (
                    typeof firstName !=="string" || !firstName?.trim())) ||
                (lastName !== undefined && (
                    typeof lastName !== "string" || !lastName?.trim())) ||
                (email !== undefined && (
                    typeof email!== "string" || !email?.trim()))
            ) {
                return res.status(400).json({
                    message: "Name and email cannot be empty.",
                });
            }

        const targetUserId = Number(id);
        const loggedInUserId = Number(req.user.userId);
        const loggedInRole = req.user.roleName;

        const isSuperAdmin = loggedInRole === "Super admin";
        const isOwnAccount = loggedInUserId === targetUserId;

        if (!isSuperAdmin) {
            if (
                departmentId !== undefined ||
                roleId !== undefined ||
                employeeNumber !== undefined ||
                position !== undefined
            ) {
                return res.status(403).json({
                    message: "Only Super admin can change department, role, employee number, and position."
                });
            }
        }

        // non superadmin can only update own account
        if(!isSuperAdmin && !isOwnAccount) {
            return res.status(403).json({
                error: "Not authorized to change here"
            });
        }

//  Validation - superadmin must include roles
        if (
            isSuperAdmin &&
            Object.hasOwn(req.body, "roleId") &&
            (roleId === null || roleId === undefined)
        ) {
            return res.status(400).json({
                message: "roleId cannot be null."
            });
        }

        // acquiring connection after validation
        connection = await pool.connect();

        const updates = {
            ...(firstName !== undefined && { firstName }),
            ...(lastName !== undefined && { lastName }),
            ...(email !== undefined && { email }),
            ...(departmentId !== undefined && { departmentId }),
            ...(contactNumber !== undefined && { contactNumber }),
            ...(employeeNumber !== undefined && { employeeNumber }),
            ...(position !== undefined && { position }),
            ...(aboutMe !== undefined && { aboutMe }),
            updatedBy: req.user.userId,
        };

//  starting transaction
        await connection.query("BEGIN");
        transactionActive = true;

        // Update user information first
        const updatedUser = await updateUserById(
            targetUserId,
            updates,
            connection
        );

        if (!updatedUser) {
            await connection.query("ROLLBACK");
            transactionActive = false;

            return res.status(404).json({
                message: "User was not found"
            });
        }

        // Update role once Super admin provides roleId
        let updatedUserRole = null;

        if (isSuperAdmin && Object.hasOwn(req.body, "roleId")) {
            updatedUserRole = await updateUserRole(
                targetUserId,
                roleId,
                req.user.userId,
                connection
            );
        }

        await connection.query("COMMIT");
        transactionActive = false;

        return res.status(200).json({
            message: "User has been updated successfully",
            data: {
                user: updatedUser,
                role: updatedUserRole
            }
        });

    } catch (error) {
        if (transactionActive && connection) {
            try {
                await connection.query("ROLLBACK");
                transactionActive = false;
            } catch (rollbackError) {
                console.error("transaction rollback failed for Update user:", rollbackError);
            }
        }
        return next(error);
    } finally {
        connection?.release();
    }
}

// update user password with all acounts except admin cannot edit others password
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