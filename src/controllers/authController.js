// import {jwt} from "jsonwebtoken"
import bcrypt from "bcrypt";
import pool from "../config/db.js";
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
            error.errorCode = "missing_credentials";

            throw error;
        }

        //  -   -   find user   -   -
        const result = await pool.query(
            `
            SELECT
                u.user_id,
                u.first_name,
                u.last_name,
                u.email,
                u.password_hash,
                u.is_active,
                r.role_id,
                r.role_name
            FROM users u
            INNER JOIN user_roles ur
                ON u.user_id = ur.user_id
            INNER JOIN roles r
                ON ur.role_id = r.role_id
            WHERE u.email = $1
            `,
            [email]
        );

        //  -   -   check user if exist   -   -
        if (result.rows.length === 0) {
            const error = new Error(
                "Invalides email or password"
            );
            error.status = 402;
            error.code = "invalid_credentials";

            throw error;
        }

        const user = result.rows[0];

        // check if superAdmin is unable to create User
/*         console.log("LOGIN USER:");
        console.log(user);
        console.log("ROLE:", user.role_name); */

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
                    user_id: user.user_id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email
                },
                token: token
            });

        } catch (err) {
            next(err);
    }
}

export async function logout(req, res) {
    return res.status(200).json({
        message: "Logout successful"
    });
}