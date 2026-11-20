import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { findActiveUserSession } from "../models/userSessionModel.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY

//  -   -   Verify access token + Session   -   -
export async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            auth: "Failed",
            message: "No valid auth header provided"
        });
    }
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            auth: "failed",
            message: "No token Provided"
        });
    }
    try {
        const decodedToken = jwt.verify(
            token, JWT_SECRET
        );

        //  Require session id
        if (!decodedToken.sessionId) {
            return res.status(401).json({
                auth: "failed",
                message: "Invalid session, login again"
            });
        }

        // verify database session 
        const session = await findActiveUserSession(
            decodedToken.sessionId
        );
        if (
            !session ||
            String(session.user_id) !== String(decodedToken.userId)
        ) {
            return res.status(401).json({
                auth: "Failed",
                message: "session expired / revoked"
            });
        }
        // attached decoded info 
        req.user = decodedToken;
        
        return next();
    } catch (err) {
        if (
            err.name === "TokenExpiredError" ||
            err.name === "JsonWebTokenError"
        ) {
            return res.status(401).json({
                auth: "Failed",
                message: "Invalid / expired token"
            });
        }
        console.error("Authentication error:", err);

        return res.status(500).json({
            auth: "Failed",
            message: "Authentication verification failed"
        });
    }
}

//  -   -   create access token -   -
/* export function createAccessToken(user) {
    const data = {
        userId: user.user_id,
        email: user.email,
        roleName: user.role_name,
        departmentId: user.department_id,
        contactNumber: user.contact_number,
        position: user.position,
        employeeNumber: user.employee_number
    };
    return jwt.sign(data, JWT_SECRET, {
        expiresIn: "1h"
    });
}
//  -   -   verify token    -   -
    export async function verifyToken(req, res, next) {
        const authHeader = req.headers.authorization;

//  -   -   if no Auth Header   -   -   
        if (!authHeader) {
            return res.status(401).json({
                auth: "Failed",
                message: "No Authorization header provided"
            });
        } 
        
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                auth: "Failed",
                message: "Invalid Authorization header format"
            });
        }

//  -   -   Remove Bearer   -   -
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                auth: "Failed",
                message: "No token provided"
            });
        }

        try {
            const decodedToken = jwt.verify(
                token, JWT_SECRET
            );

//  -   -   Attache decoded user info to req object -   -
            req.user = decodedToken;

            next();
        } catch (err) {
            return res.status(401).json({
                auth: "Failed",
                message: "Invalide/Expired Token"
            });
        }
    } */

//  -   -   verify admin    -   -
    export function verifyAdmin(req, res, next) {
        if(!req.user) {
            return res.status(401).json({
                auth: "Failed",
                message: "Authentication required"
            });
        } 
        
        if (
            req.user.roleName === "Admin" || 
            req.user.roleName === "Super admin"
        ) {
            return next();
        } 
        return res.status(403).send({
            auth: "Failed",
            message: "Action Forbidden. Not an Admin Account"
        });
    }
//  -   -   verify super admin    -   -
    export function verifySuperAdmin(req, res, next) {
        if(!req.user) {
            return res.status(403).json({
                auth: "Failed",
                message: "Authentication required"
            });
        }
        
        if (req.user.roleName === "Super admin") {
            return next();
            
        } 
        return res.status(403).send({
            auth: "Failed",
            message: "Action Forbidden. Not a Super Admin Accouuunt"
        });
    }

    // Verify admin or superadmin
    export async function verifyAdminOrSuperadmin(req, res, next) {
        if(!req.user) {
            return res.status(401).json({
                auth: "Failed",
                message: "Authentication required"
            });
        }
        if(
            req.user.roleName === "Admin" ||
            req.user.roleName === "Super admin"
        ) {
            return next();
        }
        return res.status(403).json({
            auth: "Failed",
            message: "Action Forbid not admin or superad"
        });
    }