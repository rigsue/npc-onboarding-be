// import {jwt} from "jsonwebtoken"
import bcrypt from "bcrypt";
import { findUserForLogin } from "../models/authModel.js";
import { createAccessToken } from "../middlewares/auth.js";

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        //  -   -   request validation  -   -
        if (!email || !password) {
            const error = new Error(
                "Email and password are required"
            );
            
            error.status = 400;
            error.code = "missing_credentials";

            throw error;
        }
        // -    -   find user   -   -
        const user = await findUserForLogin(email);

        if(!user) {
            const error = new Error(
                "Invalid email or password"
        )
        error.status = 401;
        error.code = "invalid_credentials";

        throw error;
    }

    //  -   -   Check user if active    -   -
        if (!user.is_active) {
            const error = new Error(
                "This account is inactive"
            );
            error.status = 403;
            error.code = "inactive_account";

            throw error;
        }

        //  -   -   Verify Password
        const passwordMatch = await bcrypt.compare(
            password, user.password_hash
            );

            if (!passwordMatch) {
                const error = new Error(
                    "Invalidey email or password"
                )
                error.status = 401;
                error.code = "invalid_credentials";

                throw error;
            }    

//  -   -   Create JWT  -   -   
            const  token = await createAccessToken(user);

//  -   -   if ok   -   -
            return res.status(200).json({
                message: "Login successful", 
                
                user: {
                    userId: user.user_id,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    email: user.email,
                    roleName: user.role_name,
                    isActive: user.is_active,
                    position: user.position,
                    employeeNumber: user.employee_number,
                    contactNumber: user.contact_number,
                    departmentName: user.department_name,
                },
                token: token
            });

        } catch (err) {
            next(err);
    }
}

export async function logout(_req, res, next) {
   try { 
        return res.status(200).json({
            message: "Logout successful"
        });
    } catch (error) {
        next(error);
    }
}