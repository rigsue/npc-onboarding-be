import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET_KEY;

if (!JWT_SECRET) {
    throw new Error("JWT key missing from env");
}

const ACCESS_TOKEN_EXPIRY =  "15m";

export const REFRESH_TOKEN_DAYS = 7;

export function generateRefreshToken() {
    return crypto.randomBytes(64).toString("hex");
};

export function hashRefreshToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
};

export function generateAccessToken(user, sessionId){

    const payload = {
        userId: user.user_id,
        email: user.email, 
        roleName: user.role_name,
        departmentId: user.department_id,
        contactNumber: user.contact_number,
        position: user.position,
        aboutMe: user.about_me,
        sessionId
    };
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY
    });
};

export function getRefreshExpiry() {
    const expiry = new Date();

    expiry.setDate(expiry.getDate() + REFRESH_TOKEN_DAYS);

    return expiry;
};

export function setRefreshCookie(res, token) {
    res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
        path: "/user-session"
    });
}

export function clearRefreshCookie(res) {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/user-session"
    });
};