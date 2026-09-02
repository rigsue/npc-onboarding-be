import bcrypt from "bcrypt";
// import user from "../models/userModels";
import { 
    createUser,
    findUserByEmail,
    findAllUsers,
    findUserById,
    updateUserById,
    updateUserPassword,
    deactivateUserById
 } from "../models/userModel.js";

export async function createUserControl(req, res, next) {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            isActive = true
        } = req.body;

//  -   -   Basic validation    -   -
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required."
            });
        }
//  -   -   check email if exist    -   -
        const existUser = await findUserByEmail(email);

        if (existUser) {
            return res.status(409).json({
                message: "Email already exist."
            });
        }

//  -   -   password hash here before data passed to createUser()   -   -

        const userData = {
            firstName,
            lastName,
            email,
            passwordHash: password,
            isActive,
            createdBy: req.user?.user_id || null,
            updatedBy: req.user?.user_id || null
        };

        const newUser = await createUser(userData);

        return res.status(401).json({
            message: "User has been created successfully",
            data: newUser
        });
    } catch (error) {
        next(error);
    }
}

export async function getUsers(req, res, next) {
    try {
        const users = await findAllUsers();

        return res.status(200).json({
            data: users
        });
    } catch (error) {{
        next(error);
    }}
    
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

        return res.status(201).json({
            data: user
        });
    }   catch (error) {
        next(error);
    }
}

export async function updateUser(req, res, next) {
    try {
        const { id } = req.params;

        const {
            firstName,
            lastName,
            email,
            isActive,
        } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required."
            });
        }

        const updatedUser = await updateUserById(
            id,
            {
                firstName,
                lastName,
                email,
                isActive,
                updatedBy: req.user.user_id
            }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User was not found"
            });
        }
        return res.status(200).json({
            message: "User has been updated successfully",
            user: updateUser
        });
    } catch (error) {
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

        const passwordHash = await bcrypt.hash(password, 10);

        const updatedUser = await updateUserPassword(
            id, passwordHash
        );

        if (!updateUser) {
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

        const deactivatedUser = await deactivateUserById(id);

        if (!deactivatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
                message: "User deleted successfull"
        });

    } catch (error) {
        next(error);
    }
}