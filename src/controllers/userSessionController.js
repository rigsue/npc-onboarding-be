import crypto from "crypto";

import {
    findSessionByRefreshHash,
    findActiveUserSession,
    rotateUserSessionToken,
    revokeUserSession,
    revokeAllUserSessions,
    getUserSessions
} from "../models/userSessionModel.js";

import {
    generateRefreshToken,
    hashRefreshToken,
    generateAccessToken,
    getRefreshExpiry,
    setRefreshCookie,
    clearRefreshCookie
} from "../utils/tokenUtils.js";

import { findUserById } from "../models/userModel.js";

const safeCompare = (a, b) => {
    if (!a || !b || a.length !== b.length) {
        return false;
    }
    return crypto.timingSafeEqual(
        Buffer.from(a),
        Buffer.from(b)
    );
};

export async function refreshSession(req, res, next) {
    try {
        const oldRefreshToken = req.cookies?.refreshToken;

        if (!oldRefreshToken) {
            clearRefreshCookie(res);

            return res.status(401).json({
                message: "Missing refresh token"
            });
        }
        const tokenHash = hashRefreshToken(oldRefreshToken);
        
        const session = await findSessionByRefreshHash(tokenHash);

        if (!session) {
            clearRefreshCookie(res);

            return res.status(401).json({
                message: "Invalid or expired session"
            });
        }
        const activeSession = 
            await findActiveUserSession(session.session_id);
        
        if (!activeSession) {
            clearRefreshCookie(res);

            return res.status(401).json({
                message: "Session expired or revoked"
            });
        }
        if (!safeCompare(
            activeSession.refresh_token_hash, tokenHash
        )) {
            await revokeUserSession(
                activeSession.session_id, "Refresh token reuse detected"
            );
            clearRefreshCookie(res);

            return res.status(401).json({
                message: "Invalid refresh token. login again"
            });
        };
   
    // Load latest user info
        const user = await findUserById(activeSession.user_id);

        if (!user) {
            await revokeUserSession(
                activeSession.session_id, "User account no longer exist"
            );
            clearRefreshCookie(res);

            return res.status(401).json({
                message: "User account not found"
            });
        }
        // Generate replacement refresh token
        const newRefreshToken = generateRefreshToken();

        const newTokenHash = hashRefreshToken(newRefreshToken);

        const rotated = await rotateUserSessionToken({
            sessionId: activeSession.session_id,
            oldTokenHash: tokenHash,
            newTokenHash,
            expiresAt: getRefreshExpiry()
        });

        if (!rotated) {
            clearRefreshCookie(res);

            return res.status(401).json({
                message:"Session changed. Login again"
            });
        }
        const accessToken = generateAccessToken(
            user, activeSession.session_id
        );
        setRefreshCookie(res, newRefreshToken);

        return res.status(200).json({
            message: "Session refreshed successfully",
            token: accessToken
        });
    } catch (error) {
        next (error);
/*         console.error("Refresh session error:", error);
        return res.status(500).json({
            message: "Unable to refresh session"
        }); */
    }
};

//  Logout Current Session
export async function logoutSession(req, res, next) {
    try {
        const userId = req.user.userId;

        await revokeAllUserSessions(
            userId, "User logged out from all devices"
        );
        clearRefreshCookie(res);

        return res.status(200).json({
            message: "All sessions revoked successfully"
        });
    } catch (error) {
        next (error);
    }
};

// Logout all devices
export async function logoutAllSessions(req, res, next) {
    try {
        const userId = req.user.userId;

        await revokeAllUserSessions(
            userId, "User log out from all devices"
        );
        clearRefreshCookie(res);

        return res.status(200).json({
            message: "All sessions revoked successfully"
        });
    } catch (error) {
        next (error);
    }
};

// Get active sessions
export async function getActiveSessions(req, res, next) {
    try {
        const sessions = await getUserSessions(
            req.user.userId
        );
        return res.status(200).json({
            message: "Active sessions retrieved successfully",
            data: sessions
        });
    } catch (error) {
        next (error);
    }
};

// Revoke a particular session
export async function revokeSession(req, res, next) {
    try {
        const { sessionId } = req.params;
        
        const sessions = await getUserSessions(
            req.user.userId
        );
        const ownSession = sessions.some(
            session => session.session_id === sessionId
        );
        if (!ownSession) {
            return res.status(404).json({
                message: "Session not found"
            });
        }
        await revokeUserSession(
            sessionId, "Session revoked by user"
        );
        return res.status(200).json({
            message: "Session revoked successfully"
        });
    } catch (error) {
        next (error);
    }
};