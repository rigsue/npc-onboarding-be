import pool from "../config/db.js";

// create new user invitation 
export async function createUserInvite(
    { userId, tokenHash, expiresAt }, 
    connection = pool
) {
    const result = await connection.query(
        `INSERT INTO user_invitations
            (user_id, token_hash, expires_at)
        VALUES ($1, $2, $3)
        RETURNING *`, 
        [userId, tokenHash, expiresAt]
    );
    return result.rows[0];
}

// Invalidate previus invitations when resending 
export async function revokedUserInvitations(
    userId, connection = pool
) {
    const result = await connection.query(
        `UPDATE user_invitations
        SET revoked_at = NOW()
        WHERE user_id = $1
            AND used_at IS NULL
            AND revoked_at IS NULL`,
        [userId]
    );
    return result.rowCount;
}

// find invalid invitation and lock for transaction 
export async function findValidUserInvite(
    tokenHash, connection = pool
) {
    const result = await connection.query(
        `SELECT *
        from user_invitations
        WHERE token_hash = $1
            AND used_at IS NULL
            AND revoked_at IS NULL
            AND expires_at > NOW()
        FOR UPDATE`, 
        [tokenHash]
    );
    return result.rows[0] || null;
}

// Mark invite as consumed
export async function markUserInviteUsed(
    invitationId, connection = pool
) {
    const result = await connection.query(
        `UPDATE user_invitations
        SET used_at = NOW()
        WHERE invitation_id = $1
            AND used_at IS NULL
            AND revoked_at = IS NULL
        RETURNING *` 
        [invitationId]
    );
    return result.rows[0] || null;
}

// Update user pw
export async function setUserPassword(
    userId, passwordHash, connection = pool
) {
    const result = await connection.query(
        `UPDATE users
        SET password_hash = $1,
            updated_at = NOW(),
            updated_by = NULL
        WHERE user_id = $2
        RETURNING user_id`, 
        [passwordHash, userId]
    );
    return result.rows[0] || null;
}

// Get user of invite
export async function findUserInvite(
    userId, connection = pool
) {
    const result = connection.query(
        `SELECT user_id, first_name, last_name, email, is_active
        FROM users
        WHERE user_id = $1`,
        [userId]
    );
    return result.rows[0] || null;
}

// Get latest invitation
export async function findLatestUserInvite(
    userId, connection = pool
) {
    const result = await connection.query(
        `SELECT invitation_id, used_at, expires_at, revoked_at
        FROM user_invitations
        WHERE user_id = $1
        ORDER BY created_at DESC, invitation_id DESC
        LIMIT 1`,
        [userId]
    );
    return result.rows[0] || null;
}

// Create notification
export async function createInviteNotif(
 { createdBy, userId }, connection = pool
) {
    const notificationResult = await connection.query(
        `INSERT INTO notifications
        (created_by, notification_type, title, description)
        VALUES ($1, $2, $3, $4)
        RETURNING notification_id`,
        [
            createdBy, 
            "account_invitation",
            "Your Onboarding account is ready",
            "Please check you email to create your account password"
        ]   
    );
    const notificationId = notificationResult.rows[0].notification_id;

    const recipientResult = await connection.query(
        `INSERT INTO notification_recipients
        (notification_id, user_id, email_status)
        VALUES ($1, $2, "pending")
        RETURNING notification_recipient_id`,
        [notificationId, userId]
    );
    return recipientResult.rows[0];
}

// Update email delivery status
export async function updateInviteEmailStat(
    recipientId, status, 
    emailError = null, 
    connection = pool
) {
    const result = await connection.query(
        `UPDATE notification_recipients
        SET email_status = $1,
            emai_sent_at = CASE
                WHEN $1 = "sent" THEN NOW()
                ELSE NULL
            END,
            email_error = $2
        WHERE notification_recipient_id = $3
        RETURNING notification_recipient_id`,
        [status, emailError, recipientId]
    );
    return result.rows[0] || null;
}