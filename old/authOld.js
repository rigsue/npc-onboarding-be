import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

//  -   -   create access token -   -
export async function createAccessToken(users) {
    const data = {
        user_id: users.user_id,
        email: users.email,
        isAdmin: users.isAdmin,
        isSuperAdmin: users.isSuperAdmin
    };
    return jwt.sign(data, JWT_SECRET_KEY, {});
}
//  -   -   middleware token
    export async function verify(req, res, next) {
        console.log(req.headers.authorization);

        let token = req.headers.authorization;

        if(typeof token === undefined){
            return res.send({ auth: "Failed. No Token Provided" });
        } else {

            token = token.slice(7, token.length);
            console.log(token);

            jwt.verify(token, JWT_SECRET_KEY, function(err, decodeToken){
                if(err) {
                    return res.status(404).send({
                        auth: "Failed",
                        error: "User not found",
                        message: err.message
                    });
                }
                req.users = decodeToken;

                next();
            });
        }
    }
//  -   -   verify admin    -   -
    export async function verifyAdmin(req, res, next) {
        if(req.users.isAdmin) {
            next();
        } else {
            return res.status(403).send({
                auth: "Failed",
                message: "Action Forbidden. Not an Admin Account"
            });
        }
    }
//  -   -   verify super admin    -   -
    export async function verifySuperAdmin(req, res, next) {
        if(req.users.isSuperAdmin) {
            next();
        } else {
            return res.status(403).send({
                auth: "Failed",
                message: "Action Forbidden. Not a Super Admin Account"
            });
        }
    }