import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

//  -   -   create access token -   -
export async function createAccessToken(user) {
    const data = {
        userId: user.user_id,
        email: user.email,
        roleName: user.role_name,
        departmentId: user.department_id,
        contactNumber: user.contact_number,
        position: user.position,
        employeeNumber: user.employee_number
    };
    return jwt.sign(data, JWT_SECRET_KEY, {
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
                token, JWT_SECRET_KEY
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
    }

//  -   -   verify admin    -   -
    export async function verifyAdmin(req, res, next) {
        if(!req.user) {
            return res.status(401).json({
                auth: "Failed",
                message: "Authentication required"
            });
        } 
        
        if (req.user.roleName === "Admin" || "Super admin") {
            next();
        }else {
            return res.status(403).send({
                auth: "Failed",
                message: "Action Forbidden. Not an Admin Account"
            });
        }
    }
//  -   -   verify super admin    -   -
    export async function verifySuperAdmin(req, res, next) {
        if(!req.user) {
            return res.status(401).json({
                auth: "Failed",
                message: "Authentication required"
            })
        }
        
        if (req.user.roleName === "Super admin") {
            next();
            
        } else {
            return res.status(403).send({
                auth: "Failed",
                message: "Action Forbidden. Not a Super Admin Accouuunt"
            });
        }
    }

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