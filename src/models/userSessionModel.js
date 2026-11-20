import pool from "../config/db.js";

// New Login Session
export async function createUserSession(
    sessionId, 
    userId, 
    refreshTokenHash, 
    userAgent, 
    ipAddress, 
    expiresAt,
    connection = pool
) {
    const sql = `
        INSERT INTO user_sessions (
            session_id,
            user_id,
            refresh_token_hash,
            user_agent,
            ip_address,
            expires_at
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;

    const values = [
        sessionId, 
        userId,
        refreshTokenHash,
        userAgent,
        ipAddress,
        expiresAt
    ];
    const { rows } = await connection.query(sql, values);

    return rows[0];
};

// check active session
export async function findActiveUserSession(
    sessionId, connection = pool
) {
    const sql = `
        SELECT *
        FROM user_sessions
        WHERE session_id = $1
            AND revoked_at IS NULL
            AND expires_at > NOW()
        LIMIT 1
    `;
    const { rows } = await connection.query(sql, [sessionId]);

    return rows[0] || null;
};

// Rotate refresh token
export async function rotateUserSessionToken({
    sessionId,
    oldTokenHash,
    newTokenHash,
    expiresAt
    }, connection = pool
) {
    const sql = `
        UPDATE user_sessions
        SET
            refresh_token_hash = $1, 
            last_used_at = NOW(),
            expires_at = $2
        WHERE session_id = $3
            AND refresh_token_hash = $4,
            AND revoked_at IS NULL
            AND expires_at > NOW()
        RETURNING session_id, user_id
    `;
    const { rows } = await connection.query(sql, [
        newTokenHash,
        expiresAt,
        sessionId,
        oldTokenHash 
    ]);
    return rows[0] || null;
};

// Revoke one session
export async function revokeUserSession(
    sessionId, reason = "User Logout", connection = pool
) {
    const sql = `
        UPDATE user_sessions
        SET
            revoked_at = NOW(),
            revoke_reason = $2
        WHERE session_id = $1
            AND revoked_at IS NULL
        RETURNING session_id
    `;
    const rows = await connection.query(sql, [
        sessionId, reason
    ]);
    return rows[0] || null;
};

// Revoke all user's sessions
export async function revokeAllUserSessions(
    userId, reason = "All sessions revoked", connection = pool
) {
    const sql = `
        UPDATE user_sessions
        SET
            revoked_at = NOW(),
            revoke_reason = $2
        WHERE user_id = $1
            AND revoked_at IS NULL
        RETURNING session_id
    `;
    const rows = await connection.query(sql, [
        userId, reason
    ]);
    return rows;
};

// Retrieve a user's active sessions
export async function getUserSessions(
    userId, connection = pool
) {
    const sql = `
        SELECT 
            session_id,
            user_id,
            user_agent,
            ip_address,
            created_at,
            last_used_at,
            expires_at
        FROM user_sessions
        WHERE user_id = $1
            AND revoked_at IS NULL
            AND expires_at > NOW()
        ORDER BY last_used_at DESC
    `;
    const { rows } = await connection.query(sql, [userId]);

    return rows;
};

export async function findSessionByRefreshHash(
    tokenHash, connection = pool
) {
    const sql = `
        SELECT *
        FROM user_sessions
        WHERE refresh_token_hash = $1
        LIMIT 1
    `;
    const { rows } = await connection.query(sql, [tokenHash]);

    return rows[0] || null;
};