import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

//  -   -   create access token -   -
export async function createAccessToken(user) {
    const data = {
        user_id: user.user_id,
        email: user.email,
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
            req.users = decodedToken;

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
        if(!req.users) {
            return res.status(401).json({
                auth: "Failed",
                message: "Authentication required"
            });
        } 
        
        if (req.users.isAdmin) {
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
        if(!req.users) {
            return res.status(401).json({
                auth: "Failed",
                message: "Authentication required"
            })
        }
        
        if (req.users.isSuperAdmin) {
            next();
            
        } else {
            return res.status(403).send({
                auth: "Failed",
                message: "Action Forbidden. Not a Super Admin Account"
            });
        }
    }